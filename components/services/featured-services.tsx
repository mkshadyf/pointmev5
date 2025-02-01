"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Heart, Share2, Calendar, MessageCircle } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const shimmer = {
  hidden: { backgroundPosition: "200% 0" },
  show: { 
    backgroundPosition: "-200% 0",
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear"
    }
  }
};

export function FeaturedServices({ services }: { services: any[] }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedServices, setLikedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [controls, isInView]);

  const toggleLike = (serviceId: string) => {
    setLikedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  return (
    <section ref={ref} className="w-full py-8 sm:py-12 bg-muted/30">
      <div className="container px-4">
        <motion.div 
          className="flex flex-col items-center mb-8 sm:mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
          <Badge 
            variant="outline" 
            className="mb-4"
            style={{
              background: "linear-gradient(45deg, var(--primary) 0%, var(--primary-foreground) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Featured
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Top Rated Services</h2>
          <p className="text-muted-foreground max-w-[600px] text-sm sm:text-base">
            Discover our most popular and highly-rated service providers
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {services?.slice(0, 3).map((service, index) => (
            <motion.div 
              key={service.id}
              variants={item}
              onHoverStart={() => setHoveredId(service.id)}
              onHoverEnd={() => setHoveredId(null)}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  {service.image_url && (
                    <motion.img
                      src={service.image_url}
                      alt={service.title}
                      className="object-cover w-full h-full"
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: hoveredId === service.id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  <motion.div 
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => toggleLike(service.id)}
                    >
                      <Heart 
                        className={cn(
                          "h-4 w-4 transition-colors",
                          likedServices.has(service.id) && "fill-red-500 text-red-500"
                        )} 
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                    <motion.h3 
                      className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white line-clamp-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.div 
                      className="flex items-center gap-2 sm:gap-4 flex-wrap"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 mr-1" />
                        <span className="text-white text-xs sm:text-sm">
                          {service.rating || "4.5"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white/80 mr-1" />
                        <span className="text-white text-xs sm:text-sm">
                          {service.duration} min
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      {service.profiles?.avatar_url ? (
                        <img
                          src={service.profiles.avatar_url}
                          alt={service.profiles.full_name}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted" />
                      )}
                      <span className="font-medium text-sm sm:text-base line-clamp-1">
                        {service.profiles?.full_name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                      ${service.price}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>2.5 km away</span>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Book
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>

                {hoveredId === service.id && (
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
