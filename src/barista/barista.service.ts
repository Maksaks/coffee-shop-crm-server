import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { MailerSenderService } from 'src/mailer/mailer.service';
import { Point } from 'src/points/entities/points.entity';
import { Repository } from 'typeorm';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { Barista } from './entities/barista.entity';

@Injectable()
export class BaristaService {
  constructor(
    @InjectRepository(Barista)
    private readonly baristaRepository: Repository<Barista>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    private readonly mailerService: MailerSenderService,
  ) {}
  async create(adminID: number, createBaristaDto: CreateBaristaDto) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: {
        email: createBaristaDto.email,
      },
    });
    if (exsitedBarista)
      return new BadRequestException(
        `Barista with email ${createBaristaDto.email} has already existed`,
      );
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
      return new BadRequestException(`No Barista with #${id}`);
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
      return new BadRequestException(
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
      return new BadRequestException(`No Barista with #${id}`);

    if (
      updateBaristaDto.email &&
      updateBaristaDto.email !== exsitedBarista.email
    ) {
      const uniqueEmail = await this.baristaRepository.findOne({
        where: { email: updateBaristaDto.email, admin: { id: adminID } },
      });
      if (uniqueEmail)
        return new BadRequestException(
          `Barista with email ${updateBaristaDto.email}`,
        );
      if (!updateBaristaDto.password)
        await this.mailerService.sendEmailAboutUpdatingLoginData(
          exsitedBarista.surname + ' ' + exsitedBarista.name,
          exsitedBarista.email,
          'Password was changed. Use last one.',
          exsitedBarista.email,
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
      return new BadRequestException(`No Barista with #${id}`);
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
      return new BadRequestException(
        'Check input date, one or both entities are not exist',
      );
    }
    if (barista.points.find((point) => point.id == pointId)) {
      return new BadRequestException(
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
      return new BadRequestException(
        'Check input date, one or both entities are not exist',
      );
    }
    barista.points = barista.points.filter((point) => point.id != pointId);
    return await this.baristaRepository.save(barista);
  }
}
