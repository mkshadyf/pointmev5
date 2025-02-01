-- Seed data for testing
-- Insert admin user
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com');

INSERT INTO profiles (id, role, full_name, phone, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin',
  'Admin User',
  '+1234567890',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
);

-- Insert provider users
INSERT INTO auth.users (id, email)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'provider1@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'provider2@example.com');

INSERT INTO profiles (id, role, full_name, phone, avatar_url)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'provider',
    'John Provider',
    '+1234567891',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'provider',
    'Jane Provider',
    '+1234567892',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
  );

-- Insert regular users
INSERT INTO auth.users (id, email)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'user1@example.com'),
  ('44444444-4444-4444-4444-444444444444', 'user2@example.com');

INSERT INTO profiles (id, role, full_name, phone, avatar_url)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    'user',
    'Alice User',
    '+1234567893',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'user',
    'Bob User',
    '+1234567894',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  );

-- Insert services
INSERT INTO services (provider_id, name, description, price, duration, category, image_url, location)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Home Cleaning',
    'Professional home cleaning service',
    80.00,
    120,
    'Cleaning',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326)
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Window Cleaning',
    'Professional window cleaning service',
    60.00,
    90,
    'Cleaning',
    'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38',
    ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326)
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Plumbing Service',
    'Professional plumbing repairs and installation',
    100.00,
    60,
    'Plumbing',
    'https://images.unsplash.com/photo-1542013936693-884638332954',
    ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Electrical Service',
    'Professional electrical repairs and installation',
    120.00,
    90,
    'Electrical',
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a',
    ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)
  );

-- Insert availability
INSERT INTO availability (provider_id, day_of_week, start_time, end_time)
VALUES
  ('11111111-1111-1111-1111-111111111111', 1, '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 2, '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 3, '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 4, '09:00', '17:00'),
  ('11111111-1111-1111-1111-111111111111', 5, '09:00', '17:00'),
  ('22222222-2222-2222-2222-222222222222', 1, '08:00', '16:00'),
  ('22222222-2222-2222-2222-222222222222', 2, '08:00', '16:00'),
  ('22222222-2222-2222-2222-222222222222', 3, '08:00', '16:00'),
  ('22222222-2222-2222-2222-222222222222', 4, '08:00', '16:00'),
  ('22222222-2222-2222-2222-222222222222', 5, '08:00', '16:00');

-- Insert bookings
INSERT INTO bookings (service_id, customer_id, provider_id, status, payment_status, datetime, total_amount, notes)
VALUES
  (
    (SELECT id FROM services WHERE name = 'Home Cleaning' LIMIT 1),
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'confirmed',
    'paid',
    NOW() + INTERVAL '2 days',
    80.00,
    'Please bring eco-friendly cleaning supplies'
  ),
  (
    (SELECT id FROM services WHERE name = 'Plumbing Service' LIMIT 1),
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'pending',
    'pending',
    NOW() + INTERVAL '3 days',
    100.00,
    'Leaking kitchen sink'
  );
