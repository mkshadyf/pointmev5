import { createClient } from "@/utils/supabase/server";
import ServiceCard from "@/components/services/service-card";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const supabase = createClient();
  
  // Fetch services with provider details
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      profiles:provider_id (
        full_name,
        avatar_url
      )
    `)
    .eq('available', true);

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center">
      <header className="w-full py-6 flex justify-center border-b">
        <div className="container flex flex-col gap-4 px-4">
          <h1 className="text-3xl font-bold">Find Services</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">All Categories</Badge>
            <Badge variant="secondary">Popular</Badge>
            <Badge variant="secondary">New</Badge>
          </div>
        </div>
      </header>

      <main className="container px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
    </div>
  );
}
