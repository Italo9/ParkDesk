import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly statusByName: Record<string, number> = {
    CompanySettingNotFound: 404,
    CompanyNotFound: 404,
    ApiKeyNotFound: 404,
    TicketNotFound: 404,
    UserNotFound: 404,
    UserCompanyNotFound: 404,
    CheckoutNotFound: 404,
    TicketNotFoundOrPaid: 404,
    CompanySettingAlreadyExists: 400,
    InvalidExpirationDate: 400,
    InvalidTicketStatus: 400,
    InvalidTicket: 400,
    CompanyEmailAlreadyExists: 400,
    CompanyCnpjAlreadyExists: 400,
    CompanyTypeRequired: 400,
    DifferentialNotAvailable: 400,
    ToleranceNotExceeded: 400,
    InvalidToken: 401,
    PaymentAuthError: 401,
    OperationNotAllowed: 403,
    TicketCompanyMissing: 403,
    TicketAccessDenied: 403,
    ApiKeyCompanyMissing: 403,
    CompanyAssociationError: 500,
    CompanyCreateError: 500,
    PaymentGatewayError: 500,
    BaseUrlNotConfigured: 500,
    WebhookProcessingError: 500,
  };

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof Error) {
      const status = this.statusByName[exception.name] ?? 500;
      response.status(status).json({
        statusCode: status,
        error: exception.name,
        message: exception.message,
      });
      return;
    }

    response.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
}
