/**
 * Scannable QR Code and NFC Digital Card Modal
 * Uses genuine QR Code generation to encode the live website URL.
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Share2, Download, Smartphone } from 'lucide-react';
import { WebsiteContent } from '../types';
import { downloadVCard } from '../lib/vcard';
import { api } from '../services/api';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: WebsiteContent;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, content }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#10243A',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('Failed to generate QR Code:', err));
    }
  }, [isOpen, currentUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    api.trackEvent('share_click', { url: currentUrl });
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${content.advisor.name} - ${content.advisor.profession}`,
          text: `Consult with ${content.advisor.name}, MDRT Qualified LIC Insurance Advisor serving 700+ families.`,
          url: currentUrl
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadVcf = () => {
    downloadVCard({
      name: content.advisor.name,
      phone: content.advisor.phone,
      title: content.advisor.profession,
      organization: 'Life Insurance Corporation of India (LIC)',
      url: currentUrl
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/15 text-[#9F7E47] mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Scan or Tap with NFC</span>
        </div>

        <h3 className="text-xl font-bold text-[#10243A] mb-1">
          {content.advisor.name}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          {content.advisor.profession} • {content.advisor.achievement}
        </p>

        {/* QR Code Canvas */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center mb-4">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${content.advisor.name} Consulting Profile`}
              className="w-56 h-56 rounded-xl shadow-inner"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-sm">
              Generating Scannable QR...
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Scan with any mobile camera to open Sarla Hooda’s digital consulting portal and save her contact directly.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#10243A] hover:bg-[#1A3755] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Profile</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
          </button>
        </div>

        <button
          onClick={handleDownloadVcf}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 text-[#9F7E47] text-xs font-bold rounded-xl border border-[#C5A46D]/30 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save Contact File (.vcf)</span>
        </button>
      </div>
    </div>
  );
};
