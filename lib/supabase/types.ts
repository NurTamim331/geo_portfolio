// ============================================================
// All TypeScript types for the Geo Trips platform
// ============================================================

// ------ Database Row Types ------

export type UserRole = 'admin' | 'client';

export type PassportType = 'ordinary' | 'official' | 'diplomatic' | 'special';
export type PassportStatus = 'active' | 'expired' | 'cancelled' | 'lost';

export interface Passport {
  id: string;
  created_at?: string;
  updated_at?: string;
  client_id: string;
  passport_number: string;
  surname?: string | null;
  given_name?: string | null;
  nationality?: string | null;
  issuing_country: string;
  issue_date?: string | null;
  expiry_date: string | null;
  date_of_birth?: string | null;
  place_of_birth?: string | null;
  passport_type?: PassportType;
  status?: PassportStatus;
  is_primary?: boolean;
  notes?: string | null;
  scan_url?: string | null;
}

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  surname?: string | null;
  given_name?: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  passport_number: string | null;
  passport_expiry: string | null;
  issued_country?: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  gender?: string | null;
  address?: string | null;
  fathers_name?: string | null;
  mothers_name?: string | null;
  drive_folder_link: string | null;
  avatar_url: string | null;
  is_active: boolean;
  passports?: Passport[];
}

export type ServiceType = 'flight' | 'visa' | 'hotel' | 'tour_package' | 'hajj_umrah' | 'notice';

export interface Service {
  id: string;
  created_at: string;
  updated_at: string;
  type: ServiceType;
  title: string;
  description: string | null;
  destination: string | null;
  base_price: number | null;
  currency: string;
  visa_country: string | null;
  visa_processing_days: number | null;
  visa_documents: string[];
  package_duration_days: number | null;
  package_includes: string[];
  itinerary: ItineraryDay[];
  hotel_name: string | null;
  hotel_location: string | null;
  hotel_stars: number | null;
  is_active: boolean;
  is_published: boolean;
  thumbnail_url: string | null;
  vendor_id: string | null;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
export type BookingType = 'flight' | 'visa' | 'hotel' | 'tour_package' | 'hajj_umrah';

export interface Booking {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  service_id: string | null;
  assigned_to: string | null;
  booking_type: BookingType | null;
  status: BookingStatus;
  visa_country: string | null;
  visa_application_date: string | null;
  visa_approval_date: string | null;
  visa_rejection_reason: string | null;
  flight_departure: string | null;
  flight_return: string | null;
  flight_route: string | null;
  flight_pnr: string | null;
  check_in: string | null;
  check_out: string | null;
  num_travelers: number;
  admin_notes: string | null;
  quote_sent_at: string | null;
  reference_code: string;
}

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'refunded';
export type VendorPaymentStatus = 'pending' | 'partial' | 'paid';

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  booking_id: string | null;
  service_id: string | null;
  vendor_id: string | null;
  service_description: string;
  service_type: ServiceType | null;
  total_client_price: number;
  total_vendor_cost: number;
  profit_margin: number; // computed
  amount_paid_by_client: number;
  amount_due: number; // computed
  vendor_amount_paid: number;
  vendor_amount_due: number; // computed
  payment_status: PaymentStatus;
  vendor_payment_status: VendorPaymentStatus;
  admin_notes: string | null;
  payment_date: string | null;
  due_date: string | null;
  currency: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  generated_by: string | null;
  invoice_number: string;
  subtotal: number;
  discount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number; // computed
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  notes: string | null;
  currency: string;
  items?: InvoiceItem[];
  money_receipts?: MoneyReceipt[];
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  payment_id?: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  total?: number; // computed
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentVerification {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  payment_id: string | null;
  invoice_id: string | null;
  receipt_image_url: string;
  bank_name: string | null;
  transaction_reference: string | null;
  amount_transferred: number;
  transfer_date: string | null;
  status: VerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  client_message: string | null;
}

export interface Vendor {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category: 'visa' | 'hotel' | 'airline' | 'tour' | 'hajj_umrah' | 'other';
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  total_owed: number;
  total_paid: number;
  outstanding_balance: number; // computed
  is_active: boolean;
}

export interface TripLead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  destination: string;
  num_travelers: number;
  departure_date: string | null;
  return_date: string | null;
  budget_range: string | null;
  trip_type: string | null;
  rough_estimate: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';
  admin_notes: string | null;
}

export interface Notice {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category: 'general' | 'visa' | 'flight' | 'holiday' | 'promotion';
  is_published: boolean;
  is_pinned: boolean;
  expires_at: string | null;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'bkash' | 'nagad' | 'cheque' | 'card' | 'other';
export type MoneyReceiptStatus = 'valid' | 'void';

export interface MoneyReceipt {
  id: string;
  created_at: string;
  updated_at: string;
  receipt_number: string;
  client_id: string | null;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  amount: number;
  payment_method: PaymentMethod;
  reference_number: string | null;
  purpose: string;
  invoice_id: string | null;
  payment_id: string | null;
  balance_remaining: number;
  status: MoneyReceiptStatus;
  issued_by: string | null;
  notes: string | null;
}

// ------ Admin Summary View ------

export interface AdminFinancialSummary {
  client_id: string;
  client_name: string;
  email: string;
  phone: string;
  drive_folder_link: string | null;
  total_transactions: number;
  total_billed: number;
  total_collected: number;
  total_outstanding: number;
  total_vendor_costs: number;
  total_profit: number;
}

// ------ UI Component Types ------

export interface VisaInfo {
  country: string;
  price: string;
  time: string;
  photoType: string;
  bgGradient: string;
  documents: string[];
  flag?: string;
}

// ------ Trip Planner Wizard ------

export interface TripPlannerData {
  destination: string;
  tripType: string;
  numTravelers: number;
  departureDate: string;
  returnDate: string;
  budgetRange: string;
  name: string;
  phone: string;
  email: string;
}

// ------ Supabase Database Type (skeleton) ------

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      services: { Row: Service; Insert: Partial<Service>; Update: Partial<Service> };
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> };
      payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> };
      invoices: { Row: Invoice; Insert: Partial<Invoice>; Update: Partial<Invoice> };
      invoice_items: { Row: InvoiceItem; Insert: Partial<InvoiceItem>; Update: Partial<InvoiceItem> };
      money_receipts: { Row: MoneyReceipt; Insert: Partial<MoneyReceipt>; Update: Partial<MoneyReceipt> };
      payment_verifications: { Row: PaymentVerification; Insert: Partial<PaymentVerification>; Update: Partial<PaymentVerification> };
      vendors: { Row: Vendor; Insert: Partial<Vendor>; Update: Partial<Vendor> };
      trip_leads: { Row: TripLead; Insert: Partial<TripLead>; Update: Partial<TripLead> };
      notices: { Row: Notice; Insert: Partial<Notice>; Update: Partial<Notice> };
      passports: { Row: Passport; Insert: Partial<Passport>; Update: Partial<Passport> };
    };
    Views: {
      admin_financial_summary: { Row: AdminFinancialSummary };
    };
    Functions: {};
    Enums: {};
  };
};
