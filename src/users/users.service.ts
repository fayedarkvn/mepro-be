import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      role: 'user',
    },

  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
