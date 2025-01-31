import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProviderOnboardingForm from "@/components/provider/provider-onboarding-form";

export default async function ProviderOnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if already onboarded
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "provider") {
    return redirect("/provider");
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Become a Service Provider</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your profile to start offering services on Pointme.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProviderOnboardingForm userId={user.id} />
      </div>
    </div>
  );
}
