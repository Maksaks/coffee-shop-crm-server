import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { AuthService } from './auth.service';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async registrationAdmin(@Body() adminRegistrationDto: CreateAdminDto) {
    return this.authService.registrationAdmin(adminRegistrationDto);
  }

  @Get('confirming/:token')
  async confirmingEmail(@Param('token') token: string) {
    return this.authService.confirmingEmail(token);
  }

  @Post('password/restore')
  @UsePipes(new ValidationPipe())
  async restorePassword(@Body() restorePasswordDto: RestorePasswordDto) {
    return this.authService.restorePassword(restorePasswordDto);
  }

  @Post('password/update/:token')
  @UsePipes(new ValidationPipe())
  async updatingPassword(
    @Param('token') token: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(token, updatePasswordDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}
