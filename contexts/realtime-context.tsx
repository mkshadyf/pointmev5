"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Booking, Service } from "@/types";

interface RealtimeContextType {
  bookings: Booking[];
  services: Service[];
}

const RealtimeContext = createContext<RealtimeContextType>({
  bookings: [],
  services: [],
});

export function RealtimeProvider({
  children,
  initialBookings = [],
  initialServices = [],
}: {
  children: React.ReactNode;
  initialBookings?: Booking[];
  initialServices?: Service[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to bookings changes
    const bookingsChannel = supabase
      .channel("bookings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((current) => [...current, payload.new as Booking]);
          } else if (payload.eventType === "UPDATE") {
            setBookings((current) =>
              current.map((booking) =>
                booking.id === payload.new.id
                  ? { ...booking, ...payload.new }
                  : booking
              )
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((current) =>
              current.filter((booking) => booking.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Subscribe to services changes
    const servicesChannel = supabase
      .channel("services_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "services",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setServices((current) => [...current, payload.new as Service]);
          } else if (payload.eventType === "UPDATE") {
            setServices((current) =>
              current.map((service) =>
                service.id === payload.new.id
                  ? { ...service, ...payload.new }
                  : service
              )
            );
          } else if (payload.eventType === "DELETE") {
            setServices((current) =>
              current.filter((service) => service.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    setChannels([bookingsChannel, servicesChannel]);

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ bookings, services }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
