import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';

@Injectable()
export class MailerSenderService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmMail(name, urlConfirmAddress: string, emailTo: string) {
    return await this.mailerService
      .sendMail({
        to: emailTo,
        subject: 'Email confirming',
        template: join(__dirname, '/templates', 'confirmReg'),
        context: {
          id: 1,
          username: name,
          urlConfirmAddress,
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
  async sendRequestForChangingBaristaPasswordToAdmin(
    admin_name: string,
    id_barista: number,
    barista_email: string,
    emailTo: string,
  ) {
    return await this.mailerService
      .sendMail({
        to: emailTo,
        subject: 'Updating password for Barista',
        template: join(__dirname, '/templates', 'requestUpdatingBaristaPass'),
        context: { admin_name, id_barista, barista_email },
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
  async sendConfirmUpdatingPasswordForAdmin(
    admin_name,
    urlConfirmAddress: string,
    emailTo: string,
  ) {
    return await this.mailerService
      .sendMail({
        to: emailTo,
        subject: 'Confirm updating password',
        template: join(__dirname, '/templates', 'updatingAdminPass'),
        context: {
          admin_name,
          urlConfirmAddress,
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
  async sendEmailAboutUpdatingLoginData(
    name,
    email,
    password,
    emailTo: string,
  ) {
    return await this.mailerService
      .sendMail({
        to: emailTo,
        subject: 'Your new login data',
        template: join(__dirname, '/templates', 'loginDataUpdating'),
        context: {
          name,
          email,
          password,
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }

  async sendEmailWithLoginData(name, email, password, emailTo: string) {
    return await this.mailerService
      .sendMail({
        to: emailTo,
        subject: 'Your account`s login data',
        template: join(__dirname, '/templates', 'loginData'),
        context: {
          name,
          email,
          password,
        },
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
