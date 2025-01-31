-- Create payment status enum
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND (
        bookings.customer_id = auth.uid() OR
        bookings.provider_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "System can create payments"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

-- Create trigger for updating updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create function to handle payment completion
CREATE OR REPLACE FUNCTION handle_payment_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update the booking status when payment is completed
    UPDATE bookings 
    SET 
      payment_status = 'paid',
      status = 'confirmed',
      updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = NEW.booking_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payment completion
CREATE TRIGGER on_payment_completion
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE PROCEDURE handle_payment_completion();
