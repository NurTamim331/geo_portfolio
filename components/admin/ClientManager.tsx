'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, getPassportDaysRemaining, cn } from '@/lib/utils';
import type { Profile, Passport, PassportStatus, PassportType } from '@/lib/supabase/types';
import {
  Users, Search, Plus, Edit3, FolderOpen, AlertTriangle,
  CheckCircle, X, Shield, Phone, Mail, FileText, Globe,
  Calendar, CheckCircle2, AlertCircle, Bookmark, Star,
  Trash2, Eye, MapPin, UserCheck, Layers, ExternalLink, Printer
} from 'lucide-react';

interface ClientManagerProps {
  initialClients: Profile[];
}

export function ClientManager({ initialClients }: ClientManagerProps) {
  const [clients, setClients] = useState<Profile[]>(initialClients);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'admin'>('all');
  const [filterPassport, setFilterPassport] = useState<'all' | 'valid' | 'expiring' | 'multiple'>('all');

  // Modals state
  const [editingClient, setEditingClient] = useState<Profile | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [viewingDossier, setViewingDossier] = useState<Profile | null>(null);
  const [passportModalClient, setPassportModalClient] = useState<Profile | null>(null);

  // Passport Form inside Passport Modal
  const [editingPassport, setEditingPassport] = useState<Passport | null>(null);
  const [isAddingPassport, setIsAddingPassport] = useState(false);
  const [passportFormData, setPassportFormData] = useState({
    passport_number: '',
    issuing_country: 'Bangladesh',
    issue_date: '',
    expiry_date: '',
    surname: '',
    given_name: '',
    passport_type: 'ordinary' as PassportType,
    status: 'active' as PassportStatus,
    is_primary: false,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form state for New Client Registration
  const [newClientData, setNewClientData] = useState({
    surname: '',
    given_name: '',
    full_name: '',
    email: '',
    phone: '',
    nationality: 'Bangladeshi',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    fathers_name: '',
    mothers_name: '',
    drive_folder_link: '',
    role: 'client' as 'client' | 'admin',
    // Initial Passport
    has_initial_passport: true,
    passport_number: '',
    issuing_country: 'Bangladesh',
    issue_date: '',
    passport_expiry: '',
    passport_type: 'ordinary' as PassportType,
    passport_notes: '',
  });

  // Safe UUID generator for PostgreSQL compatibility
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Calculate age from date of birth
  const getAge = (dob: string | null | undefined): number | null => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // --------------------------------------------------------------------------
  // Update Client Personal Dossier
  // --------------------------------------------------------------------------
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setLoading(true);
    try {
      const computedFullName =
        editingClient.full_name?.trim() ||
        `${editingClient.given_name || ''} ${editingClient.surname || ''}`.trim() ||
        'Unnamed Client';

      const updatePayload: Partial<Profile> = {
        full_name: computedFullName,
        surname: editingClient.surname || null,
        given_name: editingClient.given_name || null,
        phone: editingClient.phone || null,
        email: editingClient.email || null,
        passport_number: editingClient.passport_number || null,
        passport_expiry: editingClient.passport_expiry || null,
        issued_country: editingClient.issued_country || 'Bangladesh',
        nationality: editingClient.nationality || 'Bangladeshi',
        date_of_birth: editingClient.date_of_birth || null,
        gender: editingClient.gender || 'Male',
        address: editingClient.address || null,
        fathers_name: editingClient.fathers_name || null,
        mothers_name: editingClient.mothers_name || null,
        drive_folder_link: editingClient.drive_folder_link || null,
        role: editingClient.role,
        is_active: editingClient.is_active,
        passports: editingClient.passports || [],
        updated_at: new Date().toISOString(),
      };

      try {
        await supabase
          .from('profiles')
          .update(updatePayload as any)
          .eq('id', editingClient.id);
      } catch (err) {
        console.warn('Database update note:', err);
      }

      setClients(
        clients.map((c) =>
          c.id === editingClient.id ? { ...c, ...updatePayload } : c
        )
      );

      showToast(`Dossier for ${computedFullName} updated successfully!`);
      setEditingClient(null);
    } catch (err: any) {
      showToast(err.message || 'Error updating client dossier', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Create New Client
  // --------------------------------------------------------------------------
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const computedName =
      newClientData.full_name.trim() ||
      `${newClientData.given_name} ${newClientData.surname}`.trim();

    if (!computedName) {
      showToast('Client Name (or Surname & Given Name) is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const newClientId = generateUUID();
      
      const newPassports: Passport[] = [];
      if (newClientData.has_initial_passport && newClientData.passport_number.trim()) {
        newPassports.push({
          id: generateUUID(),
          client_id: newClientId,
          passport_number: newClientData.passport_number.trim().toUpperCase(),
          surname: newClientData.surname || null,
          given_name: newClientData.given_name || null,
          nationality: newClientData.nationality || 'Bangladeshi',
          issuing_country: newClientData.issuing_country || 'Bangladesh',
          issue_date: newClientData.issue_date || null,
          expiry_date: newClientData.passport_expiry || null,
          date_of_birth: newClientData.date_of_birth || null,
          passport_type: newClientData.passport_type,
          status: 'active',
          is_primary: true,
          notes: newClientData.passport_notes || 'Initial primary passport',
          created_at: new Date().toISOString(),
        });
      }

      const payload: Profile = {
        id: newClientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: computedName,
        surname: newClientData.surname || null,
        given_name: newClientData.given_name || null,
        email: newClientData.email || null,
        phone: newClientData.phone || null,
        role: newClientData.role,
        passport_number: newPassports[0]?.passport_number || null,
        passport_expiry: newPassports[0]?.expiry_date || null,
        issued_country: newPassports[0]?.issuing_country || 'Bangladesh',
        nationality: newClientData.nationality || 'Bangladeshi',
        date_of_birth: newClientData.date_of_birth || null,
        gender: newClientData.gender || 'Male',
        address: newClientData.address || null,
        fathers_name: newClientData.fathers_name || null,
        mothers_name: newClientData.mothers_name || null,
        drive_folder_link: newClientData.drive_folder_link || null,
        avatar_url: null,
        is_active: true,
        passports: newPassports,
      };

      // Try inserting into profiles table
      try {
        await supabase.from('profiles').insert(payload as any);
      } catch (dbErr) {
        console.warn('Profile insert note:', dbErr);
      }

      // Try inserting into passports table if passport provided
      if (newPassports.length > 0) {
        try {
          await supabase.from('passports').insert(newPassports[0] as any);
        } catch {}
      }

      setClients([payload, ...clients]);
      showToast(`Client ${payload.full_name} added to CRM with passport dossier!`);
      setIsAddingNew(false);

      // Reset form
      setNewClientData({
        surname: '',
        given_name: '',
        full_name: '',
        email: '',
        phone: '',
        nationality: 'Bangladeshi',
        date_of_birth: '',
        gender: 'Male',
        address: '',
        fathers_name: '',
        mothers_name: '',
        drive_folder_link: '',
        role: 'client',
        has_initial_passport: true,
        passport_number: '',
        issuing_country: 'Bangladesh',
        issue_date: '',
        passport_expiry: '',
        passport_type: 'ordinary',
        passport_notes: '',
      });
    } catch (err: any) {
      showToast(err.message || 'Error adding client', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Passport Management for Selected Client
  // --------------------------------------------------------------------------
  const openPassportManager = (client: Profile) => {
    setPassportModalClient(client);
    setIsAddingPassport(false);
    setEditingPassport(null);
  };

  const handleSavePassport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportModalClient) return;

    if (!passportFormData.passport_number.trim()) {
      showToast('Passport Number is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const clientPassports = passportModalClient.passports ? [...passportModalClient.passports] : [];
      let updatedPassports: Passport[] = [];

      if (editingPassport) {
        // Update existing passport
        updatedPassports = clientPassports.map((p) => {
          if (p.id === editingPassport.id) {
            return {
              ...p,
              passport_number: passportFormData.passport_number.trim().toUpperCase(),
              issuing_country: passportFormData.issuing_country,
              issue_date: passportFormData.issue_date || null,
              expiry_date: passportFormData.expiry_date || null,
              surname: passportFormData.surname || passportModalClient.surname || null,
              given_name: passportFormData.given_name || passportModalClient.given_name || null,
              passport_type: passportFormData.passport_type,
              status: passportFormData.status,
              is_primary: passportFormData.is_primary,
              notes: passportFormData.notes || null,
              updated_at: new Date().toISOString(),
            };
          }
          // If this one is marked primary, demote others
          if (passportFormData.is_primary) {
            return { ...p, is_primary: false };
          }
          return p;
        });
      } else {
        // Add new passport
        const newPass: Passport = {
          id: generateUUID(),
          client_id: passportModalClient.id,
          passport_number: passportFormData.passport_number.trim().toUpperCase(),
          issuing_country: passportFormData.issuing_country,
          issue_date: passportFormData.issue_date || null,
          expiry_date: passportFormData.expiry_date || null,
          surname: passportFormData.surname || passportModalClient.surname || null,
          given_name: passportFormData.given_name || passportModalClient.given_name || null,
          passport_type: passportFormData.passport_type,
          status: passportFormData.status,
          is_primary: passportFormData.is_primary || clientPassports.length === 0,
          notes: passportFormData.notes || null,
          created_at: new Date().toISOString(),
        };

        if (newPass.is_primary) {
          updatedPassports = clientPassports.map((p) => ({ ...p, is_primary: false }));
          updatedPassports.push(newPass);
        } else {
          updatedPassports = [...clientPassports, newPass];
        }
      }

      // Determine the primary passport
      const primaryPassport = updatedPassports.find((p) => p.is_primary) || updatedPassports[0];

      // Update client object
      const updatedClient: Profile = {
        ...passportModalClient,
        passports: updatedPassports,
        passport_number: primaryPassport?.passport_number || null,
        passport_expiry: primaryPassport?.expiry_date || null,
        issued_country: primaryPassport?.issuing_country || passportModalClient.issued_country || 'Bangladesh',
        updated_at: new Date().toISOString(),
      };

      // Try updating database
      try {
        await supabase
          .from('profiles')
          .update({
            passport_number: updatedClient.passport_number,
            passport_expiry: updatedClient.passport_expiry,
            issued_country: updatedClient.issued_country,
            passports: updatedClient.passports,
            updated_at: new Date().toISOString(),
          } as any)
          .eq('id', updatedClient.id);
      } catch (dbErr) {
        console.warn('Profiles update error:', dbErr);
      }

      // Try updating passports table if present
      try {
        if (editingPassport) {
          const passToSave = updatedPassports.find((p) => p.id === editingPassport.id);
          if (passToSave) {
            await supabase.from('passports').upsert(passToSave as any);
          }
        }
      } catch {}

      // Update state
      setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
      setPassportModalClient(updatedClient);
      setIsAddingPassport(false);
      setEditingPassport(null);

      showToast(`Passport ${passportFormData.passport_number.toUpperCase()} saved for ${passportModalClient.full_name}!`);
    } catch (err: any) {
      showToast(err.message || 'Error saving passport', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryPassport = async (passportId: string) => {
    if (!passportModalClient || !passportModalClient.passports) return;

    const updatedPassports = passportModalClient.passports.map((p) => ({
      ...p,
      is_primary: p.id === passportId,
    }));

    const primaryPassport = updatedPassports.find((p) => p.is_primary);

    const updatedClient: Profile = {
      ...passportModalClient,
      passports: updatedPassports,
      passport_number: primaryPassport?.passport_number || null,
      passport_expiry: primaryPassport?.expiry_date || null,
      issued_country: primaryPassport?.issuing_country || passportModalClient.issued_country,
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase
        .from('profiles')
        .update({
          passport_number: updatedClient.passport_number,
          passport_expiry: updatedClient.passport_expiry,
          issued_country: updatedClient.issued_country,
          passports: updatedClient.passports,
        } as any)
        .eq('id', updatedClient.id);
    } catch {}

    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    setPassportModalClient(updatedClient);
    showToast(`Passport ${primaryPassport?.passport_number} set as Primary Passport!`);
  };

  const handleDeletePassport = async (passportId: string) => {
    if (!passportModalClient || !passportModalClient.passports) return;
    if (!confirm('Are you sure you want to remove this passport from the client dossier?')) return;

    const updatedPassports = passportModalClient.passports.filter((p) => p.id !== passportId);
    const primaryPassport = updatedPassports.find((p) => p.is_primary) || updatedPassports[0];

    const updatedClient: Profile = {
      ...passportModalClient,
      passports: updatedPassports,
      passport_number: primaryPassport?.passport_number || null,
      passport_expiry: primaryPassport?.expiry_date || null,
      issued_country: primaryPassport?.issuing_country || null,
    };

    try {
      await supabase
        .from('profiles')
        .update({
          passport_number: updatedClient.passport_number,
          passport_expiry: updatedClient.passport_expiry,
          issued_country: updatedClient.issued_country,
          passports: updatedClient.passports,
        } as any)
        .eq('id', updatedClient.id);

      await supabase.from('passports').delete().eq('id', passportId);
    } catch {}

    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    setPassportModalClient(updatedClient);
    showToast('Passport removed from dossier.');
  };

  const startEditPassport = (passport: Passport) => {
    setEditingPassport(passport);
    setIsAddingPassport(true);
    setPassportFormData({
      passport_number: passport.passport_number,
      issuing_country: passport.issuing_country || 'Bangladesh',
      issue_date: passport.issue_date || '',
      expiry_date: passport.expiry_date || '',
      surname: passport.surname || passportModalClient?.surname || '',
      given_name: passport.given_name || passportModalClient?.given_name || '',
      passport_type: passport.passport_type || 'ordinary',
      status: passport.status || 'active',
      is_primary: !!passport.is_primary,
      notes: passport.notes || '',
    });
  };

  const startAddPassport = () => {
    setEditingPassport(null);
    setIsAddingPassport(true);
    setPassportFormData({
      passport_number: '',
      issuing_country: passportModalClient?.issued_country || 'Bangladesh',
      issue_date: '',
      expiry_date: '',
      surname: passportModalClient?.surname || '',
      given_name: passportModalClient?.given_name || '',
      passport_type: 'ordinary',
      status: 'active',
      is_primary: (passportModalClient?.passports?.length || 0) === 0,
      notes: '',
    });
  };

  // --------------------------------------------------------------------------
  // Filter Clients
  // --------------------------------------------------------------------------
  const filteredClients = clients.filter((c) => {
    // Role filter
    if (filterRole !== 'all' && c.role !== filterRole) return false;

    // Passport status filter
    if (filterPassport === 'valid') {
      const days = getPassportDaysRemaining(c.passport_expiry);
      if (days === null || days < 180) return false;
    } else if (filterPassport === 'expiring') {
      const days = getPassportDaysRemaining(c.passport_expiry);
      if (days === null || days >= 180) return false;
    } else if (filterPassport === 'multiple') {
      if (!c.passports || c.passports.length < 2) return false;
    }

    // Search query matching
    if (search.trim()) {
      const q = search.toLowerCase();
      const hasPassportMatch = c.passports?.some((p) =>
        p.passport_number.toLowerCase().includes(q) ||
        p.notes?.toLowerCase().includes(q)
      );

      return (
        c.full_name?.toLowerCase().includes(q) ||
        c.surname?.toLowerCase().includes(q) ||
        c.given_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.passport_number?.toLowerCase().includes(q) ||
        c.fathers_name?.toLowerCase().includes(q) ||
        c.mothers_name?.toLowerCase().includes(q) ||
        c.nationality?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        hasPassportMatch
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-bold animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40 shadow-emerald-900/50'
              : 'bg-red-950 text-red-200 border-red-500/40 shadow-red-900/50'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark flex items-center gap-2.5">
            <Users className="h-7 w-7 text-brand-blue-600" />
            CRM &amp; Passport Dossiers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete traveler KYC database with multi-passport archives, family details, Google Drive links, and validity tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, surname, passport #, father, phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'client', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold transition capitalize cursor-pointer',
                  filterRole === r
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {r === 'all' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>

          {/* Passport Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterPassport('all')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer',
                filterPassport === 'all' ? 'bg-brand-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              All Passports
            </button>
            <button
              onClick={() => setFilterPassport('expiring')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1',
                filterPassport === 'expiring' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-800 hover:bg-amber-100'
              )}
            >
              <AlertTriangle className="h-3 w-3" />
              Expiring Soon
            </button>
            <button
              onClick={() => setFilterPassport('multiple')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1',
                filterPassport === 'multiple' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Layers className="h-3 w-3" />
              Multi-Passports
            </button>
          </div>

          <div className="px-3 py-1.5 bg-slate-50 border border-gray-200 text-slate-700 text-xs font-extrabold rounded-xl">
            Showing: {filteredClients.length} of {clients.length}
          </div>
        </div>
      </div>

      {/* Clients & Passports Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">Client &amp; Passport Name</th>
                <th className="px-5 py-3.5">Primary Passport &amp; Validity</th>
                <th className="px-5 py-3.5">Linked Passports</th>
                <th className="px-5 py-3.5">KYC &amp; Family Info</th>
                <th className="px-5 py-3.5">Cloud Drive</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client) => {
                const daysLeft = getPassportDaysRemaining(client.passport_expiry);
                const expiryWarning = daysLeft !== null && daysLeft < 180;
                const isExpired = daysLeft !== null && daysLeft <= 0;
                const passportsCount = client.passports?.length || (client.passport_number ? 1 : 0);
                const age = getAge(client.date_of_birth);

                return (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition">
                    {/* Client & Passport Name */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-brand-dark">
                            {client.surname ? (
                              <>
                                <span className="uppercase text-brand-blue-700">{client.surname}</span>,{' '}
                                <span>{client.given_name || client.full_name}</span>
                              </>
                            ) : (
                              client.full_name || 'Unnamed Client'
                            )}
                          </span>

                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider',
                              client.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {client.role}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          {client.nationality && (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                              <Globe className="h-3 w-3 text-sky-600" />
                              {client.nationality}
                            </span>
                          )}
                          {client.date_of_birth && (
                            <span className="text-gray-400">
                              DOB: {formatDate(client.date_of_birth)} {age !== null && `(${age} yrs)`}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-gray-500 flex items-center gap-3">
                          {client.phone && <span>📞 {client.phone}</span>}
                          {client.email && <span>✉️ {client.email}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Primary Passport & Validity */}
                    <td className="px-5 py-4">
                      {client.passport_number ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black px-2.5 py-1 bg-slate-900 text-amber-300 rounded-lg tracking-wider text-xs shadow-xs">
                              {client.passport_number}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {client.issued_country || 'BD'}
                            </span>
                          </div>

                          {client.passport_expiry && (
                            <div>
                              {isExpired ? (
                                <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 text-[10px]">
                                  <AlertCircle className="h-3 w-3" />
                                  Expired ({formatDate(client.passport_expiry)})
                                </span>
                              ) : expiryWarning ? (
                                <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 text-[10px]">
                                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                                  Expiring ({daysLeft}d left) · {formatDate(client.passport_expiry)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                                  Valid ({daysLeft}d left)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No passport registered</span>
                      )}
                    </td>

                    {/* Linked Passports (Multiple) */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openPassportManager(client)}
                            className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer border',
                              passportsCount > 1
                                ? 'bg-blue-50 text-brand-blue-700 border-blue-200 hover:bg-blue-100'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            )}
                          >
                            <Layers className="h-3 w-3" />
                            <span>{passportsCount} {passportsCount === 1 ? 'Passport' : 'Passports'}</span>
                          </button>
                        </div>

                        {client.passports && client.passports.length > 1 && (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {client.passports.map((p) => (
                              <span
                                key={p.id}
                                className={cn(
                                  'text-[10px] font-mono px-1.5 py-0.5 rounded border',
                                  p.is_primary
                                    ? 'bg-amber-50 border-amber-200 font-bold text-amber-900'
                                    : p.status === 'expired'
                                    ? 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                )}
                                title={`${p.passport_number} (${p.status || 'active'}) - ${p.notes || ''}`}
                              >
                                {p.passport_number}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* KYC & Family Info */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 text-[11px] max-w-xs">
                        {client.fathers_name && (
                          <p className="text-gray-700">
                            <span className="font-bold text-gray-400 uppercase text-[9px] mr-1">Father:</span>
                            {client.fathers_name}
                          </p>
                        )}
                        {client.mothers_name && (
                          <p className="text-gray-700">
                            <span className="font-bold text-gray-400 uppercase text-[9px] mr-1">Mother:</span>
                            {client.mothers_name}
                          </p>
                        )}
                        {client.address ? (
                          <p className="text-gray-500 truncate" title={client.address}>
                            <span className="font-bold text-gray-400 uppercase text-[9px] mr-1">Addr:</span>
                            {client.address}
                          </p>
                        ) : (
                          !client.fathers_name && !client.mothers_name && (
                            <span className="text-gray-400 italic text-[11px]">KYC pending</span>
                          )
                        )}
                      </div>
                    </td>

                    {/* Dedicated Google Drive Link */}
                    <td className="px-5 py-4">
                      {client.drive_folder_link ? (
                        <a
                          href={client.drive_folder_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue-600 font-bold rounded-lg border border-blue-200 transition text-[11px]"
                        >
                          <FolderOpen className="h-3.5 w-3.5" />
                          <span>Open Drive</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No link</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingDossier(client)}
                          title="View Full Passport Dossier"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => openPassportManager(client)}
                          title="Manage Passports"
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition cursor-pointer font-bold flex items-center gap-1 text-[11px]"
                        >
                          <Bookmark className="h-3.5 w-3.5 text-amber-600" />
                          <span>Passports</span>
                        </button>

                        <button
                          onClick={() => setEditingClient(JSON.parse(JSON.stringify(client)))}
                          title="Edit Personal Data"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition cursor-pointer text-xs"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                    No clients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW FULL CLIENT & PASSPORT DOSSIER                              */}
      {/* ========================================================================= */}
      {viewingDossier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Traveler Dossier &amp; KYC Sheet
                </span>
                <h2 className="font-display font-black text-2xl text-white mt-1">
                  {viewingDossier.full_name || 'Client Profile'}
                </h2>
              </div>
              <button
                onClick={() => setViewingDossier(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              {/* Identity & Passport Bio */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="font-display font-black text-sm text-brand-dark mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-brand-blue-600" />
                  Passport Bio-Data Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Surname</span>
                    <span className="font-bold text-gray-900 text-sm uppercase">{viewingDossier.surname || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Given Name</span>
                    <span className="font-bold text-gray-900 text-sm">{viewingDossier.given_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Gender</span>
                    <span className="font-medium text-gray-800">{viewingDossier.gender || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Nationality</span>
                    <span className="font-medium text-gray-800">{viewingDossier.nationality || 'Bangladeshi'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Date of Birth</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(viewingDossier.date_of_birth)} {getAge(viewingDossier.date_of_birth) !== null && `(${getAge(viewingDossier.date_of_birth)} years)`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Primary Issued Country</span>
                    <span className="font-medium text-gray-800">{viewingDossier.issued_country || 'Bangladesh'}</span>
                  </div>
                </div>
              </div>

              {/* Family & Address Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="font-display font-black text-sm text-brand-dark mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  Family &amp; Residence Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Father&apos;s Name</span>
                    <span className="font-medium text-gray-900">{viewingDossier.fathers_name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Mother&apos;s Name</span>
                    <span className="font-medium text-gray-900">{viewingDossier.mothers_name || 'Not provided'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Permanent / Present Address</span>
                    <span className="font-medium text-gray-900">{viewingDossier.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Linked Passports List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-black text-sm text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Bookmark className="h-4 w-4 text-emerald-600" />
                    Linked Passports Archive ({viewingDossier.passports?.length || 0})
                  </h3>
                  <button
                    onClick={() => {
                      setViewingDossier(null);
                      openPassportManager(viewingDossier);
                    }}
                    className="text-xs font-bold text-brand-blue-600 hover:underline cursor-pointer"
                  >
                    + Manage / Add Passport
                  </button>
                </div>

                <div className="space-y-2">
                  {viewingDossier.passports && viewingDossier.passports.length > 0 ? (
                    viewingDossier.passports.map((p) => {
                      const days = getPassportDaysRemaining(p.expiry_date);
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            'p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2',
                            p.is_primary
                              ? 'bg-amber-50/70 border-amber-300'
                              : 'bg-white border-gray-200'
                          )}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-gray-900">
                                {p.passport_number}
                              </span>
                              {p.is_primary && (
                                <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Star className="h-2.5 w-2.5 fill-current" />
                                  Primary
                                </span>
                              )}
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                {p.issuing_country || 'Bangladesh'}
                              </span>
                              <span
                                className={cn(
                                  'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                                  p.status === 'expired'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                )}
                              >
                                {p.status || 'active'}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-500 mt-1">
                              Issued: {formatDate(p.issue_date)} · Expires: {formatDate(p.expiry_date)}{' '}
                              {days !== null && `(${days} days left)`}
                            </p>
                            {p.notes && <p className="text-[11px] text-gray-600 italic mt-0.5">{p.notes}</p>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl">
                      No linked passports recorded.
                    </p>
                  )}
                </div>
              </div>

              {/* Cloud Drive Archive */}
              {viewingDossier.drive_folder_link && (
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-brand-blue-900 text-xs flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4 text-brand-blue-600" />
                      Client Dedicated Google Drive Folder
                    </span>
                    <p className="text-[11px] text-brand-blue-700 font-mono truncate max-w-md">
                      {viewingDossier.drive_folder_link}
                    </p>
                  </div>
                  <a
                    href={viewingDossier.drive_folder_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl transition text-xs shrink-0 flex items-center gap-1.5"
                  >
                    <span>Open Drive</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewingDossier(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANAGE MULTIPLE PASSPORTS LINKED TO CLIENT                       */}
      {/* ========================================================================= */}
      {passportModalClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4" />
                  Passport Management
                </span>
                <h2 className="font-display font-black text-2xl text-white mt-1">
                  Passports for {passportModalClient.full_name || 'Client'}
                </h2>
              </div>
              <button
                onClick={() => setPassportModalClient(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* List of existing passports */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs">
                    Linked Passports ({passportModalClient.passports?.length || 0})
                  </h3>
                  {!isAddingPassport && (
                    <button
                      onClick={startAddPassport}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-lg text-xs transition cursor-pointer shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Link New Passport</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {passportModalClient.passports && passportModalClient.passports.length > 0 ? (
                    passportModalClient.passports.map((p) => {
                      const days = getPassportDaysRemaining(p.expiry_date);
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            'p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                            p.is_primary
                              ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                              : 'bg-slate-50 border-gray-200'
                          )}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-base text-gray-900">
                                {p.passport_number}
                              </span>
                              {p.is_primary ? (
                                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                  <Star className="h-3 w-3 fill-current" />
                                  Primary
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetPrimaryPassport(p.id)}
                                  className="text-[10px] font-bold text-gray-500 hover:text-brand-blue-600 underline cursor-pointer"
                                >
                                  Set as Primary
                                </button>
                              )}
                              <span className="bg-white border text-gray-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                                {p.issuing_country || 'Bangladesh'}
                              </span>
                              <span
                                className={cn(
                                  'text-[10px] font-bold uppercase px-2 py-0.5 rounded',
                                  p.status === 'expired'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                )}
                              >
                                {p.status || 'active'}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-500">
                              Issued: {formatDate(p.issue_date)} · Expires: {formatDate(p.expiry_date)}{' '}
                              {days !== null && `(${days} days left)`}
                            </p>
                            {p.notes && <p className="text-[11px] text-gray-600 italic">{p.notes}</p>}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => startEditPassport(p)}
                              className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-300 transition cursor-pointer text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePassport(p.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer"
                              title="Delete Passport"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-gray-300 rounded-2xl">
                      <p className="text-gray-400">No passports linked yet.</p>
                      <button
                        onClick={startAddPassport}
                        className="mt-2 text-xs font-bold text-brand-blue-600 hover:underline cursor-pointer"
                      >
                        + Add the first passport
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Add / Edit Passport Form */}
              {isAddingPassport && (
                <form
                  onSubmit={handleSavePassport}
                  className="bg-slate-50 p-5 rounded-2xl border border-brand-blue-200/80 space-y-4"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <Edit3 className="h-3.5 w-3.5 text-brand-blue-600" />
                      {editingPassport ? `Edit Passport ${editingPassport.passport_number}` : 'Add New Passport'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingPassport(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Passport Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={passportFormData.passport_number}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, passport_number: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. A01234567"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Issuing Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={passportFormData.issuing_country}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, issuing_country: e.target.value })
                        }
                        placeholder="e.g. Bangladesh, UK, USA"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Date of Issue
                      </label>
                      <input
                        type="date"
                        value={passportFormData.issue_date}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, issue_date: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Date of Expiry *
                      </label>
                      <input
                        type="date"
                        required
                        value={passportFormData.expiry_date}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, expiry_date: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Passport Type
                      </label>
                      <select
                        value={passportFormData.passport_type}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, passport_type: e.target.value as any })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold"
                      >
                        <option value="ordinary">Ordinary / Regular</option>
                        <option value="official">Official / Government</option>
                        <option value="diplomatic">Diplomatic</option>
                        <option value="special">Special</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Status
                      </label>
                      <select
                        value={passportFormData.status}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, status: e.target.value as any })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold"
                      >
                        <option value="active">Active / Current</option>
                        <option value="expired">Expired (Old Passport)</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Special Notes (Visas, Endorsements, Old Passport Info)
                      </label>
                      <input
                        type="text"
                        value={passportFormData.notes}
                        onChange={(e) =>
                          setPassportFormData({ ...passportFormData, notes: e.target.value })
                        }
                        placeholder="e.g. Has 10-year valid US B1/B2 visa, previous Schengen stamps"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                        <input
                          type="checkbox"
                          checked={passportFormData.is_primary}
                          onChange={(e) =>
                            setPassportFormData({ ...passportFormData, is_primary: e.target.checked })
                          }
                          className="rounded text-brand-blue-600 focus:ring-brand-blue-500 h-4 w-4"
                        />
                        <span>Set as Client&apos;s Primary Passport</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPassport(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-black rounded-xl transition shadow-xs cursor-pointer"
                    >
                      {loading ? 'Saving...' : 'Save Passport to Dossier'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setPassportModalClient(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MODIFY CLIENT DOSSIER                                            */}
      {/* ========================================================================= */}
      {editingClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  Update Dossier
                </span>
                <h2 className="font-display font-black text-2xl text-white">
                  Modify {editingClient.full_name || 'Client'}
                </h2>
              </div>
              <button
                onClick={() => setEditingClient(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClient} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* 1. Passport Identity Section */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <UserCheck className="h-4 w-4 text-brand-blue-600" />
                  1. Passport Identity Fields
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Surname (Last Name) *
                    </label>
                    <input
                      type="text"
                      value={editingClient.surname || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, surname: e.target.value })}
                      placeholder="e.g. Hossain"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Given Name(s) *
                    </label>
                    <input
                      type="text"
                      value={editingClient.given_name || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, given_name: e.target.value })}
                      placeholder="e.g. Mohammad Tanvir"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name (Display)
                    </label>
                    <input
                      type="text"
                      value={editingClient.full_name || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, full_name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      value={editingClient.nationality || 'Bangladeshi'}
                      onChange={(e) => setEditingClient({ ...editingClient, nationality: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-semibold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editingClient.date_of_birth || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, date_of_birth: e.target.value || null })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={editingClient.gender || 'Male'}
                      onChange={(e) => setEditingClient({ ...editingClient, gender: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Family & Residential Fields */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  2. Family &amp; Residential Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Father&apos;s Name (As per Passport)
                    </label>
                    <input
                      type="text"
                      value={editingClient.fathers_name || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, fathers_name: e.target.value })}
                      placeholder="Father's full name"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Mother&apos;s Name (As per Passport)
                    </label>
                    <input
                      type="text"
                      value={editingClient.mothers_name || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, mothers_name: e.target.value })}
                      placeholder="Mother's full name"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Permanent / Present Address
                    </label>
                    <input
                      type="text"
                      value={editingClient.address || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                      placeholder="House, Road, Area, City, Post Code"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Primary Passport Quick Details */}
              <div>
                <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                  <h4 className="font-black text-gray-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Bookmark className="h-4 w-4 text-emerald-600" />
                    3. Primary Passport Details
                  </h4>
                  <button
                    type="button"
                    onClick={() => openPassportManager(editingClient)}
                    className="text-xs font-bold text-brand-blue-600 hover:underline cursor-pointer"
                  >
                    Manage All Passports ({editingClient.passports?.length || 0}) ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Primary Passport No
                    </label>
                    <input
                      type="text"
                      value={editingClient.passport_number || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, passport_number: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Issued Country
                    </label>
                    <input
                      type="text"
                      value={editingClient.issued_country || 'Bangladesh'}
                      onChange={(e) => setEditingClient({ ...editingClient, issued_country: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Passport Expiry Date
                    </label>
                    <input
                      type="date"
                      value={editingClient.passport_expiry || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, passport_expiry: e.target.value || null })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Contact & Cloud Drive */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <Mail className="h-4 w-4 text-sky-600" />
                  4. Contact Details &amp; Cloud Drive Folder
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editingClient.email || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editingClient.phone || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      User Account Role
                    </label>
                    <select
                      value={editingClient.role}
                      onChange={(e) => setEditingClient({ ...editingClient, role: e.target.value as any })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Dedicated Google Drive Link
                    </label>
                    <input
                      type="url"
                      value={editingClient.drive_folder_link || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, drive_folder_link: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-black rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Dossier Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD NEW CLIENT WITH FULL PASSPORT FIELDS                         */}
      {/* ========================================================================= */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  New Client KYC Registration
                </span>
                <h2 className="font-display font-black text-2xl text-white">Register Traveler Dossier</h2>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* 1. Passport Identity Section */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <UserCheck className="h-4 w-4 text-brand-blue-600" />
                  1. Passport Identity Fields
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Surname (Last Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientData.surname}
                      onChange={(e) => setNewClientData({ ...newClientData, surname: e.target.value })}
                      placeholder="e.g. Islam"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Given Name(s) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientData.given_name}
                      onChange={(e) => setNewClientData({ ...newClientData, given_name: e.target.value })}
                      placeholder="e.g. Mohammad Shafiqul"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name (Auto/Custom)
                    </label>
                    <input
                      type="text"
                      value={
                        newClientData.full_name ||
                        `${newClientData.given_name} ${newClientData.surname}`.trim()
                      }
                      onChange={(e) => setNewClientData({ ...newClientData, full_name: e.target.value })}
                      placeholder="Full Name as printed on passport"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientData.nationality}
                      onChange={(e) => setNewClientData({ ...newClientData, nationality: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-semibold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newClientData.date_of_birth}
                      onChange={(e) => setNewClientData({ ...newClientData, date_of_birth: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={newClientData.gender}
                      onChange={(e) => setNewClientData({ ...newClientData, gender: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Family & Residential Fields */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  2. Family &amp; Residential Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Father&apos;s Name (As per Passport)
                    </label>
                    <input
                      type="text"
                      value={newClientData.fathers_name}
                      onChange={(e) => setNewClientData({ ...newClientData, fathers_name: e.target.value })}
                      placeholder="Father's full name"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Mother&apos;s Name (As per Passport)
                    </label>
                    <input
                      type="text"
                      value={newClientData.mothers_name}
                      onChange={(e) => setNewClientData({ ...newClientData, mothers_name: e.target.value })}
                      placeholder="Mother's full name"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Permanent / Present Address
                    </label>
                    <input
                      type="text"
                      value={newClientData.address}
                      onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                      placeholder="House, Road, Area, City, Post Code"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Initial Primary Passport */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <Bookmark className="h-4 w-4 text-emerald-600" />
                  3. Initial Primary Passport (Can link more later)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={newClientData.passport_number}
                      onChange={(e) => setNewClientData({ ...newClientData, passport_number: e.target.value.toUpperCase() })}
                      placeholder="e.g. B01928374"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Issued Country
                    </label>
                    <input
                      type="text"
                      value={newClientData.issuing_country}
                      onChange={(e) => setNewClientData({ ...newClientData, issuing_country: e.target.value })}
                      placeholder="Bangladesh"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Passport Expiry Date
                    </label>
                    <input
                      type="date"
                      value={newClientData.passport_expiry}
                      onChange={(e) => setNewClientData({ ...newClientData, passport_expiry: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Contact & Google Drive */}
              <div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5 border-b pb-1.5">
                  <Mail className="h-4 w-4 text-sky-600" />
                  4. Contact &amp; Dedicated Cloud Folder
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newClientData.email}
                      onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                      placeholder="client@email.com"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newClientData.phone}
                      onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Role
                    </label>
                    <select
                      value={newClientData.role}
                      onChange={(e) => setNewClientData({ ...newClientData, role: e.target.value as any })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Dedicated Google Drive Link
                    </label>
                    <input
                      type="url"
                      value={newClientData.drive_folder_link}
                      onChange={(e) => setNewClientData({ ...newClientData, drive_folder_link: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{loading ? 'Registering...' : 'Register Client Dossier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
