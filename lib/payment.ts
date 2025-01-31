import { createClient } from "@/utils/supabase/client";

export interface PaymentIntent {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  booking_id: string;
  created_at: string;
}

export async function createPaymentIntent(bookingId: string, amount: number): Promise<PaymentIntent> {
  const supabase = createClient();
  
  // Create a payment record
  const { data, error } = await supabase
    .from("payments")
    .insert([
      {
        booking_id: bookingId,
        amount,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function processPayment(paymentId: string): Promise<PaymentIntent> {
  const supabase = createClient();

  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Randomly succeed or fail (90% success rate)
  const success = Math.random() < 0.9;

  // Update payment status
  const { data, error } = await supabase
    .from("payments")
    .update({
      status: success ? "completed" : "failed",
      processed_at: new Date().toISOString(),
    })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) throw error;

  // If payment successful, update booking status
  if (success) {
    await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        status: "confirmed",
      })
      .eq("id", data.booking_id);
  }

  return data;
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentIntent> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (error) throw error;
  return data;
}
