"use server";

import { createClient } from "@/utils/supabase/server";
import { AppError, handleActionError } from "@/lib/error-handler";

export async function createService(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new AppError("Not authenticated", {
        code: "AUTH_REQUIRED",
        status: 401,
        redirect: true,
        path: "/sign-in"
      });
    }

    const name = formData.get("name")?.toString();
    const price = formData.get("price")?.toString();
    const duration = formData.get("duration")?.toString();

    if (!name || !price || !duration) {
      throw new AppError("All fields are required", {
        code: "VALIDATION_ERROR",
        status: 400
      });
    }

    const { error } = await supabase
      .from("services")
      .insert([
        {
          name,
          price: parseFloat(price),
          duration: parseInt(duration),
          provider_id: user.id
        }
      ]);

    if (error) throw new AppError(error.message, { code: error.code });

    return { success: "Service created successfully" };
  } catch (error) {
    return handleActionError(error, "/provider/services/new");
  }
}

export async function updateService(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new AppError("Not authenticated", {
        code: "AUTH_REQUIRED",
        status: 401,
        redirect: true,
        path: "/sign-in"
      });
    }

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const price = formData.get("price")?.toString();
    const duration = formData.get("duration")?.toString();

    if (!id || !name || !price || !duration) {
      throw new AppError("All fields are required", {
        code: "VALIDATION_ERROR",
        status: 400
      });
    }

    // Verify ownership
    const { data: service } = await supabase
      .from("services")
      .select()
      .eq("id", id)
      .single();

    if (!service) {
      throw new AppError("Service not found", {
        code: "NOT_FOUND",
        status: 404
      });
    }

    if (service.provider_id !== user.id) {
      throw new AppError("Not authorized", {
        code: "UNAUTHORIZED",
        status: 403
      });
    }

    const { error } = await supabase
      .from("services")
      .update({
        name,
        price: parseFloat(price),
        duration: parseInt(duration)
      })
      .eq("id", id);

    if (error) throw new AppError(error.message, { code: error.code });

    return { success: "Service updated successfully" };
  } catch (error) {
    return handleActionError(error);
  }
}
