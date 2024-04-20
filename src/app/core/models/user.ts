import { Role } from './role';

export class User {
  id!: number;
  img!: string;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  roleId!: number;
  branch!: string;
  branchLogo!:string;
  token!: string;
  permissions! : string [];
}
