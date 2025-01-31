"use client";

import { Booking, Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

interface ProviderStatsProps {
  services?: Service[] | null;
  bookings?: Booking[] | null;
  loading?: boolean;
  className?: string;
}

function calculateStats(bookings: Booking[] | null | undefined) {
  if (!bookings) return { revenue: 0, completedBookings: 0 };
  
  return bookings.reduce(
    (acc, booking) => ({
      revenue: acc.revenue + (booking.total_amount || 0),
      completedBookings: acc.completedBookings + (booking.status === "completed" ? 1 : 0),
    }),
    { revenue: 0, completedBookings: 0 }
  );
}

export default function ProviderStats({ 
  services, 
  bookings, 
  loading = false,
  className 
}: ProviderStatsProps) {
  const totalServices = services?.length || 0;
  const totalBookings = bookings?.length || 0;
  const { revenue, completedBookings } = calculateStats(bookings);
  const completionRate = totalBookings ? (completedBookings / totalBookings) * 100 : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    description?: string,
    variant: "default" | "success" | "warning" | "info" = "default"
  ) => (
    <Card
      animate
      hover="raise"
      variant={variant}
      loading={loading}
      className="overflow-hidden"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {loading ? (
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          ) : (
            title
          )}
        </CardTitle>
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-muted-foreground"
          >
            {icon}
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
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Suspense fallback={<ProviderStats services={[]} bookings={[]} loading={true} />}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}
      >
        {renderStatCard(
          "Total Services",
          totalServices,
          <Briefcase className="h-4 w-4" />,
          "Active services in your catalog",
          "info"
        )}
        
        {renderStatCard(
          "Total Bookings",
          totalBookings,
          <Calendar className="h-4 w-4" />,
          `${completedBookings} completed bookings`,
          completionRate >= 70 ? "success" : "warning"
        )}
        
        {renderStatCard(
          "Total Revenue",
          `R${revenue.toFixed(2)}`,
          <DollarSign className="h-4 w-4" />,
          "Total earnings from bookings",
          revenue > 0 ? "success" : "default"
        )}
        
        {renderStatCard(
          "Active Customers",
          bookings?.filter(b => b.status !== "cancelled").length || 0,
          <Users className="h-4 w-4" />,
          "Customers with active bookings"
        )}
      </motion.div>
    </Suspense>
  );
}
