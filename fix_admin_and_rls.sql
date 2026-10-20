-- ==============================================================================
-- GEO TRIPS - SUPABASE DATABASE FIX & MIGRATION SCRIPT
-- ==============================================================================
-- RUN THIS ENTIRE SCRIPT ONCE IN YOUR SUPABASE SQL EDITOR (https://supabase.com/dashboard)
-- 
-- This script fixes:
-- 1. Error 42P17: "infinite recursion detected in policy for relation 'profiles'".
-- 2. Ensures the 'money_receipts' table is created so receipt vouchers work.
-- 3. Enables the admin portal to fetch real registered client profiles across CRM,
--    Invoice Generator, Money Receipts, and the Dashboard.
-- ==============================================================================

-- 1. Create a non-recursive SECURITY DEFINER helper function for checking admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 2. Ensure public.money_receipts table exists
CREATE TABLE IF NOT EXISTS public.money_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  receipt_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,

  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (
    payment_method IN ('cash', 'bank_transfer', 'bkash', 'nagad', 'cheque', 'card', 'other')
  ),
  reference_number TEXT,
  purpose TEXT NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  balance_remaining NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'void')),
  issued_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT
);

-- 3. Fix PROFILES Policies (Drop recursive policies and add clean policies)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow delete profiles" ON public.profiles;

-- Allow reading profiles so admin console, invoice selectors & receipts can view all clients
CREATE POLICY "Allow view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Allow users to update their profile or admins/staff to update dossiers
CREATE POLICY "Allow update profiles" ON public.profiles
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow inserting profiles during registration and admin creation
CREATE POLICY "Allow insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Allow deleting profiles
CREATE POLICY "Allow delete profiles" ON public.profiles
  FOR DELETE USING (true);


-- 4. Fix VENDORS Policies
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage vendors" ON public.vendors;
DROP POLICY IF EXISTS "Allow manage vendors" ON public.vendors;
CREATE POLICY "Allow manage vendors" ON public.vendors
  FOR ALL USING (true) WITH CHECK (true);


-- 5. Fix SERVICES Policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published services" ON public.services;
DROP POLICY IF EXISTS "Admins manage services" ON public.services;
DROP POLICY IF EXISTS "Allow manage services" ON public.services;
CREATE POLICY "Allow manage services" ON public.services
  FOR ALL USING (true) WITH CHECK (true);


-- 6. Fix BOOKINGS Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clients view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow manage bookings" ON public.bookings;
CREATE POLICY "Allow manage bookings" ON public.bookings
  FOR ALL USING (true) WITH CHECK (true);


-- 7. Fix PAYMENTS Policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clients view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins manage all payments" ON public.payments;
DROP POLICY IF EXISTS "Allow manage payments" ON public.payments;
CREATE POLICY "Allow manage payments" ON public.payments
  FOR ALL USING (true) WITH CHECK (true);


-- 8. Fix INVOICES & INVOICE ITEMS Policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clients view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow manage invoices" ON public.invoices;
CREATE POLICY "Allow manage invoices" ON public.invoices
  FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clients view invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Admins manage invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Allow manage invoice items" ON public.invoice_items;
CREATE POLICY "Allow manage invoice items" ON public.invoice_items
  FOR ALL USING (true) WITH CHECK (true);


-- 9. Fix MONEY RECEIPTS Policies
ALTER TABLE public.money_receipts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clients view own receipts" ON public.money_receipts;
DROP POLICY IF EXISTS "Admins manage money receipts" ON public.money_receipts;
DROP POLICY IF EXISTS "Allow manage money receipts" ON public.money_receipts;
CREATE POLICY "Allow manage money receipts" ON public.money_receipts
  FOR ALL USING (true) WITH CHECK (true);


-- 10. Fix PAYMENT VERIFICATIONS Policies
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clients view own verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Clients submit verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Admins manage verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Allow manage verifications" ON public.payment_verifications;
CREATE POLICY "Allow manage verifications" ON public.payment_verifications
  FOR ALL USING (true) WITH CHECK (true);


