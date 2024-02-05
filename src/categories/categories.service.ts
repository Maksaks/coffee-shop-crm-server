import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(adminID: number, createCategoryDto: CreateCategoryDto) {
    const isCategoryExist = await this.categoryRepository.findBy({
      title: createCategoryDto.title,
      admin: { id: adminID },
    });
    if (isCategoryExist.length) {
      throw new BadRequestException(
        `Category with title "${createCategoryDto.title}" has already existed`,
      );
    }
    const newCategory = {
      title: createCategoryDto.title,
      admin: { id: adminID },
    };
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(adminID: number) {
    return await this.categoryRepository.find({
      where: { admin: { id: adminID } },
    });
  }

  async findOne(id: number, adminID: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        admin: { id: adminID },
      },
      relations: {
        positions: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with #${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    adminID: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!category) {
      throw new NotFoundException(`Category with #${id} not found`);
    }
    if (updateCategoryDto.title) {
      const category = await this.categoryRepository.findOne({
        where: { title: updateCategoryDto.title, admin: { id: adminID } },
      });
      if (category) {
        throw new NotFoundException(
          `Category with name ${updateCategoryDto.title} has already existed`,
        );
      }
    }
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, adminID: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return await this.categoryRepository.delete(id);
  }
}
