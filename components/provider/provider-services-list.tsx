"use client";

import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface ProviderServicesListProps {
  services?: Service[] | null;
}

export default function ProviderServicesList({ services }: ProviderServicesListProps) {
  const [localServices, setLocalServices] = useState(services || []);
  const supabase = createClient();

  const toggleAvailability = async (serviceId: string, currentAvailability: boolean) => {
    const { error } = await supabase
      .from('services')
      .update({ available: !currentAvailability })
      .eq('id', serviceId);

    if (!error) {
      setLocalServices(prev =>
        prev.map(service =>
          service.id === serviceId
            ? { ...service, available: !currentAvailability }
            : service
        )
      );
    }
  };

  if (!localServices.length) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">No services added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {localServices.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm font-medium">R{service.price}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {service.duration} minutes
            </p>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={service.available}
                onCheckedChange={() => toggleAvailability(service.id, service.available)}
              />
              <span className="text-sm text-muted-foreground">
                {service.available ? "Available" : "Hidden"}
              </span>
            </div>
            
            <Button variant="outline" size="icon" asChild>
              <Link href={`/provider/services/${service.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
