import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username: username }
    });
    if (user && user.validatePassword(password)) {
      return user;
    }
    return null;
  }

  async signIn(user: UserEntity) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }
}
