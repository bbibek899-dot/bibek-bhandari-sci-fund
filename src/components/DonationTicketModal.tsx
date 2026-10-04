import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useCampaign } from '../context/CampaignContext';
import { Donation } from '../types/fundraising';
import { getShareableCampaignUrl } from '../utils/urlUtils';
import {
  X,
  Download,
  Copy,
  Check,
  Share2,
  Heart,
  ShieldCheck,
  Calendar,
  Wallet,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Phone,
  Printer,
  QrCode as QrIcon
} from 'lucide-react';

interface DonationTicketModalProps {
  donation: Donation | null;
  onClose: () => void;
  onOpenThankYou?: () => void;
}

export const DonationTicketModal: React.FC<DonationTicketModalProps> = ({
  donation,
  onClose,
  onOpenThankYou
}) => {
  const { campaign, showToast, setActiveThankYouDonation } = useCampaign();
  const [ticketQrUrl, setTicketQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!donation) return null;

  // Clean shareable campaign URL
  const campaignUrl = getShareableCampaignUrl(campaign.livePublicUrl);

  const ticketNumber = donation.ticketNumber || `NEPAL-SCI-2026-${donation.referenceId.slice(-6).toUpperCase() || '88219A'}`;

  // Generate QR code for ticket verification
  useEffect(() => {
    const verifyPayload = `${campaignUrl}?ticket=${encodeURIComponent(ticketNumber)}&ref=${encodeURIComponent(donation.referenceId)}`;
    QRCode.toDataURL(verifyPayload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setTicketQrUrl(url))
      .catch(err => console.error('Ticket QR error:', err));
  }, [donation, ticketNumber, campaignUrl]);

  const ticketTextSummary = `🎫 OFFICIAL DONATION TICKET & VERIFICATION RECEIPT
Ticket ID: ${ticketNumber}
Donor: ${donation.donorName}
Amount: NPR ${donation.amount.toLocaleString()}
Payment Channel: ${donation.paymentMethod.toUpperCase()} (Ref: ${donation.referenceId})
Date: ${new Date(donation.timestamp).toLocaleDateString()}
Beneficiary: Bibek Bhandari · Spinal Cord Recovery Fund (D1-D5 Open Surgery Rehab)
Operating Surgeon: Neurosurgeon Dr. Prakash Khetan (Guinness World Record Holder)
Supervising Centre: Neurigo360 Advance Neuro Rehab Centre, Greater Noida (Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda)
Facebook Ledger: Logged & 100% Publicly Accountable
Verify & Support: ${campaignUrl}`;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketTextSummary);
    setCopied(true);
    showToast('Copied Donation Ticket & Verification to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTicketText = () => {
    const element = document.createElement('a');
    const file = new Blob([ticketTextSummary], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Donation_Ticket_${ticketNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Downloaded ticket receipt file!');
  };

  const handleOpenThankYouGenerator = () => {
    setActiveThankYouDonation(donation);
    if (onOpenThankYou) {
      onOpenThankYou();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                Official Verification Record
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Donation Ticket of Hope
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable/Saveable Ticket Body */}
        <div className="p-4 sm:p-6 space-y-5 bg-slate-50/50">
          
          <div 
            ref={ticketRef}
            className="relative bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-md p-5 sm:p-6 space-y-4 overflow-hidden"
          >
            {/* Watermark stamp */}
            <div className="absolute -right-10 -bottom-10 pointer-events-none opacity-5 rotate-12">
              <ShieldCheck className="w-56 h-56 text-slate-900" />
            </div>

            {/* Ticket Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Verified Donor Ticket
                </div>
                <div className="text-sm font-mono font-bold text-emerald-800">
                  #{ticketNumber}
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-1">
                  Bibek Bhandari Spinal Recovery Fund
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  100% Direct Gift
                </span>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {new Date(donation.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Ticket Main Details */}
            <div className="grid grid-cols-2 gap-3 py-1 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Honored Donor</div>
                <div className="font-bold text-slate-900 text-sm truncate mt-0.5">
                  {donation.donorName}
                </div>
                {donation.donorSocialHandle && (
                  <div className="text-[11px] text-blue-600 font-mono truncate">
                    {donation.donorSocialHandle}
                  </div>
                )}
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 text-emerald-950">
                <div className="text-[10px] font-semibold text-emerald-700 uppercase">Contribution</div>
                <div className="font-extrabold text-emerald-700 text-base sm:text-lg mt-0.5">
                  NPR {donation.amount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 uppercase font-mono">
                  Via {donation.paymentMethod.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Beneficiary & Transparency Pledge */}
            <div className="space-y-1.5 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Patient Beneficiary:</span>
                <span className="font-bold text-slate-900">Bibek Bhandari (D1-D5 Rehab)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Family Account:</span>
                <span className="font-medium text-slate-800">Sashita Raj Bhandari</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Reference No:</span>
                <span className="font-mono text-slate-800">{donation.referenceId}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Therapy Clinic:</span>
                <span className="font-medium text-slate-800">Neurigo360, Greater Noida (Dr. Pratap Kunwar Singh)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Operating Surgeon:</span>
                <span className="font-medium text-slate-800">Dr. Prakash Khetan (Guinness World Record Holder)</span>
              </div>
            </div>

            {/* QR Code Verification Section */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <QrIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Scan to Verify &amp; Share</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight max-w-[210px]">
                  Anyone who scans this QR code will see this verified record on Bibek's public transparency portal.
                </p>
                <div className="text-[10px] text-blue-700 font-medium">
                  facebook.com/share/1E1EVtPrPh
                </div>
              </div>

              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                {ticketQrUrl ? (
                  <img src={ticketQrUrl} alt="Ticket QR code" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
                )}
              </div>
            </div>

            {/* Perforated edge effect */}
            <div className="text-[10px] text-center text-slate-400 font-mono tracking-wider pt-1 border-t border-dotted border-slate-300">
              ••• OFFICIAL VERIFIED REHABILITATION DONATION RECORD •••
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyTicket}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Receipt!' : 'Copy Ticket Text'}</span>
              </button>

              <button
                onClick={handleDownloadTicketText}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Save Ticket (.txt)</span>
              </button>
            </div>

            {/* Direct Send to Donor / Share to Friends */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Send Thank-You &amp; Ask to Share:</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-normal">Direct to donor</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleOpenThankYouGenerator}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Heartfelt Thank You</span>
                </button>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}&quote=${encodeURIComponent(`I contributed to Bibek Bhandari's spinal rehabilitation fund! Please join me in supporting his recovery at Neurigo360.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on Facebook</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
