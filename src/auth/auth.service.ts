import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { SALT_ROUND } from 'src/constrains/crypto';
import { AccountEntity, AccountProviderEnum } from 'src/entities/account.entity';
import { UserEntity } from 'src/entities/user.entity';
import { GoogleOauthService } from 'src/google-oauth/google-oauth.service';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { GoogleOAuthDto } from './dtos/google-oauth.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { IJwtPayload } from './strategys/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    private jwtService: JwtService,
    private googleOAuthService: GoogleOauthService,
  ) { }

  async authenticateUser(user: UserEntity) {
    const payload: IJwtPayload = {
      sub: user.id
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
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

    return this.authenticateUser(account.user);
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
      const newUser = this.userRepo.create({
        email: payload.email,
        name: ticket.getPayload().name,
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

    return this.authenticateUser(user);
  }

  async getPassword(user: UserEntity) {
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

  async chagePassword(dto: ChangePasswordDto, user: UserEntity) {
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
}
