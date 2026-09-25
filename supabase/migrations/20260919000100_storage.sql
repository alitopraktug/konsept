-- Konsept — ürün görselleri için Storage bucket'ı ve yetkileri

-- Bucket herkese açık OKUNABİLİR (public URL ile ürün görselleri gösterilir),
-- ancak listeleme/yazma/silme yalnızca admin'e açıktır.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  4194304, -- 4 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;
drop policy if exists "product_images_admin_select" on storage.objects;

-- Bilerek anon/public SELECT policy'si yok: public bucket nesneleri URL ile servis edilir,
-- ama Storage API üzerinden dosya listelemesi yapılamaz.
create policy "product_images_admin_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
