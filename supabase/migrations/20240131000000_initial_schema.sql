-- Enable the necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Drop existing tables if they exist
drop table if exists bookings;
drop table if exists services;
drop table if exists profiles;
drop table if exists availability;

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('user', 'provider', 'admin')),
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create services table
create table services (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text not null,
  price decimal(10,2) not null check (price >= 0),
  duration integer not null check (duration > 0), -- in minutes
  category text not null,
  image_url text,
  location geometry(Point, 4326),
  available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create availability table
create table availability (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references profiles(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_time_range check (start_time < end_time)
);

-- Create bookings table
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references services(id) on delete cascade,
  customer_id uuid references profiles(id) on delete cascade,
  provider_id uuid references profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status text not null check (payment_status in ('pending', 'paid', 'refunded')),
  datetime timestamptz not null,
  total_amount decimal(10,2) not null check (total_amount >= 0),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index services_provider_id_idx on services(provider_id);
create index services_category_idx on services(category);
create index services_location_idx on services using gist(location);
create index availability_provider_id_idx on availability(provider_id);
create index bookings_customer_id_idx on bookings(customer_id);
create index bookings_provider_id_idx on bookings(provider_id);
create index bookings_service_id_idx on bookings(service_id);
create index bookings_datetime_idx on bookings(datetime);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table services enable row level security;
alter table availability enable row level security;
alter table bookings enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create policies for services
create policy "Services are viewable by everyone"
  on services for select
  using (true);

create policy "Providers can insert their own services"
  on services for insert
  with check (auth.uid() = provider_id);

create policy "Providers can update their own services"
  on services for update
  using (auth.uid() = provider_id);

create policy "Providers can delete their own services"
  on services for delete
  using (auth.uid() = provider_id);

-- Create policies for availability
create policy "Availability is viewable by everyone"
  on availability for select
  using (true);

create policy "Providers can manage their own availability"
  on availability for all
  using (auth.uid() = provider_id);

-- Create policies for bookings
create policy "Users can view their own bookings"
  on bookings for select
  using (auth.uid() = customer_id or auth.uid() = provider_id);

create policy "Users can create bookings"
  on bookings for insert
  with check (auth.uid() = customer_id);

create policy "Users can update their own bookings"
  on bookings for update
  using (auth.uid() = customer_id or auth.uid() = provider_id);

-- Create functions and triggers
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();

create trigger update_services_updated_at
  before update on services
  for each row
  execute function update_updated_at();

create trigger update_availability_updated_at
  before update on availability
  for each row
  execute function update_updated_at();

create trigger update_bookings_updated_at
  before update on bookings
  for each row
  execute function update_updated_at();
