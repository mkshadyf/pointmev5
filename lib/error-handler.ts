import { Message } from "@/components/form-message";
import { encodedRedirect } from "@/utils/utils";
import { 
  ErrorCode, 
  ErrorCodes, 
  ErrorDetails, 
  ErrorContext,
  ErrorCategory,
  ErrorSeverity 
} from "./error-types";

export class AppError extends Error {
  code: ErrorCode;
  details: ErrorDetails;

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

  public get recoverySteps(): readonly string[] | undefined {
    return this.details.recoverySteps;
  }

  public get severity(): ErrorSeverity {
    return this.details.severity;
  }

  public get category(): ErrorCategory {
    return this.details.category;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  recoverySteps?: readonly string[];
  retry?: boolean;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
}

export function handleError(error: unknown): ErrorResponse {
  console.error("Error:", error);

  if (isAppError(error)) {
    return {
      message: error.message,
      code: error.code,
      recoverySteps: error.recoverySteps,
      retry: error.isRetryable,
      severity: error.severity,
      category: error.category,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      retry: true,
      severity: "error",
      category: "system",
    };
  }

  return {
    message: "An unexpected error occurred",
    retry: true,
    severity: "error",
    category: "system",
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
      errorResponse.message
    );
  }

  if (redirectPath) {
    return encodedRedirect(
      "error",
      redirectPath,
      errorResponse.message
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
