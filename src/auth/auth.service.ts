/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { BaristaService } from 'src/barista/barista.service';
import { Barista } from 'src/barista/entities/barista.entity';
import { Roles } from 'src/enums/Roles.enum';
import { MailerSenderService } from 'src/mailer/mailer.service';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserData } from './types/UserData.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly baristaService: BaristaService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly mailerSenderService: MailerSenderService,
    private readonly configService: ConfigService,
  ) {}

  async registrationAdmin(adminRegistrationDto: CreateAdminDto) {
    const newAdmin = await this.adminService.create(adminRegistrationDto);
    if (newAdmin instanceof BadRequestException) {
      return newAdmin;
    }
    const { id, name, email } = newAdmin as Admin;

    const token = await this.jwtService.signAsync({ id, name, email });
    const confirmationURL = `${this.configService.get('CLIENT_URL')}/confirming/${token}`;
    await this.mailerSenderService.sendConfirmMail(
      name,
      confirmationURL,
      newAdmin.email,
    );
    return 'A letter confirming the registration of your account has been sent to the email address you provided. Follow the link in the letter.';
  }

  async confirmingEmail(token: string) {
    const payload = await this.jwtService.verifyAsync(token).catch((err) => {
      throw new BadRequestException('Incorrect token!!!');
    });
    const admin = await this.adminService.findOne(payload.id);
    if (admin instanceof BadRequestException) {
      return admin;
    }
    const result = await this.adminService.update(admin?.id, {
      isEmailConfirmed: true,
    });
    if (result instanceof BadRequestException) {
      return result;
    }
    return `Email ${admin.email} was confirmed successfully `;
  }

  async restorePassword(restorePasswordDto: RestorePasswordDto) {
    const resultBarista = await this.baristaService.findOneByEmail(
      restorePasswordDto.email,
    );
    if (resultBarista instanceof BadRequestException) {
      const resultAdmin = await this.adminService.findOneByEmail(
        restorePasswordDto.email,
      );
      if (resultAdmin instanceof BadRequestException) {
        return new BadRequestException('Account with this email was not found');
      } else {
        const { id, name, email } = resultAdmin;
        const token = await this.jwtService.signAsync({ id, name, email });
        const confirmationURL = `${this.configService.get('CLIENT_URL')}/password/update/${token}`;
        await this.mailerSenderService.sendConfirmUpdatingPasswordForAdmin(
          name,
          confirmationURL,
          email,
        );
        return `A letter with a link to reset your password has been sent to your email ${email}. Follow the link in the letter.`;
      }
    } else {
      await this.mailerSenderService
        .sendRequestForChangingBaristaPasswordToAdmin(
          resultBarista.admin.name,
          resultBarista.id,
          resultBarista.email,
          resultBarista.admin.email,
        )
        .catch((err) => {
          throw err;
        });

      return `Your administrator ${resultBarista.admin.name} received a notification asking you to change your password. Wait for new input data`;
    }
  }

  async updatePassword(token: string, updatePasswordDto: UpdatePasswordDto) {
    const payload = await this.jwtService.verifyAsync(token).catch((err) => {
      throw new BadRequestException('Incorrect token!!!');
    });
    const admin = await this.adminService.findOne(payload.id);
    if (admin instanceof BadRequestException) {
      return admin;
    }
    const result = await this.adminService.update(admin?.id, updatePasswordDto);
    if (result instanceof BadRequestException) {
      return result;
    }

    return `Password was successfully updated!`;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    let role = Roles.Barista;
    let user: Barista | Admin;
    const result = await this.baristaService.findOneByEmail(email);
    if (result instanceof BadRequestException) {
      const result2 = await this.adminService.findOneByEmail(email);
      if (result2 instanceof BadRequestException) {
        throw new UnauthorizedException('Account was not found');
      }
      user = result2 as Admin;
      role = Roles.Admin;
    } else {
      user = result as Barista;
    }
    if (user instanceof Admin && !user.isEmailConfirmed) {
      throw new UnauthorizedException('First you need to confirm your email');
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
    throw new UnauthorizedException('Email or password are incorrect');
  }
  async login(user: UserData) {
    return {
      ...user,
      token: this.jwtService.sign(user),
    };
  }
}
