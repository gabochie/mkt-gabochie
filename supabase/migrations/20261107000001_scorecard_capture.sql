-- Revenue Leak Scorecard — Supabase capture
-- 1) Allow anonymous inserts into form_submissions (landing page submission)
-- 2) Allow admins to read submissions
-- 3) Auto-create a CRM lead for every scorecard response
-- Run in Supabase SQL Editor or via: supabase db push

-- ── Grants ──
grant insert on public.form_submissions to anon, authenticated;
grant select on public.form_submissions to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- ── RLS policies (drop-if-exists so this migration is re-runnable) ──
drop policy if exists "Anyone can submit forms" on public.form_submissions;
create policy "Anyone can submit forms"
  on public.form_submissions for insert
  with check (true);

drop policy if exists "Admins can read form submissions" on public.form_submissions;
create policy "Admins can read form submissions"
  on public.form_submissions for select
  using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.admin_users where email = auth.email())
  );

-- ── Scorecard response -> CRM lead ──
create or replace function public.fn_scorecard_to_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  d jsonb;
  v_name text;
  v_business text;
  v_phone text;
  v_email text;
begin
  if new.form_type <> 'revenue-leak-scorecard' then
    return new;
  end if;

  d := coalesce(new.data, '{}'::jsonb);
  v_name := nullif(trim(coalesce(d->>'name', '')), '');
  v_business := trim(coalesce(d->>'business', ''));
  v_phone := trim(coalesce(d->>'phone', ''));
  v_email := trim(coalesce(d->>'email', ''));

  -- Avoid duplicate leads when the same person submits twice in a day
  if (v_phone <> '' and exists (
        select 1 from public.leads
        where phone = v_phone and deleted_at is null
          and created_at > now() - interval '1 day'))
     or (v_phone = '' and v_email <> '' and exists (
        select 1 from public.leads
        where email = v_email and deleted_at is null
          and created_at > now() - interval '1 day')) then
    return new;
  end if;

  insert into public.leads (
    prospect_name, business_name, phone, email, location,
    lead_source, funnel_stage, status, lead_type, offer_type,
    outreach_category, notes
  ) values (
    coalesce(v_name, 'Scorecard respondent'),
    v_business,
    v_phone,
    v_email,
    trim(coalesce(d->>'location', '')),
    'website', 'tofu', 'new', 'unknown', 'audit',
    'Revenue Leak Scorecard',
    'Score ' || coalesce(d->>'score', '?') || '/100 (' || coalesce(d->>'band', '?') || ')' ||
    ', indicative leak ~' || coalesce(d->>'leak_pct', '?') || '%. Top leaks: ' ||
    coalesce(d->>'top_leaks', '—')
  );

  return new;
exception when others then
  -- Never block the submission because of CRM sync
  return new;
end;
$$;

drop trigger if exists trg_scorecard_to_lead on public.form_submissions;
create trigger trg_scorecard_to_lead
  after insert on public.form_submissions
  for each row execute function public.fn_scorecard_to_lead();
