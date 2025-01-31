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

export interface ErrorDetails {
  code: string;
  status?: number;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: ErrorContext;
  retry?: boolean;
  redirect?: boolean;
  path?: string;
  recoverySteps?: string[];
  technicalDetails?: string;
}

export const ErrorCodes = {
  // Auth Errors
  AUTH_REQUIRED: {
    code: "AUTH_REQUIRED",
    status: 401,
    severity: "error",
    category: "auth",
    redirect: true,
    path: "/sign-in",
  },
  AUTH_INVALID: {
    code: "AUTH_INVALID",
    status: 401,
    severity: "error",
    category: "auth",
    retry: true,
  },

  // Validation Errors
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    status: 400,
    severity: "warning",
    category: "validation",
    retry: true,
  },

  // Network Errors
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    status: 503,
    severity: "error",
    category: "network",
    retry: true,
    recoverySteps: [
      "Check your internet connection",
      "Try refreshing the page",
      "Contact support if the problem persists"
    ],
  },

  // Database Errors
  DB_ERROR: {
    code: "DB_ERROR",
    status: 500,
    severity: "error",
    category: "database",
    retry: false,
  },

  // Payment Errors
  PAYMENT_FAILED: {
    code: "PAYMENT_FAILED",
    status: 402,
    severity: "error",
    category: "payment",
    retry: true,
    recoverySteps: [
      "Check your payment details",
      "Ensure sufficient funds",
      "Try a different payment method"
    ],
  },

  // Service Errors
  SERVICE_NOT_FOUND: {
    code: "SERVICE_NOT_FOUND",
    status: 404,
    severity: "error",
    category: "service",
    redirect: true,
    path: "/services",
  },

  // Booking Errors
  BOOKING_CONFLICT: {
    code: "BOOKING_CONFLICT",
    status: 409,
    severity: "warning",
    category: "booking",
    retry: true,
    recoverySteps: [
      "Choose a different time slot",
      "Contact the service provider"
    ],
  },

  // Rate Limiting
  RATE_LIMIT: {
    code: "RATE_LIMIT",
    status: 429,
    severity: "warning",
    category: "system",
    retry: true,
    recoverySteps: [
      "Please wait before trying again",
      "Contact support if you need immediate assistance"
    ],
  },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
