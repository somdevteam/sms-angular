export class UserOperation {
  constructor(
    public _id: string,
    public email: string,
    public username: string,
    public password: string,
    public firstname: string,
    public lastName: string,
    public middlename: string,
    public mobile: number,
    public city: string,
    public zipcode: string,
    public country: string,
    public address: string,
    public isActive: string,
    public userRoleType: string,
  ) {
  }
}
