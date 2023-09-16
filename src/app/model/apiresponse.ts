export class ApiResult {
    constructor(public message: string, public status: number, public data: any) {}
  
    static fromJson({ message, status, data }: { message: string, status: number, data: any }): ApiResult {
      return new ApiResult(message, status, data);
    }
  
    public static toJson(apiResult: ApiResult): ApiResult {
      // do data manipulation before sending data to API
      return apiResult;
    }
  }