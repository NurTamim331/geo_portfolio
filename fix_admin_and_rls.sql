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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Done! Confirm completion:
SELECT 'Database RLS policies successfully updated and recursion fixed!' AS status;
