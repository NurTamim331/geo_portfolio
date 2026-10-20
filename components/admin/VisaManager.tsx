'use client';

import React, { useState } from 'react';
import { VisaDetailData } from '@/components/visa/VisaDetailModal';
import { CountryFlag } from '@/components/ui/CountryFlag';
import {
  Globe, Edit3, Plus, Trash2, Save, RefreshCw, CheckCircle2,
  AlertCircle, X, CheckSquare, Clock, DollarSign, FileText, Sparkles
} from 'lucide-react';

interface VisaManagerProps {
  initialVisas: VisaDetailData[];
}

export function VisaManager({ initialVisas }: VisaManagerProps) {
  const [visas, setVisas] = useState<VisaDetailData[]>(initialVisas);
  const [editingVisa, setEditingVisa] = useState<VisaDetailData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const persistVisas = async (updatedList: VisaDetailData[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/visa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visas: updatedList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setVisas(updatedList);
      showToast(data.message || 'Visa requirements and pricing updated successfully! Live on public website.');
      setEditingVisa(null);
      setIsAddingNew(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVisa) return;

    if (!editingVisa.country.trim()) {
      showToast('Country name is required', 'error');
      return;
    }

    let updatedList: VisaDetailData[];
    if (isAddingNew) {
      updatedList = [...visas, editingVisa];
    } else {
      updatedList = visas.map((v) => (v.country === editingVisa.country ? editingVisa : v));
    }

    persistVisas(updatedList);
  };

  const handleDeleteVisa = (countryName: string) => {
    if (!confirm(`Are you sure you want to delete the visa entry for ${countryName}?`)) return;
    const updated = visas.filter((v) => v.country !== countryName);
    persistVisas(updated);
  };

  const startAddNew = () => {
    setIsAddingNew(true);
    setEditingVisa({
      country: '',
      flagCode: 'other',
      price: '8,000 BDT',
      time: '7 Working Days',
      validity: '90 Days',
      photoType: '2 color photos (35 × 45 mm, white background, matte paper)',
      overview: 'Standard tourist & business visa processing checklist.',
      specialNote: '',
      categories: [
        {
          name: '1. Personal Requirements',
          items: ['Current Passport (min 6 months validity)', '2 passport size photos on matte paper', 'National ID card copy'],
        },
        {
          name: '2. Financial Documents',
          items: ['Last 6 months Bank Statement', 'Bank Solvency Certificate'],
        },
        {
          name: '3. Professional Documents',
          items: ['NOC letter or Trade License', 'Visiting card and ID card copy'],
        },
      ],
      terms: ['Embassy processing fees are subject to consular currency exchange fluctuations.'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-bold animate-in slide-in-from-bottom duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40 shadow-emerald-900/50'
              : 'bg-red-950 text-red-200 border-red-500/40 shadow-red-900/50'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark flex items-center gap-2.5">
            <Globe className="h-7 w-7 text-brand-blue-600" />
            Visa Requirements &amp; Pricing Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update visa processing fees, required document lists, and special exemptions displayed live to clients.
          </p>
        </div>
        <button
          onClick={startAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Country</span>
        </button>
      </div>

      {/* Visas Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visas.map((visa) => (
          <div
            key={visa.country}
            className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition relative group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CountryFlag country={visa.flagCode} size="md" className="rounded-md" />
                  <div>
                    <h3 className="font-display font-black text-xl text-brand-dark">{visa.country}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{visa.time}</span>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs rounded-xl">
                  {visa.price}
                </span>
              </div>

              {/* Specs Box */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-gray-100">
                <p className="text-gray-600">
                  <strong className="text-gray-900">Validity:</strong> {visa.validity}
                </p>
                <p className="text-gray-600 line-clamp-1">
                  <strong className="text-gray-900">Photo:</strong> {visa.photoType}
                </p>
              </div>

              {/* Categories & Docs Summary */}
              <div className="space-y-1 text-xs">
                <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                  Document Categories ({visa.categories.length})
                </p>
                <ul className="text-gray-700 space-y-1">
                  {visa.categories.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs">
                      <CheckSquare className="h-3.5 w-3.5 text-brand-blue-600 shrink-0" />
                      <span className="font-medium text-gray-800">{c.name}</span>
                      <span className="text-gray-400 text-[11px]">({c.items.length} items)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {visa.specialNote && (
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-brand-blue-700 line-clamp-2">
                  <strong>Note:</strong> {visa.specialNote}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingVisa(JSON.parse(JSON.stringify(visa)));
                }}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                <span>Edit Requirements &amp; Price</span>
              </button>

              <button
                onClick={() => handleDeleteVisa(visa.country)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition cursor-pointer"
                title="Delete Country"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingVisa && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 relative flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  {isAddingNew ? 'Create New Visa Entry' : 'Update Visa Entry'}
                </span>
                <h2 className="font-display font-black text-2xl text-white">
                  {editingVisa.country ? `${editingVisa.country} Visa Guidelines` : 'New Country'}
                </h2>
              </div>
              <button
                onClick={() => setEditingVisa(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Country Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVisa.country}
                    onChange={(e) => setEditingVisa({ ...editingVisa, country: e.target.value })}
                    placeholder="e.g. Singapore, Turkey, Dubai"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Flag Code (lowercase)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVisa.flagCode}
                    onChange={(e) => setEditingVisa({ ...editingVisa, flagCode: e.target.value.toLowerCase() })}
                    placeholder="e.g. singapore, thailand, malaysia, china, canada, australia"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Processing Fee / Price
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVisa.price}
                    onChange={(e) => setEditingVisa({ ...editingVisa, price: e.target.value })}
                    placeholder="e.g. 7,000 BDT or Dynamic"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold focus:outline-none focus:border-brand-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Processing Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVisa.time}
                    onChange={(e) => setEditingVisa({ ...editingVisa, time: e.target.value })}
                    placeholder="e.g. 7 Working Days"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Validity Period
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVisa.validity}
                    onChange={(e) => setEditingVisa({ ...editingVisa, validity: e.target.value })}
                    placeholder="e.g. 90 Days (Single Entry)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Photo Specification
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVisa.photoType}
                    onChange={(e) => setEditingVisa({ ...editingVisa, photoType: e.target.value })}
                    placeholder="e.g. 2 color photos on matte paper (white background)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Overview &amp; Purpose
                </label>
                <textarea
                  rows={2}
                  value={editingVisa.overview}
                  onChange={(e) => setEditingVisa({ ...editingVisa, overview: e.target.value })}
                  placeholder="Summary of visa type, target audience, and consulate channels..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Special Notes &amp; Exemptions (e.g. Housewife exemption)
                </label>
                <textarea
                  rows={2}
                  value={editingVisa.specialNote || ''}
                  onChange={(e) => setEditingVisa({ ...editingVisa, specialNote: e.target.value })}
                  placeholder="e.g. Housewives travelling with husband require only 2 photos and husband's passport..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-brand-blue-600 transition text-xs"
                />
              </div>

              {/* Document Categories Editor */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-gray-900">
                    Document Requirement Checklists
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newCats = [
                        ...editingVisa.categories,
                        { name: `${editingVisa.categories.length + 1}. Additional Documents`, items: ['New document requirement'] },
                      ];
                      setEditingVisa({ ...editingVisa, categories: newCats });
                    }}
                    className="text-xs font-bold text-brand-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Category
                  </button>
                </div>

                <div className="space-y-4">
                  {editingVisa.categories.map((cat, catIdx) => (
                    <div key={catIdx} className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const newCats = [...editingVisa.categories];
                            newCats[catIdx].name = e.target.value;
                            setEditingVisa({ ...editingVisa, categories: newCats });
                          }}
                          className="font-bold text-xs text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-300 w-full max-w-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newCats = editingVisa.categories.filter((_, i) => i !== catIdx);
                            setEditingVisa({ ...editingVisa, categories: newCats });
                          }}
                          className="text-red-500 hover:text-red-700 p-1 text-xs cursor-pointer"
                          title="Remove category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {cat.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newCats = [...editingVisa.categories];
                                newCats[catIdx].items[itemIdx] = e.target.value;
                                setEditingVisa({ ...editingVisa, categories: newCats });
                              }}
                              className="text-xs text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-300 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newCats = [...editingVisa.categories];
                                newCats[catIdx].items = newCats[catIdx].items.filter((_, i) => i !== itemIdx);
                                setEditingVisa({ ...editingVisa, categories: newCats });
                              }}
                              className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const newCats = [...editingVisa.categories];
                            newCats[catIdx].items.push('New document requirement item');
                            setEditingVisa({ ...editingVisa, categories: newCats });
                          }}
                          className="text-xs font-semibold text-brand-blue-600 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          Add Document Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVisa(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
