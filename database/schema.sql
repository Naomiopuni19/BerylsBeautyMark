-- ============================================================
-- Beryl's Beauty Mark
-- Supabase schema: tables, storage, triggers, row level security
-- Run this in the Supabase SQL editor, top to bottom
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'stylist')),
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Storage: one bucket for every image on the site
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('salon-media', 'salon-media', true)
on conflict (id) do nothing;

create policy "Public can view salon media"
  on storage.objects for select
  using (bucket_id = 'salon-media');

create policy "Admins can upload salon media"
  on storage.objects for insert
  with check (
    bucket_id = 'salon-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update salon media"
  on storage.objects for update
  using (
    bucket_id = 'salon-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete salon media"
  on storage.objects for delete
  using (
    bucket_id = 'salon-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Customers can upload their own review photo"
  on storage.objects for insert
  with check (
    bucket_id = 'salon-media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = 'reviews'
  );

-- ------------------------------------------------------------
-- Services
-- ------------------------------------------------------------
create table public.service_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sort_order int not null default 0
);

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.service_categories(id) on delete set null,
  name text not null,
  description text,
  image_url text,
  duration_label text,
  price_min numeric(10,2) not null,
  price_max numeric(10,2),
  daily_capacity int not null default 10,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Homepage content, editable from the dashboard
-- ------------------------------------------------------------
create table public.hero_slides (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  headline text not null,
  subtext text,
  cta_label text default 'Book appointment',
  cta_link text default '/book',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  category text check (category in ('braids', 'wigs', 'color', 'natural_hair', 'bridal')),
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  client_role text,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  is_featured boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customer_reviews (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id),
  photo_url text not null,
  rating int not null default 5 check (rating between 1 and 5),
  comment text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Appointments, with a daily capacity rule per service
-- ------------------------------------------------------------
create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id),
  stylist_id uuid references public.profiles(id),
  appointment_date date not null,
  time_slot time not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  estimated_price numeric(10,2),
  created_at timestamptz not null default now()
);

create function public.check_service_capacity()
returns trigger as $$
declare
  booked_count int;
  max_capacity int;
begin
  select daily_capacity into max_capacity
  from public.services where id = new.service_id;

  select count(*) into booked_count
  from public.appointments
  where service_id = new.service_id
    and appointment_date = new.appointment_date
    and status in ('pending', 'confirmed');

  if booked_count >= max_capacity then
    raise exception 'This service is fully booked for %', new.appointment_date;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger enforce_service_capacity
  before insert on public.appointments
  for each row execute function public.check_service_capacity();

-- ------------------------------------------------------------
-- Products and inventory
-- ------------------------------------------------------------
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text,
  image_url text,
  price numeric(10,2) not null,
  stock_quantity int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.stock_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  change_qty int not null,
  reason text not null check (reason in ('purchase', 'restock', 'adjustment')),
  reference_order_id uuid,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Orders, payments
-- ------------------------------------------------------------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  total_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id),
  appointment_id uuid references public.appointments(id),
  amount numeric(10,2) not null,
  provider text not null check (provider in ('paystack', 'momo')),
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  reference text unique,
  created_at timestamptz not null default now()
);

create function public.handle_order_paid()
returns trigger as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    update public.products p
    set stock_quantity = p.stock_quantity - oi.quantity
    from public.order_items oi
    where oi.order_id = new.id and p.id = oi.product_id;

    insert into public.stock_movements (product_id, change_qty, reason, reference_order_id)
    select product_id, -quantity, 'purchase', new.id
    from public.order_items where order_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_order_paid
  after update on public.orders
  for each row execute function public.handle_order_paid();

-- ============================================================
-- Row level security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.service_categories enable row level security;
alter table public.hero_slides enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.customer_reviews enable row level security;
alter table public.appointments enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql stable security definer;

create policy "Public can view active services" on public.services for select using (is_active = true or public.is_admin());
create policy "Admins manage services" on public.services for all using (public.is_admin());

create policy "Public can view categories" on public.service_categories for select using (true);
create policy "Admins manage categories" on public.service_categories for all using (public.is_admin());

create policy "Public can view active hero slides" on public.hero_slides for select using (is_active = true or public.is_admin());
create policy "Admins manage hero slides" on public.hero_slides for all using (public.is_admin());

create policy "Public can view gallery" on public.gallery for select using (true);
create policy "Admins manage gallery" on public.gallery for all using (public.is_admin());

create policy "Public can view featured testimonials" on public.testimonials for select using (is_featured = true or public.is_admin());
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin());

create policy "Public can view approved photo reviews" on public.customer_reviews for select using (status = 'approved' or customer_id = auth.uid() or public.is_admin());
create policy "Customers submit own photo reviews" on public.customer_reviews for insert with check (customer_id = auth.uid());
create policy "Admins moderate photo reviews" on public.customer_reviews for update using (public.is_admin());
create policy "Admins delete photo reviews" on public.customer_reviews for delete using (public.is_admin());

create policy "Public can view active products" on public.products for select using (is_active = true or public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin());

create policy "Admins view stock movements" on public.stock_movements for select using (public.is_admin());

create policy "Users view own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid());

create policy "Customers view own appointments" on public.appointments for select using (customer_id = auth.uid() or public.is_admin());
create policy "Customers create own appointments" on public.appointments for insert with check (customer_id = auth.uid());
create policy "Admins manage appointments" on public.appointments for update using (public.is_admin());

create policy "Customers view own orders" on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy "Customers create own orders" on public.orders for insert with check (customer_id = auth.uid());
create policy "Admins update orders" on public.orders for update using (public.is_admin());

create policy "Users view own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin()))
);
create policy "Users create own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid())
);

create policy "Users view own payments" on public.payments for select using (
  public.is_admin() or
  exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()) or
  exists (select 1 from public.appointments a where a.id = appointment_id and a.customer_id = auth.uid())
);
create policy "Admins manage payments" on public.payments for all using (public.is_admin());