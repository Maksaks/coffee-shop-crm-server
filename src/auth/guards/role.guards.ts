import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_NAME } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enums/Roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_NAME, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowedRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return !!allowedRoles.find((role) => user.role === role);
  }
}
