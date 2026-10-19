import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, TrendingDown, Phone, Mail, Building, AlertCircle } from 'lucide-react';

export default async function AdminVendorsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: vendors } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });

  const totalOwed = vendors?.reduce((s, v) => s + (v.total_owed || 0), 0) || 0;
  const totalPaid = vendors?.reduce((s, v) => s + (v.total_paid || 0), 0) || 0;
  const outstanding = vendors?.reduce((s, v) => s + (v.outstanding_balance || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Vendor Management & Payables
          </h1>
          <p className="text-gray-500 mt-1">
            Track third-party visa agencies, airlines, hotel consolidators, and Hajj & Umrah operators.
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Incurred Cost</span>
          <p className="font-display font-black text-3xl text-brand-dark">{formatCurrency(totalOwed)}</p>
          <p className="text-xs text-gray-400 mt-1">All vendor billing claims</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Paid to Vendors</span>
          <p className="font-display font-black text-3xl text-emerald-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-gray-400 mt-1">Disbursed by GEO Trips</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Net Payable Balance</span>
          <p className={`font-display font-black text-3xl ${outstanding > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
            {formatCurrency(outstanding)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pending payments to vendors</p>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-brand-dark">Vendor Directory</h2>
          <span className="text-xs font-semibold text-gray-400">{vendors?.length || 0} Registered Partners</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Vendor Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Point of Contact</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">Incurred Cost</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">Paid Out</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendors && vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-brand-dark">{vendor.name}</p>
                      {vendor.address && <p className="text-xs text-gray-400 mt-0.5">{vendor.address}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase">
                        {vendor.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      <p className="font-semibold text-gray-800">{vendor.contact_name || '—'}</p>
                      <p className="text-gray-500">{vendor.phone || vendor.email || '—'}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-brand-dark">
                      {formatCurrency(vendor.total_owed)}
                    </td>
                    <td className="px-5 py-4 text-right text-emerald-600 font-medium">
                      {formatCurrency(vendor.total_paid)}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-amber-600">
                      {formatCurrency(vendor.outstanding_balance || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 text-sm">
                    No vendor profiles added yet. Seed data via Supabase SQL or add vendors as costs are registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
