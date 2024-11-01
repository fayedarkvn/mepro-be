import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { SALT_ROUND } from 'src/common/constrains/crypto';
import { AccountEntity, AccountProviderEnum } from 'src/entities/account.entity';
import { UserEntity } from 'src/entities/user.entity';
import { GoogleOauthService } from 'src/google-oauth/google-oauth.service';
import { Repository } from 'typeorm';
import { IAuthenticatedUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { GoogleOAuthDto } from './dtos/google-oauth.dto';
import { UserJwtPayloadDto } from './dtos/jwt-payload.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { ImageEntity } from 'src/entities/image.entity';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(ImageEntity) private imageRepo: Repository<ImageEntity>,
    private jwtService: JwtService,
    private googleOAuthService: GoogleOauthService,
    private configService: ConfigService,
    private imageService: ImagesService,
  ) { }

  async authenticateUser(user: UserEntity) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const payload: UserJwtPayloadDto = {
      service: "auth",
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: currentTimestamp,
      exp: currentTimestamp + this.configService.get('jwt.expiresIn', 1440) * 60,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async signIn(dto: SignInDto) {
    const account = await this.accountRepo.findOne({
      where: {
        provider: AccountProviderEnum.LOCAL,
        providerAccountId: dto.username,
      },
      relations: {
        user: true,
      },
    });

    const isPasswordMatch = account && compareSync(dto.password, account.accessToken);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Username or password is not correct');
    }

    const user = account.user;

    await this.imageService.updateImageForObject(user);

    return this.authenticateUser(user);
  }

  async signUp(dto: SignUpDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name,
    });

    await this.userRepo.save(user);

    const account = this.accountRepo.create({
      user: user,
      provider: AccountProviderEnum.LOCAL,
      providerAccountId: dto.email,
      accessToken: hashSync(dto.password, SALT_ROUND),
    });

    await this.accountRepo.save(account);

    await this.imageService.updateImageForObject(user);

    return this.authenticateUser(user);
  }

  async googleSignIn(dto: GoogleOAuthDto) {
    const { tokens } = await this.googleOAuthService.getToken(dto.code).catch(() => {
      throw new UnauthorizedException("Invalid code");
    });

    const ticket = await this.googleOAuthService.verifyIdToken({ idToken: tokens.id_token }).catch(() => {
      throw new UnauthorizedException();
    });

    const payload = ticket.getPayload();

    let user = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
    });

    let account = await this.accountRepo.findOne({
      where: {
        providerAccountId: payload.sub,
        provider: AccountProviderEnum.GOOGLE,
      },
    });

    if (!user) {
      const image = this.imageRepo.create({
        key: "google_" + payload.sub,
        url: payload.picture,
      });

      await this.imageRepo.save(image);

      const newUser = this.userRepo.create({
        email: payload.email,
        name: ticket.getPayload().name,
        image: image.key,
      });

      user = await this.userRepo.save(newUser);
    }

    if (!account) {
      const newAccount = this.accountRepo.create({
        user: user,
        provider: AccountProviderEnum.GOOGLE,
        providerAccountId: payload.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date),
      });

      account = await this.accountRepo.save(newAccount);
    }
    else {
      account.accessToken = tokens.access_token;
      account.refreshToken = tokens.refresh_token;
      account.expiresAt = new Date(tokens.expiry_date);
      await this.accountRepo.save(account);
    }

    await this.imageService.updateImageForObject(user);

    return this.authenticateUser(user);
  }

  async getPassword(authenticatedUser: IAuthenticatedUser) {
    const user = await this.userRepo.findOne({
      where: { id: authenticatedUser.id }
    });

    const account = await this.accountRepo.findOne({
      where: {
        provider: AccountProviderEnum.LOCAL,
        user: user,
      },
    });

    if (!account) {
      return {
        updateAt: null,
      };
    }

    return {
      updateAt: account.updatedAt,
    };
  }

  async chagePassword(dto: ChangePasswordDto, authenticatedUser: IAuthenticatedUser) {
    const user = await this.userRepo.findOne({
      where: { id: authenticatedUser.id }
    });

    const account = await this.accountRepo.findOne({
      where: {
        provider: AccountProviderEnum.LOCAL,
        user: user,
      },
    });

    if (!account) {
      throw new BadRequestException('User does not have password');
    }

    const isPasswordMatch = compareSync(dto.oldPassword, account.accessToken);

    if (!isPasswordMatch) {
      throw new BadRequestException('Old password is not correct');
    }

    account.accessToken = hashSync(dto.newPassword, SALT_ROUND);

    await this.accountRepo.save(account);

    return true;
  }

  async getProfile(authenticatedUser: IAuthenticatedUser) {
    const user = await this.userRepo.findOne({
      where: { id: authenticatedUser.id }
    });

    await this.imageService.updateImageForObject(user);

    return user;
  }
}
