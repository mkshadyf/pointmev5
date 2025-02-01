"use client";

import { createClient } from "@/utils/supabase/server";
import ServiceCard from "@/components/services/service-card";
import { SearchBar } from "@/components/search/search-bar";
import { FeaturedServices } from "@/components/services/featured-services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { MobileNav } from "@/components/mobile/mobile-nav";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { ServiceCardSkeleton, ServiceGridSkeleton } from "@/components/loading-states";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/types";

const categories = [
  { name: "All", value: "all" },
  { name: "Health & Wellness", value: "health" },
  { name: "Education", value: "education" },
  { name: "Home Services", value: "home" },
  { name: "Professional", value: "professional" },
  { name: "Events", value: "events" },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

type ServiceWithProfile = Service & {
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<ServiceWithProfile[]>([]);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      router.refresh();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Minimum loading time
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MobileNav />
      <div className="flex-1 w-full flex flex-col pt-14 sm:pt-0">
        <PullToRefresh onRefresh={handleRefresh}>
          {/* Hero Section */}
          <section className="w-full py-8 md:py-12 lg:py-24 xl:py-32 bg-gradient-to-b from-primary/20 via-background to-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Find the Perfect Service
                  <span className="text-primary block sm:inline"> For You</span>
                </motion.h1>
                <motion.p 
                  className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Book trusted service providers in your area. Fast, reliable, and hassle-free.
                </motion.p>
                
                <motion.div 
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <SearchBar />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Featured Services */}
          <Suspense fallback={<ServiceGridSkeleton count={3} />}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <FeaturedServices services={services} />
            </motion.div>
          </Suspense>

          {/* Categories */}
          <motion.section 
            className="w-full border-t border-b bg-muted/50 overflow-hidden"
            {...fadeIn}
          >
            <div className="container px-4 py-3 sm:py-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <Badge
                      variant={category.value === "all" ? "outline" : "secondary"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap px-3 py-1"
                    >
                      {category.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Services Grid */}
          <motion.main 
            className="container px-4 py-6 sm:py-8 pb-20 sm:pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">Available Services</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Today
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  Popular
                </Button>
              </div>
            </div>

            <Suspense fallback={<ServiceGridSkeleton />}>
              {isLoading ? (
                <ServiceGridSkeleton />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ServiceCard service={service} />
                    </motion.div>
                  ))}
                </div>
              )}
            </Suspense>
          </motion.main>
        </PullToRefresh>
      </div>
    </>
  );
}
