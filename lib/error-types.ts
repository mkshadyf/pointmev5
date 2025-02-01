export type ErrorSeverity = "fatal" | "error" | "warning" | "info";
export type ErrorCategory = 
  | "auth" 
  | "validation" 
  | "network" 
  | "database" 
  | "payment" 
  | "service" 
  | "booking" 
  | "user" 
  | "system";

export type ErrorContext = {
  userId?: string;
  requestId?: string;
  timestamp?: string;
  path?: string;
  action?: string;
  metadata?: Record<string, unknown>;
};

export type ErrorCode = keyof typeof ErrorCodes;

export interface ErrorDetails {
  code: string;
  status?: number;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: ErrorContext;
  retry?: boolean;
  redirect?: boolean;
  path?: string;
  recoverySteps?: readonly string[];
  technicalDetails?: string;
  message?: string;
}

export const ErrorCodes = {
  // Auth Errors
  AUTH_REQUIRED: {
    code: "AUTH_REQUIRED",
    status: 401,
    severity: "error" as const,
    category: "auth" as const,
    redirect: true,
    path: "/sign-in",
    message: "Authentication required",
  },
  AUTH_INVALID: {
    code: "AUTH_INVALID",
    status: 401,
    severity: "error" as const,
    category: "auth" as const,
    retry: true,
    message: "Invalid authentication credentials",
  },

  // Validation Errors
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    status: 400,
    severity: "warning" as const,
    category: "validation" as const,
    retry: true,
    message: "Invalid input data",
  },

  // Network Errors
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    status: 503,
    severity: "error" as const,
    category: "network" as const,
    retry: true,
    message: "Network connection error",
    recoverySteps: [
      "Check your internet connection",
      "Try refreshing the page",
      "Contact support if the problem persists"
    ] as const,
  },

  // Database Errors
  DB_ERROR: {
    code: "DB_ERROR",
    status: 500,
    severity: "error" as const,
    category: "database" as const,
    retry: false,
    message: "Database operation failed",
  },

  // Payment Errors
  PAYMENT_FAILED: {
    code: "PAYMENT_FAILED",
    status: 402,
    severity: "error" as const,
    category: "payment" as const,
    retry: true,
    message: "Payment processing failed",
    recoverySteps: [
      "Check your payment details",
      "Ensure sufficient funds",
      "Try a different payment method"
    ] as const,
  },

  // Service Errors
  SERVICE_NOT_FOUND: {
    code: "SERVICE_NOT_FOUND",
    status: 404,
    severity: "error" as const,
    category: "service" as const,
    message: "Service not found",
  },

  // Booking Errors
  BOOKING_CONFLICT: {
    code: "BOOKING_CONFLICT",
    status: 409,
    severity: "warning" as const,
    category: "booking" as const,
    retry: true,
    message: "Booking time slot is not available",
  },

  // Rate Limiting
  RATE_LIMIT: {
    code: "RATE_LIMIT",
    status: 429,
    severity: "warning" as const,
    category: "system" as const,
    retry: true,
    message: "Too many requests",
    recoverySteps: ["Please wait before trying again"] as const,
  },
} as const;
