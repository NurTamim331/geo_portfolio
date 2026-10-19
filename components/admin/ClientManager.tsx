'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, getPassportDaysRemaining, cn } from '@/lib/utils';
import type { Profile } from '@/lib/supabase/types';
import {
  Users, Search, Plus, Edit3, FolderOpen, AlertTriangle,
  CheckCircle, X, Shield, Phone, Mail, FileText, Globe,
  Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ClientManagerProps {
  initialClients: Profile[];
}

export function ClientManager({ initialClients }: ClientManagerProps) {
  const [clients, setClients] = useState<Profile[]>(initialClients);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'admin'>('all');
  const [editingClient, setEditingClient] = useState<Profile | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form for New Client
  const [newClientData, setNewClientData] = useState({
    full_name: '',
    email: '',
    phone: '',
    passport_number: '',
    passport_expiry: '',
    nationality: 'Bangladeshi',
    date_of_birth: '',
    drive_folder_link: '',
    role: 'client' as 'client' | 'admin',
  });

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingClient.full_name,
          phone: editingClient.phone,
          email: editingClient.email,
          passport_number: editingClient.passport_number,
          passport_expiry: editingClient.passport_expiry,
          nationality: editingClient.nationality,
          date_of_birth: editingClient.date_of_birth,
          drive_folder_link: editingClient.drive_folder_link,
          role: editingClient.role,
          is_active: editingClient.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingClient.id);

      setClients(
        clients.map((c) =>
          c.id === editingClient.id ? { ...editingClient, updated_at: new Date().toISOString() } : c
        )
      );
      showToast(`User ${editingClient.full_name || 'record'} updated successfully!`);
      setEditingClient(null);
    } catch (err: any) {
      showToast(err.message || 'Error updating client', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.full_name.trim()) {
      showToast('Client name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const newId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      const payload: Profile = {
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: newClientData.full_name,
        email: newClientData.email || null,
        phone: newClientData.phone || null,
        role: newClientData.role,
        passport_number: newClientData.passport_number || null,
        passport_expiry: newClientData.passport_expiry || null,
        nationality: newClientData.nationality || 'Bangladeshi',
        date_of_birth: newClientData.date_of_birth || null,
        drive_folder_link: newClientData.drive_folder_link || null,
        avatar_url: null,
        is_active: true,
      };

      try {
        await supabase.from('profiles').insert(payload as any);
      } catch {}

      setClients([payload, ...clients]);
      showToast(`Client ${payload.full_name} added to CRM!`);
      setIsAddingNew(false);
      setNewClientData({
        full_name: '',
        email: '',
        phone: '',
        passport_number: '',
        passport_expiry: '',
        nationality: 'Bangladeshi',
        date_of_birth: '',
        drive_folder_link: '',
        role: 'client',
      });
    } catch (err: any) {
      showToast(err.message || 'Error adding client', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((c) => {
    if (filterRole !== 'all' && c.role !== filterRole) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.passport_number?.toLowerCase().includes(q)
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
            CRM &amp; Client Dossiers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View client profiles, update passport details, assign Google Drive folders, and manage roles.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, passport..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500">Role:</span>
          {(['all', 'client', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer',
                filterRole === r
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
              )}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
          <div className="ml-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-lg">
            Total: {filteredClients.length}
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">Client Name &amp; Role</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Passport Number</th>
                <th className="px-5 py-3.5">Passport Expiry</th>
                <th className="px-5 py-3.5">Google Drive Folder</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client) => {
                const daysLeft = getPassportDaysRemaining(client.passport_expiry);
                const expiryWarning = daysLeft !== null && daysLeft < 180;
                return (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-brand-dark">{client.full_name || 'Unnamed Client'}</p>
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
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        ID: {client.id.slice(0, 8)}... · {client.nationality || 'Bangladeshi'}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{client.email || 'No email'}</p>
                      <p className="text-gray-500 text-[11px]">{client.phone || 'No phone'}</p>
                    </td>

                    <td className="px-5 py-4">
                      {client.passport_number ? (
                        <span className="font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                          {client.passport_number}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not recorded</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {client.passport_expiry ? (
                        <div className="flex items-center gap-1.5">
                          {expiryWarning ? (
                            <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              {formatDate(client.passport_expiry)} ({daysLeft}d left)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-700">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                              {formatDate(client.passport_expiry)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {client.drive_folder_link ? (
                        <a
                          href={client.drive_folder_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue-600 font-bold rounded-lg border border-blue-200 transition"
                        >
                          <FolderOpen className="h-3.5 w-3.5" />
                          <span>Open Drive</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">No link assigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setEditingClient(JSON.parse(JSON.stringify(client)))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer text-xs"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                        <span>Modify Data</span>
                      </button>
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

      {/* Modify User Data Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
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

            <form onSubmit={handleUpdateClient} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClient.full_name || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, full_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    User Role
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
              </div>

              {/* Passport & Identity */}
              <div className="pt-2 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider">Passport Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={editingClient.passport_number || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, passport_number: e.target.value })}
                      placeholder="e.g. A01234567"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={editingClient.nationality || 'Bangladeshi'}
                      onChange={(e) => setEditingClient({ ...editingClient, nationality: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
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
                </div>
              </div>

              {/* Dedicated Google Drive Link */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Dedicated Google Drive Repository Folder Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingClient.drive_folder_link || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, drive_folder_link: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-mono text-[11px]"
                  />
                  {editingClient.drive_folder_link && (
                    <a
                      href={editingClient.drive_folder_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-brand-blue-600 font-bold rounded-xl border border-blue-200 transition shrink-0"
                    >
                      Test Link
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Admin assigns a private cloud folder where client passport scans, visas, and air tickets are safely archived.
                </p>
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

      {/* Add New Client Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  New Client Registration
                </span>
                <h2 className="font-display font-black text-2xl text-white">Add Client to CRM</h2>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientData.full_name}
                    onChange={(e) => setNewClientData({ ...newClientData, full_name: e.target.value })}
                    placeholder="e.g. Mohammad Shafiqul Islam"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900"
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
              </div>

              <div className="pt-2 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider">Passport Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={newClientData.passport_number}
                      onChange={(e) => setNewClientData({ ...newClientData, passport_number: e.target.value })}
                      placeholder="e.g. B01928374"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono text-gray-900"
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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>
                </div>
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
                  <span>{loading ? 'Creating...' : 'Register Client'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
