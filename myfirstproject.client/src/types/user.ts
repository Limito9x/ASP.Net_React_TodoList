import type { BaseEntity } from "./common";

export interface User extends BaseEntity {
  userName: string;
  fullName: string;
  email: string;
}