"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  loading = false,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("", className)}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {loading ? (
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            ) : (
              title
            )}
          </CardTitle>
          {Icon && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-muted-foreground"
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1.5">
            {loading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{value}</div>
            )}
            {(description || loading) && (
              <p className="text-xs text-muted-foreground">
                {loading ? (
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                ) : (
                  description
                )}
              </p>
            )}
            {(trend || loading) && (
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  trend && (
                    <>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          trend.isPositive
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {trend.isPositive ? "+" : "-"}
                        {Math.abs(trend.value)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        from last month
                      </span>
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
