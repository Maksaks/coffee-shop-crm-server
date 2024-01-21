import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/roles.enum';

export const ROLES_NAME = 'roles';
export const AllowedRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_NAME, roles);
