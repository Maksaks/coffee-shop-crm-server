import { Roles } from 'src/enums/Roles.enum';

export type AuthUserData = {
  id: number;
  name: string;
  surname: string;
  email: number;
  role: Roles;
  admin?: {
    id: number;
  };
};
