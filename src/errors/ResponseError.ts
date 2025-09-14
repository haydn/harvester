export class ResponseError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors: string[] = [],
  ) {
    super(message);
  }
}
