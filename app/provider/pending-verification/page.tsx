import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock } from "lucide-react";

export default async function PendingVerificationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check verification status
  const { data: verification } = await supabase
    .from("provider_verifications")
    .select("status")
    .eq("provider_id", user.id)
    .single();

  if (!verification) {
    return redirect("/provider/onboarding");
  }

  if (verification.status === "approved") {
    return redirect("/provider");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h1 className="text-2xl font-bold">Verification in Progress</h1>
        
        <p className="text-muted-foreground">
          Thank you for applying to be a service provider on Pointme. We are
          currently reviewing your application. This process usually takes 1-2
          business days.
        </p>

        <div className="space-y-4 pt-6">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Browse Services</Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Have questions? Contact our support team at support@pointme.com
          </p>
        </div>
      </div>
    </div>
  );
}
