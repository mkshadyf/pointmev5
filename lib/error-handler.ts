import { Message } from "@/components/form-message";
import { encodedRedirect } from "@/utils/utils";
import { 
  ErrorCode, 
  ErrorCodes, 
  ErrorDetails, 
  ErrorContext 
} from "./error-types";

export class AppError extends Error {
  code: ErrorCode;
  details: ErrorDetails;
  context?: ErrorContext;

  constructor(
    message: string,
    code: ErrorCode,
    context?: ErrorContext
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = {
      ...ErrorCodes[code],
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
    };
  }

  public get isRetryable(): boolean {
    return this.details.retry ?? false;
  }

  public get shouldRedirect(): boolean {
    return this.details.redirect ?? false;
  }

  public get redirectPath(): string | undefined {
    return this.details.path;
  }

  public get recoverySteps(): string[] | undefined {
    return this.details.recoverySteps;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

interface ErrorResponse extends Message {
  code?: string;
  recoverySteps?: string[];
  retry?: boolean;
}

export function handleError(error: unknown): ErrorResponse {
  console.error("Error:", error);

  if (isAppError(error)) {
    return {
      error: error.message,
      code: error.code,
      recoverySteps: error.recoverySteps,
      retry: error.isRetryable,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      retry: true,
    };
  }

  return {
    error: "An unexpected error occurred",
    retry: true,
  };
}

export async function handleActionError(
  error: unknown,
  redirectPath?: string
): Promise<ErrorResponse | Response> {
  const errorResponse = handleError(error);

  if (isAppError(error) && error.shouldRedirect) {
    return encodedRedirect(
      "error",
      error.redirectPath || redirectPath || "/",
      error.message
    );
  }

  if (redirectPath) {
    return encodedRedirect(
      "error",
      redirectPath,
      errorResponse.error
    );
  }

  return errorResponse;
}

export function createErrorContext(
  action: string,
  metadata?: Record<string, unknown>
): ErrorContext {
  return {
    action,
    timestamp: new Date().toISOString(),
    metadata,
  };
}
