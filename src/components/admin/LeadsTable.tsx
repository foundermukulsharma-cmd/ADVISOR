/**
 * Customer CRM Leads Table with Search, Filter, Sort, Pagination, and Safe CSV Export
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { CustomerLead, LeadStatus, DealStatus } from '../../types';
import { exportLeadsToCsv } from '../../lib/csvExport';
import { api } from '../../services/api';

interface LeadsTableProps {
  leads: CustomerLead[];
  onOpenLead: (leadId: string) => void;
  onRefreshData: () => void;
  onAddNewLead: () => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onOpenLead,
  onRefreshData,
  onAddNewLead
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dealFilter, setDealFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'nextFollowUpDate' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Filter leads
  const filtered = leads.filter(l => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        l.villageCity.toLowerCase().includes(q) ||
        l.insuranceInterest.toLowerCase().includes(q) ||
        (l.internalNotes && l.internalNotes.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (statusFilter !== 'ALL' && l.leadStatus !== statusFilter) return false;
    if (dealFilter !== 'ALL' && l.dealStatus !== dealFilter) return false;
    return true;
  });

  // Sort leads
  filtered.sort((a, b) => {
    if (sortBy === 'nextFollowUpDate') {
      const dateA = a.nextFollowUpDate ? new Date(a.nextFollowUpDate).getTime() : 0;
      const dateB = b.nextFollowUpDate ? new Date(b.nextFollowUpDate).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    // createdAt
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleExport = () => {
    const res = exportLeadsToCsv(filtered, 'Sarla_Hooda_Customer_Leads');
    if (res.success) {
      alert(`Exported ${res.count} records securely to ${res.filename}. Formula injection protected.`);
    }
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.updateLead(leadId, { leadStatus: newStatus });
      onRefreshData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, phone, village/city, interest..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A46D] bg-slate-50/50"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses ({leads.length})</option>
            <option value="New Lead">New Lead</option>
            <option value="Cold Lead">Cold Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Consultation Scheduled">Consultation Scheduled</option>
            <option value="Deal Won">Deal Won</option>
            <option value="Deal Lost">Deal Lost</option>
          </select>

          <select
            value={dealFilter}
            onChange={e => {
              setDealFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
          >
            <option value="ALL">All Deals</option>
            <option value="Open">Deal Open</option>
            <option value="Won">Deal Won</option>
            <option value="Lost">Deal Lost</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Download RFC 4180 CSV export with formula injection protection"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddNewLead}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#10243A] hover:bg-[#1A3755] text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#DFCA9B]" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Village / City</th>
              <th className="py-3 px-4">Insurance Requirement</th>
              <th className="py-3 px-4">Lead Status</th>
              <th className="py-3 px-4">Deal</th>
              <th className="py-3 px-4">Next Follow-up</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  No customer records matched your query.
                </td>
              </tr>
            ) : (
              paginated.map(lead => {
                const isOverdue = lead.nextFollowUpDate && lead.nextFollowUpDate < new Date().toISOString().slice(0, 10) && lead.dealStatus === 'Open';

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onOpenLead(lead.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    {/* Customer Name & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-[#10243A] leading-snug">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                        <span>{lead.phone}</span>
                        {lead.source && (
                          <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600">
                            {lead.source}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {lead.villageCity}
                      {lead.locationSharedVoluntarily && (
                        <span className="ml-1 text-[10px] text-emerald-600">●</span>
                      )}
                    </td>

                    {/* Requirement */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {lead.insuranceInterest}
                      </span>
                      {lead.budgetRange && (
                        <span className="text-[10px] text-slate-400">
                          Budget: {lead.budgetRange}
                        </span>
                      )}
                    </td>

                    {/* Lead Status with dropdown */}
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={lead.leadStatus}
                        onChange={e => handleQuickStatusChange(lead.id, e.target.value as LeadStatus, e as any)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          lead.leadStatus === 'New Lead' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          lead.leadStatus === 'Cold Lead' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                          lead.leadStatus === 'Deal Won' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          lead.leadStatus === 'Deal Lost' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="Cold Lead">Cold Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Follow-up Required">Follow-up Required</option>
                        <option value="Consultation Scheduled">Consultation Scheduled</option>
                        <option value="Deal Won">Deal Won</option>
                        <option value="Deal Lost">Deal Lost</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </td>

                    {/* Deal Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.dealStatus === 'Won' ? 'bg-emerald-100 text-emerald-800' :
                        lead.dealStatus === 'Lost' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {lead.dealStatus}
                      </span>
                    </td>

                    {/* Next Follow Up */}
                    <td className="py-3.5 px-4">
                      {lead.nextFollowUpDate ? (
                        <span className={`font-mono text-xs font-semibold ${
                          isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'
                        }`}>
                          {lead.nextFollowUpDate} {isOverdue && '(Overdue)'}
                        </span>
                      ) : (
                        <span className="text-slate-400">None set</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => onOpenLead(lead.id)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-slate-500">
        <div>
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} customer records
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
