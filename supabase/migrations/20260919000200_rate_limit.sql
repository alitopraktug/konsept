-- Konsept — admin giriş denemesi sınırlaması (rate limit)
-- Yalnızca sunucudaki service role çağırabilir; tarayıcıdan (anon/authenticated) erişilemez.

create table if not exists public.rate_limits (
  key          text primary key,
  count        integer not null,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
-- Policy yok: yalnızca service role (RLS'i aşar) erişebilir.
revoke all on table public.rate_limits from anon, authenticated;

create or replace function public.rate_limit_hit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  -- Eski kayıtları temizle (küçük tablo, ucuz)
  delete from public.rate_limits where window_start < now() - interval '1 day';

  insert into public.rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
                  when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
                  else r.count + 1
                end,
        window_start = case
                  when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
                  else r.window_start
                end
  returning r.count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
