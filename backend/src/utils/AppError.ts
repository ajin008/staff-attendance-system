class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "appError";

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
