/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { BaristaService } from 'src/barista/barista.service';
import { Barista } from 'src/barista/entities/barista.entity';
import { Roles } from 'src/enums/Roles.enum';
import { UserData } from './types/UserData.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly baristaService: BaristaService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    let role = Roles.Barista;
    let user: Barista | Admin = (await this.baristaService.findOneByEmail(
      email,
    )) as Barista;
    if (!user) {
      user = (await this.adminService.findOneByEmail(email)) as Admin;
      role = Roles.Admin;
    }
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    const isCorrectPassword = await argon2.verify(user.password, pass);
    if (user && isCorrectPassword) {
      const { password, ...result } = user;
      if (role == Roles.Barista) {
        const barista = user as Barista;
        return { ...result, role, adminID: barista.admin.id };
      }
      return { ...result, role };
    }
    throw new UnauthorizedException('User or password are incorrect');
  }
  async login(user: UserData) {
    return {
      ...user,
      token: this.jwtService.sign(user),
    };
  }
}
