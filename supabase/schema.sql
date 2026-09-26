-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image_url text,
  available boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;

-- Anyone (customers) can read products that are marked available
create policy "public can read available products"
  on products for select
  using (available = true);

-- Only the logged-in admin (mom) can read everything, including sold-out items
create policy "admin can read all products"
  on products for select
  using (auth.role() = 'authenticated');

-- Only the logged-in admin can add, edit, or delete
create policy "admin can insert products"
  on products for insert
  with check (auth.role() = 'authenticated');

create policy "admin can update products"
  on products for update
  using (auth.role() = 'authenticated');

create policy "admin can delete products"
  on products for delete
  using (auth.role() = 'authenticated');

-- Storage: create a public bucket called product-images in
-- Project > Storage > New bucket (mark it "Public"), then run:

create policy "public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
