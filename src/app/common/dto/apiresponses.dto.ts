export class ApiBaseResponse {
  message: string;
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
} 