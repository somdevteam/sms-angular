// user-dto.model.ts
export interface UserDto {
    userId: number;
    email: string;
    username: string;
    password: string;
    isActive: boolean;
    datecreated: string; // You can use a Date object instead if you prefer
    dateModified: string; // You can use a Date object instead if you prefer
  }
  