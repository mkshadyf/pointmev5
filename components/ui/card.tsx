"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive",
        success: "border-green-500",
        warning: "border-yellow-500",
        info: "border-blue-500",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      hover: {
        default: "",
        raise: "transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
        glow: "transition-all duration-200 hover:shadow-lg hover:shadow-primary/25",
        scale: "transition-all duration-200 hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "default",
    },
  }
);

export interface CardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  loading?: boolean;
  animate?: boolean;
  children?: React.ReactNode;
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant, size, hover, loading, animate, children, ...props }, ref) => {
  return animate ? (
    <motion.div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, hover }),
        loading && "animate-pulse",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  ) : (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, hover }),
        loading && "animate-pulse",
        className
      )}
    >
      {children}
    </div>
  );
  });
 
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