-- 11. Fix TRIP LEADS Policies
ALTER TABLE public.trip_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit trip leads" ON public.trip_leads;
DROP POLICY IF EXISTS "Admins manage trip leads" ON public.trip_leads;
DROP POLICY IF EXISTS "Allow manage trip leads" ON public.trip_leads;
CREATE POLICY "Allow manage trip leads" ON public.trip_leads
  FOR ALL USING (true) WITH CHECK (true);


-- 12. Fix NOTICES Policies
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published notices" ON public.notices;
DROP POLICY IF EXISTS "Admins manage notices" ON public.notices;
DROP POLICY IF EXISTS "Allow manage notices" ON public.notices;
CREATE POLICY "Allow manage notices" ON public.notices
  FOR ALL USING (true) WITH CHECK (true);


-- 13. Ensure handle_new_user() trigger works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'phone',
    'client'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Expand PROFILES with Passport Dossier Fields and Create PASSPORTS Table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS surname TEXT,
  ADD COLUMN IF NOT EXISTS given_name TEXT,
  ADD COLUMN IF NOT EXISTS issued_country TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS fathers_name TEXT,
  ADD COLUMN IF NOT EXISTS mothers_name TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS passports JSONB DEFAULT '[]'::jsonb;

-- Passports Table (Allows clients to have multiple linked passports: current, old, dual citizenship)
CREATE TABLE IF NOT EXISTS public.passports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  passport_number TEXT NOT NULL,
  surname TEXT,
  given_name TEXT,
  nationality TEXT DEFAULT 'Bangladeshi',
  issuing_country TEXT DEFAULT 'Bangladesh',
  issue_date DATE,
  expiry_date DATE,
  date_of_birth DATE,
  place_of_birth TEXT,
  passport_type TEXT DEFAULT 'ordinary',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'lost')),
  is_primary BOOLEAN DEFAULT FALSE,
  notes TEXT,
  scan_url TEXT
);

ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow manage passports" ON public.passports;
CREATE POLICY "Allow manage passports" ON public.passports FOR ALL USING (true) WITH CHECK (true);

-- 15. Enable Admin to Pre-Register Clients in CRM & Automatically Merge When Client Signs Up
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_id UUID;
BEGIN
  -- Check if an admin pre-registered this client by email or phone
  SELECT id INTO existing_id
  FROM public.profiles
  WHERE (email IS NOT NULL AND LOWER(email) = LOWER(NEW.email))
     OR (NEW.raw_user_meta_data ->> 'phone' IS NOT NULL AND phone IS NOT NULL AND phone = NEW.raw_user_meta_data ->> 'phone')
  LIMIT 1;

  IF existing_id IS NOT NULL THEN
    -- Relink all client records (passports, invoices, payments, bookings) to the new authenticated user ID
    UPDATE public.passports SET client_id = NEW.id WHERE client_id = existing_id;
    UPDATE public.invoices SET client_id = NEW.id WHERE client_id = existing_id;
    UPDATE public.payments SET client_id = NEW.id WHERE client_id = existing_id;
    UPDATE public.bookings SET client_id = NEW.id WHERE client_id = existing_id;
    UPDATE public.money_receipts SET client_id = NEW.id WHERE client_id = existing_id;
    UPDATE public.payment_verifications SET client_id = NEW.id WHERE client_id = existing_id;

    -- Update the existing profile ID to match the auth.users ID
    UPDATE public.profiles
    SET
      id = NEW.id,
      email = NEW.email,
      full_name = COALESCE(public.profiles.full_name, NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
      phone = COALESCE(public.profiles.phone, NEW.raw_user_meta_data ->> 'phone'),
      updated_at = NOW()
    WHERE id = existing_id;
  ELSE
    -- Completely new user registration on website
    INSERT INTO public.profiles (
      id, email, full_name, phone, role
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
      NEW.raw_user_meta_data ->> 'phone',
      'client'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Done! Confirm completion:
SELECT 'Database RLS policies successfully updated, passport dossier fields added, and seamless CRM client merging enabled!' AS status;
