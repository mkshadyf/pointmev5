"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { FormMessage } from "./form-message";
import { Button } from "./ui/button";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAppError } from "@/lib/error-handler";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  showHome?: boolean;
  showBack?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  public state: State = {
    hasError: false,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public static getDerivedStateFromProps(props: Props, state: State): State | null {
    if (props.resetOnPropsChange && state.hasError) {
      return { hasError: false, retryCount: 0 };
    }
    return null;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    console.error("Uncaught error:", error, errorInfo);
  }

  public componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount >= MAX_RETRIES) {
      return;
    }

    this.retryTimeout = setTimeout(() => {
      this.setState(state => ({
        hasError: false,
        retryCount: state.retryCount + 1,
      }));
    }, RETRY_DELAY);
  };

  public render() {
    const { hasError, error, retryCount } = this.state;
    const { fallback, showHome = true, showBack = true } = this.props;
    const router = useRouter();

    if (hasError) {
      if (fallback) return fallback;

      const isRetryable = !isAppError(error) || error.isRetryable;
      const recoverySteps = isAppError(error) ? error.recoverySteps : undefined;

      return (
        <Card className="mx-auto max-w-lg my-8">
          <CardHeader className="space-y-1 items-center text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-2" />
            <h2 className="text-2xl font-bold tracking-tight">
              {error?.name === "AppError" ? "Application Error" : "Something went wrong"}
            </h2>
            {error?.message && (
              <p className="text-muted-foreground">{error.message}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <FormMessage
              message={{ error: error?.message || "An unexpected error occurred" }}
            />

            {recoverySteps && recoverySteps.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Recovery Steps:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recoverySteps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 justify-end">
            {showBack && (
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}

            {showHome && (
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}

            {isRetryable && retryCount < MAX_RETRIES && (
              <Button
                onClick={this.handleRetry}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again ({MAX_RETRIES - retryCount} attempts left)
              </Button>
            )}
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}
