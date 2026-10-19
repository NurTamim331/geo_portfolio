'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, Mail, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/ui/BrandLogo';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClientDenied, setIsClientDenied] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const supabase = createClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsClientDenied(false);

    try {
      // 1. First attempt master admin login via /api/admin/login
      const apiRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const apiData = await apiRes.json();

      if (apiRes.ok && apiData.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectTo.startsWith('/admin') ? redirectTo : '/admin');
          router.refresh();
        }, 500);
        return;
      }

      // 2. Otherwise attempt standard Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          setError('Email verification required. Please check your inbox or sign in with verified administrative credentials.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Verify admin role in profiles
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profile || profile.role !== 'admin') {
          // If not an admin, sign out immediately
          await supabase.auth.signOut();
          setIsClientDenied(true);
          setError('Access Denied: This account does not possess administrator permissions. Please use the Client Portal.');
          setLoading(false);
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          router.push(redirectTo.startsWith('/admin') ? redirectTo : '/admin');
          router.refresh();
        }, 600);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,_#1e1b4b_0%,_#020617_75%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/5">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>Staff & Management Console</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0b132b]/95 backdrop-blur-xl border border-amber-400/20 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 relative">
          {/* Subtle top golden border accent */}
          <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <BrandLogo size="md" showTagline={false} />
            </div>
            <h1 className="text-white font-display font-black text-2xl tracking-tight">
              Admin Portal
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Sign in with your administrative credentials to manage billing, dossiers, and agency operations.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs leading-relaxed flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                {isClientDenied && (
                  <Link
                    href="/auth/login"
                    className="inline-block mt-2 font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    Go to Client Login Portal →
                  </Link>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Identity verified. Redirecting to Management Console...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@geotrips.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Access Management Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Links & Alternate Portals */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-3">
            <p className="text-slate-400 text-xs">
              Are you a client looking for your trips?{' '}
              <Link href="/auth/login" className="text-sky-400 hover:text-sky-300 font-bold transition">
                Client Portal Login →
              </Link>
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              Return to Public Website
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-600 mt-6 font-mono">
          GEO Trips Management System · Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-amber-400 font-bold text-sm">
          Loading Admin Portal...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
