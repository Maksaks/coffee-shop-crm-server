/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Admin } from 'src/admin/entities/admin.entity';
import { getMonthBefore } from 'src/helpers/GetingDate.helper';
import { MailerSenderService } from 'src/mailer/mailer.service';
import { Point } from 'src/points/entities/points.entity';
import { Shift, ShiftStatus } from 'src/shifts/entities/shift.entity';
import { Between, Repository } from 'typeorm';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { Barista } from './entities/barista.entity';

@Injectable()
export class BaristaService {
  constructor(
    @InjectRepository(Barista)
    private readonly baristaRepository: Repository<Barista>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    private readonly mailerService: MailerSenderService,
  ) {}
  async create(adminID: number, createBaristaDto: CreateBaristaDto) {
    await this.checkEmailUnique(createBaristaDto.email);
    await this.mailerService.sendEmailWithLoginData(
      createBaristaDto.surname + ' ' + createBaristaDto.name,
      createBaristaDto.email,
      createBaristaDto.password,
      createBaristaDto.email,
    );
    const newBarista = {
      ...createBaristaDto,
      password: await argon2.hash(createBaristaDto.password),
      admin: { id: adminID },
    };
    return await this.baristaRepository.save(newBarista);
  }

  async findAll(adminID: number) {
    return await this.baristaRepository.find({
      where: { admin: { id: adminID } },
      relations: {
        points: true,
        orders: true,
        shifts: true,
      },
    });
  }

  async findOne(id: number, adminID: number) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!exsitedBarista)
      return new BadRequestException(`No barista with #${id}`);
    return await this.baristaRepository.findOne({
      where: { id },
      relations: { points: true, shifts: true, orders: true },
    });
  }

  async findOneByEmail(email: string) {
    const existedBarista = await this.baristaRepository.findOne({
      where: { email },
      relations: { admin: true },
    });
    if (!existedBarista) {
      throw new BadRequestException(
        `Barista with email ${email} was not found`,
      );
    }
    return existedBarista;
  }

  async update(
    id: number,
    adminID: number,
    updateBaristaDto: UpdateBaristaDto,
  ) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: { id: id, admin: { id: adminID } },
    });
    if (!exsitedBarista)
      throw new BadRequestException(`No Barista with #${id}`);

    if (
      updateBaristaDto.email &&
      updateBaristaDto.email !== exsitedBarista.email
    ) {
      await this.checkEmailUnique(updateBaristaDto.email);
      if (!updateBaristaDto.password)
        await this.mailerService.sendEmailAboutUpdatingLoginData(
          exsitedBarista.surname + ' ' + exsitedBarista.name,
          exsitedBarista.email,
          'Password wasn`t changed. Use last one.',
          updateBaristaDto.email,
        );
    }
    if (updateBaristaDto.password) {
      await this.mailerService.sendEmailAboutUpdatingLoginData(
        exsitedBarista.surname + ' ' + exsitedBarista.name,
        updateBaristaDto.email ? updateBaristaDto.email : exsitedBarista.email,
        updateBaristaDto.password,
        updateBaristaDto.email ? updateBaristaDto.email : exsitedBarista.email,
      );
      updateBaristaDto.password = await argon2.hash(updateBaristaDto.password);
    }
    return await this.baristaRepository.update(id, updateBaristaDto);
  }

  async remove(id: number, adminID: number) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: { id: id, admin: { id: adminID } },
    });
    if (!exsitedBarista)
      throw new BadRequestException(`No Barista with #${id}`);
    return await this.baristaRepository.delete(id);
  }

  async setPointToBarista(baristaID: number, pointId: number, adminID: number) {
    const barista = await this.baristaRepository.findOne({
      where: { id: baristaID, admin: { id: adminID } },
      relations: { points: true },
    });
    const point = await this.pointRepository.findOne({
      where: { id: pointId, admin: { id: adminID } },
    });
    if (!barista || !point) {
      throw new BadRequestException(
        'Check input date, one or both entities are not exist',
      );
    }
    if (barista.points.find((point) => point.id == pointId)) {
      throw new BadRequestException(
        `Point with #${pointId} has already included in this barista`,
      );
    }
    barista.points = [...barista.points, point];
    return await this.baristaRepository.save(barista);
  }
  async removePointFromBarista(
    baristaID: number,
    pointId: number,
    adminID: number,
  ) {
    const barista = await this.baristaRepository.findOne({
      where: { id: baristaID, admin: { id: adminID }, points: { id: pointId } },
      relations: { points: true },
    });
    if (!barista) {
      throw new BadRequestException(
        'Check input date, one or both entities are not exist',
      );
    }
    barista.points = barista.points.filter((point) => point.id != pointId);
    return await this.baristaRepository.save(barista);
  }

  async getInfoAboutMeDuringLastMonth(baristaID: number, adminID: number) {
    const { password, ...baristaMe } = await this.baristaRepository.findOne({
      where: { id: baristaID, admin: { id: adminID } },
      relations: { points: true },
    });
    const shiftsMe = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID },
        point: { admin: { id: adminID } },
        status: ShiftStatus.EndOfWork,
        time: Between(getMonthBefore(), new Date()),
      },
    });
    const totalShiftsSalary = shiftsMe.reduce(
      (acc, cur) => acc + cur.baristaSalary,
      0,
    );
    return {
      ...baristaMe,
      totalShiftsSalary,
      shifts: shiftsMe,
    };
  }

  async checkEmailUnique(email: string) {
    const existedBarista = await this.baristaRepository.findOne({
      where: { email },
    });
    const existedAdmin = await this.adminRepository.findOne({
      where: { email },
    });
    if (existedBarista || existedAdmin) {
      throw new BadRequestException(
        `Account with email ${email} has already been existed`,
      );
    }
  }
}
