-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS id_number TEXT,
ADD COLUMN IF NOT EXISTS tax_number TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create provider verification status enum
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Create provider verifications table
CREATE TABLE IF NOT EXISTS provider_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'pending',
  id_number TEXT NOT NULL,
  tax_number TEXT,
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(provider_id)
);

-- Add RLS policies
ALTER TABLE provider_verifications ENABLE ROW LEVEL SECURITY;

-- Provider can view their own verification
CREATE POLICY "Providers can view their own verification" 
  ON provider_verifications FOR SELECT 
  USING (auth.uid() = provider_id);

-- Only admin can update verification status
CREATE POLICY "Only admin can update verification status" 
  ON provider_verifications FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create trigger for updating updated_at
CREATE TRIGGER update_provider_verifications_updated_at
    BEFORE UPDATE ON provider_verifications
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle provider approval
CREATE OR REPLACE FUNCTION handle_provider_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Update the profile role to provider if approved
    UPDATE profiles 
    SET role = 'provider'
    WHERE id = NEW.provider_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for provider approval
CREATE TRIGGER on_provider_approval
  AFTER UPDATE ON provider_verifications
  FOR EACH ROW
  EXECUTE PROCEDURE handle_provider_approval();
