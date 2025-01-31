-- Create service categories enum
CREATE TYPE service_category AS ENUM (
  'beauty',
  'health',
  'education',
  'technology',
  'home',
  'events',
  'professional',
  'other'
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  category service_category NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create service availability table for recurring schedules
CREATE TABLE IF NOT EXISTS service_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Services are viewable by everyone" 
  ON services FOR SELECT 
  USING (true);

CREATE POLICY "Providers can insert their own services" 
  ON services FOR INSERT 
  WITH CHECK (
    auth.uid() = provider_id
  );

CREATE POLICY "Providers can update their own services" 
  ON services FOR UPDATE 
  USING (
    auth.uid() = provider_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Providers can delete their own services" 
  ON services FOR DELETE 
  USING (
    auth.uid() = provider_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Service availability policies
CREATE POLICY "Service availability viewable by everyone" 
  ON service_availability FOR SELECT 
  USING (true);

CREATE POLICY "Providers can manage their service availability" 
  ON service_availability FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM services 
      WHERE services.id = service_availability.service_id 
      AND services.provider_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample data
INSERT INTO services (
  provider_id,
  name,
  description,
  price,
  duration,
  category,
  location
)
SELECT 
  profiles.id,
  unnest(ARRAY[
    'Professional Haircut',
    'Massage Therapy',
    'Math Tutoring',
    'Web Development',
    'House Cleaning'
  ]) as name,
  unnest(ARRAY[
    'Expert haircut service for all hair types',
    'Relaxing full-body massage',
    'One-on-one math tutoring for all levels',
    'Custom website development',
    'Complete house cleaning service'
  ]) as description,
  unnest(ARRAY[
    250.00,
    400.00,
    300.00,
    1500.00,
    350.00
  ]) as price,
  unnest(ARRAY[
    45,
    60,
    90,
    120,
    180
  ]) as duration,
  unnest(ARRAY[
    'beauty'::service_category,
    'health'::service_category,
    'education'::service_category,
    'technology'::service_category,
    'home'::service_category
  ]) as category,
  'Johannesburg, South Africa' as location
FROM profiles
WHERE role = 'provider'
LIMIT 1;
