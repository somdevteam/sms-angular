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

// API ERROR MODEL
export class ApiError {
  constructor(public statusCode: number, public message: any, public error: any) {}

  static fromJson({ statusCode, message, error }: { statusCode: number, message: any, error: any }): ApiError {
    return new ApiError(statusCode, message, error);
  }

  public static toJson(apiError: ApiError): ApiError {
    // do data manipulation before sending data to API
    return apiError;
  }
}
