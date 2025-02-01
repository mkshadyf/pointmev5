"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { AppError } from "@/lib/error-handler";
import { revalidatePath } from "next/cache";

export async function createService(formData: FormData) {
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AppError(
      "You must be logged in to create a service",
      "AUTH_REQUIRED"
    );
  }

  // Get form data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const duration = parseInt(formData.get("duration") as string);
  const category = formData.get("category") as string;

  if (!title || !description || !price || !duration || !category) {
    throw new AppError(
      "Please fill in all required fields",
      "VALIDATION_ERROR"
    );
  }

  const { error } = await supabase
    .from("services")
    .insert({
      title,
      description,
      price,
      duration,
      category,
      provider_id: session.user.id,
    });

  if (error) {
    throw new AppError(
      "Failed to create service",
      "DB_ERROR"
    );
  }

  revalidatePath("/provider");
}

export async function updateService(formData: FormData) {
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AppError(
      "You must be logged in to update a service",
      "AUTH_REQUIRED"
    );
  }

  // Get form data
  const serviceId = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const duration = parseInt(formData.get("duration") as string);
  const category = formData.get("category") as string;

  if (!serviceId || !title || !description || !price || !duration || !category) {
    throw new AppError(
      "Please fill in all required fields",
      "VALIDATION_ERROR"
    );
  }

  // Verify ownership
  const { data: service, error: fetchError } = await supabase
    .from("services")
    .select()
    .eq("id", serviceId)
    .single();

  if (fetchError || !service) {
    throw new AppError(
      "Service not found",
      "SERVICE_NOT_FOUND"
    );
  }

  if (service.provider_id !== session.user.id) {
    throw new AppError(
      "You don't have permission to update this service",
      "AUTH_INVALID"
    );
  }

  const { error } = await supabase
    .from("services")
    .update({
      title,
      description,
      price,
      duration,
      category,
    })
    .eq("id", serviceId);

  if (error) {
    throw new AppError(
      "Failed to update service",
      "DB_ERROR"
    );
  }

  revalidatePath("/provider");
}

export async function deleteService(formData: FormData) {
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AppError(
      "You must be logged in to delete a service",
      "AUTH_REQUIRED"
    );
  }

  const serviceId = formData.get("id") as string;

  if (!serviceId) {
    throw new AppError(
      "Service ID is required",
      "VALIDATION_ERROR"
    );
  }

  // Verify ownership
  const { data: service, error: fetchError } = await supabase
    .from("services")
    .select()
    .eq("id", serviceId)
    .single();

  if (fetchError || !service) {
    throw new AppError(
      "Service not found",
      "SERVICE_NOT_FOUND"
    );
  }

  if (service.provider_id !== session.user.id) {
    throw new AppError(
      "You don't have permission to delete this service",
      "AUTH_INVALID"
    );
  }

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    throw new AppError(
      "Failed to delete service",
      "DB_ERROR"
    );
  }

  revalidatePath("/provider");
}
