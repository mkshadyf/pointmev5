import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProviderServicesList from "@/components/provider/provider-services-list";
import ProviderStats from "@/components/provider/provider-stats";

export default async function ProviderDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch provider's services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", user.id);

  // Fetch today's bookings
  const today = new Date().toISOString().split('T')[0];
  const { data: todayBookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("provider_id", user.id)
    .gte("datetime", today)
    .lt("datetime", today + "T23:59:59")
    .order("datetime", { ascending: true });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <Button asChild>
          <Link href="/provider/services/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProviderStats services={services} bookings={todayBookings} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Services</CardTitle>
        </CardHeader>
        <CardContent>
          <ProviderServicesList services={services} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {todayBookings?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings for today</p>
          ) : (
            <div className="space-y-4">
              {todayBookings?.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{booking.service_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.datetime).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/provider/bookings/${booking.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
