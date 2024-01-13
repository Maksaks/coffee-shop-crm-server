import { PartialType } from '@nestjs/mapped-types';
import { CreateBaristaDto } from './create-barista.dto';

export class UpdateBaristaDto extends PartialType(CreateBaristaDto) {}
