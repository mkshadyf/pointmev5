import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ServiceForm from "@/components/services/service-form";

export default async function NewServicePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify user is a provider
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "provider" && profile?.role !== "admin") {
    return redirect("/");
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Add New Service</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Create a new service offering for your customers.
        </p>
      </div>

      <div className="max-w-2xl">
        <ServiceForm />
      </div>
    </div>
  );
}
