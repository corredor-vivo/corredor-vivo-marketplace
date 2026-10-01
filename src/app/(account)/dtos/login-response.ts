import { Role } from "../enums/role";

export type AuthUser = {
  id: number;
  uuid: string;
  role: Role;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  photo?: string | null;
};

export type LoginResponse = {
  user: AuthUser;
};
