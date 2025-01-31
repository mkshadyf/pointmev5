"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createPaymentIntent, processPayment } from "@/lib/payment";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function PaymentForm({
  bookingId,
  amount,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent(bookingId, amount);
      
      // Process the payment
      const result = await processPayment(paymentIntent.id);
      
      if (result.status === "completed") {
        onSuccess();
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          This is a test payment. No real money will be charged.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="text-2xl font-bold">R{amount.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number (Test)</label>
            <Input
              type="text"
              maxLength={16}
              placeholder="4242 4242 4242 4242"
              disabled={isProcessing}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                type="text"
                placeholder="MM/YY"
                disabled={isProcessing}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVV</label>
              <Input
                type="text"
                maxLength={3}
                placeholder="123"
                disabled={isProcessing}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay R${amount.toFixed(2)}`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
