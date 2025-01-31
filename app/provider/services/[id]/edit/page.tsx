import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ServiceForm from "@/components/services/service-form";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch the service
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!service) {
    return redirect("/provider");
  }

  // Verify ownership
  if (service.provider_id !== user.id) {
    return redirect("/provider");
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Update your service details.
        </p>
      </div>

      <div className="max-w-2xl">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
