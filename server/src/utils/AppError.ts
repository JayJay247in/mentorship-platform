// src/utils/AppError.ts
class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // This is necessary to make 'instanceof AppError' work correctly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
