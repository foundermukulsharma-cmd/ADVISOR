/**
 * CSV Export Utility with RFC 4180 Compliance & Formula Injection Protection
 * Protects against CSV Injection / Formula Injection in Excel & Google Sheets.
 */

import { CustomerLead } from '../types';

export interface ExportColumn {
  key: keyof CustomerLead | 'quizSummaryFormatted' | 'consentFormatted';
  label: string;
}

export const DEFAULT_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'name', label: 'Customer Name' },
  { key: 'phone', label: 'Mobile Number' },
  { key: 'email', label: 'Email Address' },
  { key: 'villageCity', label: 'Village / City' },
  { key: 'address', label: 'Address' },
  { key: 'preferredLanguage', label: 'Preferred Language' },
  { key: 'insuranceInterest', label: 'Insurance Requirement' },
  { key: 'budgetRange', label: 'Budget Range' },
  { key: 'planningTerm', label: 'Planning Term' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'dealStatus', label: 'Deal Status' },
  { key: 'source', label: 'Source' },
  { key: 'preferredContactMethod', label: 'Preferred Contact Method' },
  { key: 'lastContactDate', label: 'Last Contact Date' },
  { key: 'nextFollowUpDate', label: 'Next Follow-up Date' },
  { key: 'consentFormatted', label: 'Consent Status' },
  { key: 'createdAt', label: 'Enquiry Date' },
  { key: 'internalNotes', label: 'Internal Notes' },
  { key: 'quizSummaryFormatted', label: 'Quiz Assessment Summary' }
];

/**
 * Sanitizes value against spreadsheet formula injection (Excel, Google Sheets, Calc)
 * Characters: = + - @ \t \r
 */
function sanitizeFormulaInjection(val: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousPrefixes.some(prefix => trimmed.startsWith(prefix))) {
    // Prefix with single quote to force text interpretation in spreadsheets
    return `'${val}`;
  }
  return val;
}

/**
 * Escapes a cell according to RFC 4180 standard
 */
function escapeCsvCell(raw: any): string {
  if (raw === null || raw === undefined) return '""';
  let str = String(raw);

  // Apply formula injection protection
  str = sanitizeFormulaInjection(str);

  // Escape double quotes by doubling them
  const escapedQuotes = str.replace(/"/g, '""');

  // Wrap in quotes if it contains comma, newline, carriage return, or double quote
  return `"${escapedQuotes}"`;
}

export function exportLeadsToCsv(
  leads: CustomerLead[],
  filenamePrefix = 'Sarla_Hooda_CRM_Leads',
  columns: ExportColumn[] = DEFAULT_EXPORT_COLUMNS
): { success: boolean; count: number; filename: string } {
  if (!leads || leads.length === 0) {
    return { success: false, count: 0, filename: '' };
  }

  // Header row
  const headers = columns.map(col => escapeCsvCell(col.label)).join(',');

  // Data rows
  const rows = leads.map(lead => {
    return columns.map(col => {
      if (col.key === 'consentFormatted') {
        return escapeCsvCell(lead.consentStatus ? 'Consent Granted' : 'No Consent');
      }
      if (col.key === 'quizSummaryFormatted') {
        return escapeCsvCell(lead.quizSummary || 'N/A');
      }
      const val = lead[col.key as keyof CustomerLead];
      return escapeCsvCell(val ?? '');
    }).join(',');
  });

  // Prepend UTF-8 BOM (\uFEFF) for proper Unicode display (including Hindi) in Microsoft Excel
  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const dateStr = new Date().toISOString().slice(0, 10);
  const finalFilename = `${filenamePrefix}_${dateStr}.csv`;

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', finalFilename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 500);

  return { success: true, count: leads.length, filename: finalFilename };
}
