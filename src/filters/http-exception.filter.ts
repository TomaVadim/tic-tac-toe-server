import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error(
      `Exception thrown: ${exception.message || exception}`,
      JSON.stringify({
        stack: exception.stack,
        response:
          exception instanceof HttpException ? exception.getResponse() : null,
      }),
    );

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { message: exceptionResponse }),
      });
    }

    const errorResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Bad request.',
    };

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
