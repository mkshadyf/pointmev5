import { Service } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

interface ServiceCardProps {
  service: Service & {
    profiles: {
      full_name: string;
      avatar_url: string | null;
    };
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row gap-4 items-start">
        <Avatar className="w-12 h-12">
          <AvatarImage src={service.profiles.avatar_url || ''} />
          <AvatarFallback>
            {service.profiles.full_name?.charAt(0) || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{service.name}</h3>
          <p className="text-sm text-muted-foreground">
            by {service.profiles.full_name}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>Available</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="font-semibold">R{service.price}</p>
        <Button asChild>
          <Link href={`/services/${service.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
