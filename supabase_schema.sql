-- ============================================================
-- Supabase SQL Schema for Geo Trips
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Basic Info
  full_name TEXT,
  phone TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),

  -- Passport Details
  passport_number TEXT,
  passport_expiry DATE,
  nationality TEXT,
  date_of_birth DATE,

  -- Google Drive Link (Admin-assigned dedicated folder)
  drive_folder_link TEXT,

  -- Profile Metadata
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function for checking admin role without recursion
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

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow delete profiles" ON public.profiles;

CREATE POLICY "Allow view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow update profiles" ON public.profiles
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow delete profiles" ON public.profiles
  FOR DELETE USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone'
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

-- ============================================================
-- 2. VENDORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('visa', 'hotel', 'airline', 'tour', 'hajj_umrah', 'other')),
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,

  -- Financial tracking
  total_owed NUMERIC(12, 2) DEFAULT 0,
  total_paid NUMERIC(12, 2) DEFAULT 0,
  outstanding_balance NUMERIC(12, 2) GENERATED ALWAYS AS (total_owed - total_paid) STORED,

  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage vendors" ON public.vendors;
CREATE POLICY "Admins manage vendors" ON public.vendors
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 3. SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Service Type
  type TEXT NOT NULL CHECK (type IN ('flight', 'visa', 'hotel', 'tour_package', 'hajj_umrah', 'notice')),
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT,

  -- Pricing
  base_price NUMERIC(12, 2),
  currency TEXT DEFAULT 'BDT',

  -- Visa-specific
  visa_country TEXT,
  visa_processing_days INTEGER,
  visa_documents JSONB DEFAULT '[]',

  -- Tour/Package-specific
  package_duration_days INTEGER,
  package_includes JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',

  -- Hotel-specific
  hotel_name TEXT,
  hotel_location TEXT,
  hotel_stars INTEGER,

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  thumbnail_url TEXT,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published services" ON public.services;
CREATE POLICY "Anyone can view published services" ON public.services
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 4. BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Admin handling

  -- Booking Details
  booking_type TEXT CHECK (booking_type IN ('flight', 'visa', 'hotel', 'tour_package', 'hajj_umrah')),
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')
  ),

  -- Visa-specific
  visa_country TEXT,
  visa_application_date DATE,
  visa_approval_date DATE,
  visa_rejection_reason TEXT,

  -- Flight-specific
  flight_departure DATE,
  flight_return DATE,
  flight_route TEXT,
  flight_pnr TEXT,

  -- Hotel/Tour
  check_in DATE,
  check_out DATE,
  num_travelers INTEGER DEFAULT 1,

  -- Admin Notes & Client Quote
  admin_notes TEXT,
  quote_sent_at TIMESTAMPTZ,

  -- Metadata
  reference_code TEXT UNIQUE DEFAULT 'GEO-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8))
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own bookings" ON public.bookings;
CREATE POLICY "Clients view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins manage all bookings" ON public.bookings;
CREATE POLICY "Admins manage all bookings" ON public.bookings
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 5. PAYMENTS TABLE (REPLACES EXCEL SHEET)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,

  -- Service Description (free-text for flexibility)
  service_description TEXT NOT NULL,
  service_type TEXT CHECK (service_type IN ('flight', 'visa', 'hotel', 'tour_package', 'hajj_umrah', 'other')),

  -- CRITICAL: Financial Tracking (replacing Excel)
  total_client_price NUMERIC(12, 2) NOT NULL DEFAULT 0,  -- What client agreed to pay
  total_vendor_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,   -- What vendor charged us
  profit_margin NUMERIC(12, 2) GENERATED ALWAYS AS (total_client_price - total_vendor_cost) STORED,

  amount_paid_by_client NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount_due NUMERIC(12, 2) GENERATED ALWAYS AS (total_client_price - amount_paid_by_client) STORED,

  vendor_amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  vendor_amount_due NUMERIC(12, 2) GENERATED ALWAYS AS (total_vendor_cost - vendor_amount_paid) STORED,

  -- Status
  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'partial', 'paid', 'overdue', 'refunded')
  ),
  vendor_payment_status TEXT DEFAULT 'pending' CHECK (
    vendor_payment_status IN ('pending', 'partial', 'paid')
  ),

  -- Notes
  admin_notes TEXT,
  payment_date DATE,
  due_date DATE,

  currency TEXT DEFAULT 'BDT'
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own payments" ON public.payments;
CREATE POLICY "Clients view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins manage all payments" ON public.payments;
CREATE POLICY "Admins manage all payments" ON public.payments
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 6. INVOICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Admin who created it

  invoice_number TEXT UNIQUE DEFAULT 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0'),

  -- Invoice Totals (merged from multiple payments)
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(12, 2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled')
  ),

  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,

  -- Metadata
  notes TEXT,
  currency TEXT DEFAULT 'BDT'
);

