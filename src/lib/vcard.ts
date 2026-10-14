/**
 * vCard 3.0 Generation and Contact Saving Utility
 * Generates standards-compliant .vcf file for Sarla Hooda (LIC Insurance Advisor).
 */

export interface VCardOptions {
  name: string;
  phone: string;
  title: string;
  organization: string;
  url: string;
  note?: string;
  email?: string;
}

export function generateVCardString(options: VCardOptions): string {
  // Format vCard according to vCard 3.0 specification RFC 2426
  // Clean phone number
  const cleanPhone = options.phone.replace(/[^\d+]/g, '');

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Hooda;Sarla;;;',
    `FN:${options.name}`,
    `ORG:${options.organization};Insurance Advisory`,
    `TITLE:${options.title} (MDRT Qualified)`,
    `TEL;TYPE=CELL,VOICE,PREF:${cleanPhone}`,
    `X-WA-BIZ-NAME:${options.name}`,
    options.email ? `EMAIL;TYPE=INTERNET,WORK:${options.email}` : '',
    `URL:${options.url}`,
    `NOTE:${options.note || 'MDRT Qualified LIC Insurance Advisor serving 700+ families. Life protection, child education, and retirement planning.'}`,
    'CATEGORIES:Insurance,Financial Advisor,LIC',
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(Boolean);

  return vcardLines.join('\r\n');
}

export function downloadVCard(options: VCardOptions): boolean {
  try {
    const vcardContent = generateVCardString(options);
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const filename = `${options.name.replace(/\s+/g, '_')}_LIC_Advisor.vcf`;

    // Modern browsers
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 500);

    return true;
  } catch (error) {
    console.error('Failed to trigger vCard download:', error);
    return false;
  }
}
