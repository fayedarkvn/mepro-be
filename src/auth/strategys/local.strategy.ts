import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { Strategy } from 'passport-local';
import { AccountEntity, AccountProviderEnum } from 'src/entities/account.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    username = username.trim().toLowerCase();

    const account = await this.accountRepo.findOne({
      where: {
        providerAccountId: username,
        provider: AccountProviderEnum.LOCAL,
      },
    });

    if (!account) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = compareSync(password, account.accessToken);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepo.findOne({
      where: { id: account.user },
    });

    return user;
  }
}