-- Invoice Items (links payments/services to an invoice)
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  total NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own invoices" ON public.invoices;
CREATE POLICY "Clients view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins manage invoices" ON public.invoices;
CREATE POLICY "Admins manage invoices" ON public.invoices
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

DROP POLICY IF EXISTS "Clients view invoice items" ON public.invoice_items;
CREATE POLICY "Clients view invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE id = invoice_id AND client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage invoice items" ON public.invoice_items;
CREATE POLICY "Admins manage invoice items" ON public.invoice_items
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 6B. MONEY RECEIPTS TABLE (Official Vouchers)
-- ============================================================
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

ALTER TABLE public.money_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own receipts" ON public.money_receipts;
CREATE POLICY "Clients view own receipts" ON public.money_receipts
  FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins manage money receipts" ON public.money_receipts;
CREATE POLICY "Admins manage money receipts" ON public.money_receipts
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 7. PAYMENT VERIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,

  -- Uploaded Receipt
  receipt_image_url TEXT NOT NULL,
  bank_name TEXT,
  transaction_reference TEXT,
  amount_transferred NUMERIC(12, 2) NOT NULL,
  transfer_date DATE,

  -- Admin Review
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,

  -- Client Message
  client_message TEXT
);

ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own verifications" ON public.payment_verifications;
CREATE POLICY "Clients view own verifications" ON public.payment_verifications
  FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients create verifications" ON public.payment_verifications;
CREATE POLICY "Clients create verifications" ON public.payment_verifications
  FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins manage verifications" ON public.payment_verifications;
CREATE POLICY "Admins manage verifications" ON public.payment_verifications
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 8. TRIP LEADS TABLE (from Trip Planner Wizard)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trip_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Contact Info
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,

  -- Trip Details
  destination TEXT NOT NULL,
  num_travelers INTEGER DEFAULT 1,
  departure_date DATE,
  return_date DATE,
  budget_range TEXT,
  trip_type TEXT, -- leisure, honeymoon, corporate, hajj_umrah

  -- Estimated output
  rough_estimate TEXT,

  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'lost')),
  admin_notes TEXT
);

ALTER TABLE public.trip_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit trip leads" ON public.trip_leads;
CREATE POLICY "Anyone can submit trip leads" ON public.trip_leads
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins manage trip leads" ON public.trip_leads;
CREATE POLICY "Admins manage trip leads" ON public.trip_leads
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- 9. NOTICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'visa', 'flight', 'holiday', 'promotion')),
  is_published BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published notices" ON public.notices;
CREATE POLICY "Anyone can view published notices" ON public.notices
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Admins manage notices" ON public.notices;
CREATE POLICY "Admins manage notices" ON public.notices
  FOR ALL USING (
    (public.is_admin() OR auth.role() = 'anon')
  );

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_verifications_status ON public.payment_verifications(status);
CREATE INDEX IF NOT EXISTS idx_trip_leads_status ON public.trip_leads(status);

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Admin Financial Overview View
CREATE OR REPLACE VIEW public.admin_financial_summary AS
SELECT
  p.id AS client_id,
  p.full_name AS client_name,
  p.email,
  p.phone,
  p.drive_folder_link,
  COUNT(DISTINCT pay.id) AS total_transactions,
  SUM(pay.total_client_price) AS total_billed,
  SUM(pay.amount_paid_by_client) AS total_collected,
  SUM(pay.amount_due) AS total_outstanding,
  SUM(pay.total_vendor_cost) AS total_vendor_costs,
  SUM(pay.profit_margin) AS total_profit
FROM public.profiles p
LEFT JOIN public.payments pay ON pay.client_id = p.id
WHERE p.role = 'client'
GROUP BY p.id, p.full_name, p.email, p.phone, p.drive_folder_link;
