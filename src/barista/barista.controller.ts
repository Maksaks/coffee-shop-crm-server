import { Controller } from '@nestjs/common';
import { BaristaService } from './barista.service';

@Controller('barista')
export class BaristaController {
  constructor(private readonly baristaService: BaristaService) {}
}
