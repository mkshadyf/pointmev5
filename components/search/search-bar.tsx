"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Filter, Sliders, Clock, DollarSign, Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const priceRanges = [
  { min: 0, max: 50, label: "Under $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 200, label: "$100 - $200" },
  { min: 200, max: 500, label: "$200 - $500" },
  { min: 500, max: null, label: "$500+" },
];

const durationRanges = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3+ hours" },
];

export function SearchBar() {
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [duration, setDuration] = useState<number>(60);
  const [rating, setRating] = useState<number>(4);

  const suggestions = [
    "House Cleaning",
    "Personal Training",
    "Math Tutoring",
    "Plumbing",
    "Hair Styling",
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <Input
              placeholder="Search services..."
              className="pl-8 transition-all hover:border-primary focus:border-primary"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <AnimatePresence>
              {showSuggestions && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-x-0 top-full mt-1 bg-popover rounded-md shadow-lg border"
                >
                  <div className="p-2">
                    {suggestions
                      .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((suggestion) => (
                        <motion.button
                          key={suggestion}
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative flex-1 md:max-w-[180px]">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Location"
              className="pl-8 transition-all hover:border-primary focus:border-primary"
            />
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(
              "w-[140px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}>
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Sliders className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {durationRanges.map((range) => (
                    <Button
                      key={range.value}
                      variant={duration === range.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDuration(range.value)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <div className="flex gap-2">
                  {[3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={rating === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRating(value)}
                    >
                      <Star className="mr-1 h-4 w-4" />
                      {value}+
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="md:col-span-3"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto pb-2">
        <Filter className="h-4 w-4 flex-shrink-0" />
        <span className="flex-shrink-0">Quick filters:</span>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {["Top Rated", "Available Now", "Best Price", "Near Me", "Featured"].map((filter, index) => (
            <motion.button
              key={filter}
              className="hover:text-primary transition-colors whitespace-nowrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
