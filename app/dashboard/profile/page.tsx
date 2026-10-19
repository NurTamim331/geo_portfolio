'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Shield, ExternalLink, Save, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import type { Profile } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data) {
            setProfile(data);
            setForm(data);
          } else {
            // Mock profile if newly authenticated or unseeded
            const mock = {
              id: user.id,
              full_name: user.user_metadata?.full_name || 'Client',
              email: user.email || '',
              phone: user.user_metadata?.phone || '',
              role: 'client' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              passport_number: null,
              passport_expiry: null,
              nationality: 'Bangladeshi',
              date_of_birth: null,
              drive_folder_link: null,
              avatar_url: null,
              is_active: true,
            };
            setProfile(mock);
            setForm(mock);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      if (profile?.id) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: form.full_name,
            phone: form.phone,
            passport_number: form.passport_number,
            passport_expiry: form.passport_expiry,
            nationality: form.nationality,
            date_of_birth: form.date_of_birth,
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const passportDays = form.passport_expiry
    ? Math.ceil((new Date(form.passport_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Passport & Profile Management
        </h1>
        <p className="text-gray-500 mt-1">
          Keep your identification and consular documentation updated for rapid visa filing.
        </p>
      </div>

      {passportDays !== null && passportDays < 180 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <span className="font-bold">Passport Validity Notice: </span>
            Your passport expires in <strong className="text-red-600">{passportDays} days</strong> ({formatDate(form.passport_expiry!)}).
            Most embassies (Singapore, Thailand, Malaysia, China) enforce a strict minimum 6-month validity threshold before accepting files.
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Profile and passport details updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="p-2 bg-blue-50 text-brand-blue-600 rounded-xl">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-brand-dark">Personal Information</h2>
              <p className="text-xs text-gray-400">Used for flight e-ticket reservations and invoice billing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Full Name (As on Passport) *
              </label>
              <input
                type="text"
                required
                value={form.full_name || ''}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Primary Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-4 py-3 bg-slate-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.date_of_birth || ''}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Passport Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-brand-dark">Passport Identification</h2>
              <p className="text-xs text-gray-400">Encrypted in Supabase PostgreSQL; accessed only by authorized visa officers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Passport Number
              </label>
              <input
                type="text"
                placeholder="e.g. A01234567"
                value={form.passport_number || ''}
                onChange={(e) => setForm({ ...form, passport_number: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-brand-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Passport Expiration Date
              </label>
              <input
                type="date"
                value={form.passport_expiry || ''}
                onChange={(e) => setForm({ ...form, passport_expiry: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Nationality
              </label>
              <input
                type="text"
                placeholder="Bangladeshi"
                value={form.nationality || ''}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold text-sm rounded-xl transition shadow-lg hover:shadow-brand-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Updates</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
