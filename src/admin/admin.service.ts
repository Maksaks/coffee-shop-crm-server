import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { MailerSenderService } from 'src/mailer/mailer.service';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly mailerService: MailerSenderService,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const existedAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    if (existedAdmin) {
      return new BadRequestException(
        `Admin with email ${createAdminDto.email} has already existed`,
      );
    }
    await this.mailerService.sendEmailWithLoginData(
      createAdminDto.surname + ' ' + createAdminDto.name,
      createAdminDto.email,
      createAdminDto.password,
      createAdminDto.email,
    );
    const newAdmin = {
      ...createAdminDto,
      password: await argon2.hash(createAdminDto.password),
    };
    return await this.adminRepository.save(newAdmin);
  }

  async findOne(id: number) {
    const existedAdmin = await this.adminRepository.findOne({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }
    return existedAdmin;
  }

  async findOneByEmail(email: string) {
    const existedAdmin = await this.adminRepository.findOne({
      where: { email },
    });
    if (!existedAdmin) {
      return new BadRequestException(`Admin hasn\`t already existed`);
    }
    return existedAdmin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const existedAdmin = await this.adminRepository.findOne({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }

    if (updateAdminDto.password) {
      await this.mailerService.sendEmailAboutUpdatingLoginData(
        existedAdmin.surname + ' ' + existedAdmin.name,
        existedAdmin.email,
        updateAdminDto.password,
        existedAdmin.email,
      );
      updateAdminDto.password = await argon2.hash(updateAdminDto.password);
    }
    return await this.adminRepository.update(id, updateAdminDto);
  }

  async remove(id: number) {
    const existedAdmin = await this.adminRepository.findOne({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }
    return await this.adminRepository.delete(id);
  }

  async confirmEmail(id: number) {
    const existedAdmin = await this.adminRepository.findOne({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }
    existedAdmin.isEmailConfirmed = true;
    return this.adminRepository.save(existedAdmin);
  }
}
