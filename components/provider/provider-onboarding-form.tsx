"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const providerFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  id_number: z.string().min(13, "ID number must be 13 digits").max(13),
  tax_number: z.string().optional(),
});

type ProviderFormValues = z.infer<typeof providerFormSchema>;

interface ProviderOnboardingFormProps {
  userId: string;
}

export default function ProviderOnboardingForm({ userId }: ProviderOnboardingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      full_name: "",
      business_name: "",
      phone: "",
      bio: "",
      location: "",
      id_number: "",
      tax_number: "",
    },
  });

  async function onSubmit(data: ProviderFormValues) {
    setIsLoading(true);
    try {
      // Update profile with provider details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone,
          bio: data.bio,
          location: data.location,
          role: "provider",
          business_name: data.business_name,
          id_number: data.id_number,
          tax_number: data.tax_number,
          onboarding_completed: true,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Create provider verification request
      const { error: verificationError } = await supabase
        .from("provider_verifications")
        .insert([
          {
            provider_id: userId,
            status: "pending",
            id_number: data.id_number,
            tax_number: data.tax_number,
          },
        ]);

      if (verificationError) throw verificationError;

      router.push("/provider/pending-verification");
      router.refresh();
    } catch (error) {
      console.error("Error during provider onboarding:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Business Name" {...field} />
              </FormControl>
              <FormDescription>
                This will be displayed to customers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+27..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Johannesburg, South Africa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your business and services..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be shown on your profile page
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="id_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Your South African ID number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Number (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Your business tax number if applicable
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
