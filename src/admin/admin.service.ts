import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const existedAdmin = await this.adminRepository.find({
      where: { email: createAdminDto.email },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with email ${createAdminDto.email} has already existed`,
      );
    }
    const newAdmin = {
      ...createAdminDto,
    };
    return await this.adminRepository.save(newAdmin);
  }

  async findOne(id: number) {
    const existedAdmin = await this.adminRepository.find({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }
    return existedAdmin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const existedAdmin = await this.adminRepository.find({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }
    return await this.adminRepository.update(id, updateAdminDto);
  }

  async remove(id: number) {
    const existedAdmin = await this.adminRepository.find({
      where: { id },
    });
    if (!existedAdmin) {
      return new BadRequestException(
        `Admin with #${id} hasn\`t already existed`,
      );
    }
    return await this.adminRepository.delete(id);
  }
}
