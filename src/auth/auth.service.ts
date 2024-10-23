import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { SALT_ROUND } from 'src/constrains/crypto';
import { AccountEntity, AccountProviderEnum } from 'src/entities/account.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { IJwtPayload } from './strategys/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    private jwtService: JwtService
  ) { }

  async signIn(user: UserEntity) {
    const payload: IJwtPayload = {
      sub: user.id
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
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
      user: user.id,
      provider: AccountProviderEnum.LOCAL,
      providerAccountId: dto.email,
      accessToken: hashSync(dto.password, SALT_ROUND),
    });

    await this.accountRepo.save(account);

    return this.signIn(user);
  }

  async getPassword(user: UserEntity) {
    const account = await this.accountRepo.findOne({
      where: {
        provider: AccountProviderEnum.LOCAL,
        user: user.id,
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
        user: user.id,
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
