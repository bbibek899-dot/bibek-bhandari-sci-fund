import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useCampaign } from '../context/CampaignContext';
import { resolveImageUrl } from '../utils/imageUtils';
import {
  Download,
  Copy,
  Check,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Eye,
  CheckCircle2,
  QrCode
} from 'lucide-react';

interface RealScannableQrProps {
  method: 'esewa' | 'bank' | 'fonepay' | 'campaign';
  size?: number;
  showDetails?: boolean;
  className?: string;
  defaultZoom?: number;
}

export const RealScannableQr: React.FC<RealScannableQrProps> = ({
  method,
  size = 280,
  showDetails = true,
  className = '',
  defaultZoom = 1.0 // Unzoomed 1.0x as requested: prevents scanning issues
}) => {
  const { campaign, showToast } = useCampaign();
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qrFallbackDataUrl, setQrFallbackDataUrl] = useState<string>('');

  // Primary direct official links provided by the user
  const remoteOfficialLink =
    method === 'esewa'
      ? 'https://i.postimg.cc/sxz98kjQ/FB-IMG-1745995717385.jpg'
      : 'https://i.postimg.cc/SNTC72z3/Messenger-creation-E6A982EE-6F9F-4171-8C58-D841D0C94FCF.jpg';

  const localOfficialImage =
    method === 'esewa'
      ? resolveImageUrl(campaign.payments.esewaQrImage || './images/esewa_real_official_qr.jpg')
      : resolveImageUrl(campaign.payments.bankQrImage || './images/sbi_bank_nepal_real_qr.jpg');

  const [currentImageSrc, setCurrentImageSrc] = useState<string>(localOfficialImage || remoteOfficialLink);

  // Sync if campaign or method changes
  useEffect(() => {
    setCurrentImageSrc(localOfficialImage || remoteOfficialLink);
  }, [method, localOfficialImage, remoteOfficialLink]);

  // Generate vector fallback just in case
  useEffect(() => {
    const payload =
      method === 'esewa'
        ? campaign.payments.esewaId || '9861452923'
        : `NEPAL SBI BANK LTD\nAccount: ${campaign.payments.accountNumber || '20015243402269'}\nName: ${campaign.payments.accountName || 'SASHITA RAJ BHANDARI'}\nBranch: ${campaign.payments.branch || 'Hetauda Branch, Nepal'}`;

    QRCode.toDataURL(payload, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrFallbackDataUrl(url))
      .catch((err) => console.error(err));
  }, [method, campaign.payments]);

  const handleCopyDetails = () => {
    const textToCopy =
      method === 'esewa'
        ? campaign.payments.esewaId
        : `${campaign.payments.bankName}\nA/C: ${campaign.payments.accountNumber}\nName: ${campaign.payments.accountName}\nBranch: ${campaign.payments.branch}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Copied details to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = currentImageSrc;
    link.target = '_blank';
    link.download = `${method === 'esewa' ? 'Bibek_eSewa_Official_QR' : 'Bibek_Nepal_SBI_Bank_QR'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded official QR code!');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col items-center ${className}`}>
      
      {/* Official Header Badge */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
            method === 'esewa' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {method === 'esewa' ? 'eS' : 'SBI'}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>{method === 'esewa' ? 'Official eSewa QR Code' : 'Official Nepal SBI Bank QR Code'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500">Unzoomed 100% natural scan size (Scans instantly)</p>
          </div>
        </div>

        <a
          href={remoteOfficialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-emerald-200"
          title="Open original official photo link directly"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Original Link</span>
        </a>
      </div>

      {/* Clean, Unzoomed QR Display (Natural 1.0x with full scannable quiet zone) */}
      <div className="relative group my-1 p-3 bg-white rounded-2xl border-2 border-slate-200/80 shadow-sm flex flex-col items-center justify-center">
        <div
          className="relative cursor-pointer w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center bg-white rounded-xl overflow-hidden p-1"
          onClick={() => setIsFullscreen(true)}
          title="Click to view full-screen high-brightness scanner mode"
        >
          <img
            src={currentImageSrc}
            alt={method === 'esewa' ? 'Official eSewa QR Code' : 'Official Nepal SBI Bank QR Code'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
            style={{ imageRendering: 'crisp-edges' }}
            onError={(e) => {
              // Graceful fallbacks: local -> remote postimg -> generated vector
              if (currentImageSrc !== remoteOfficialLink) {
                setCurrentImageSrc(remoteOfficialLink);
              } else if (qrFallbackDataUrl) {
                setCurrentImageSrc(qrFallbackDataUrl);
              }
            }}
          />

          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
            <Maximize2 className="w-4 h-4 mr-1.5" />
            <span>Tap for Fullscreen Brightness</span>
          </div>
        </div>

        {/* Scan Status confirmation */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Uncropped — Scans directly via {method === 'esewa' ? 'eSewa' : 'Nepal SBI / Fonepay'} app</span>
        </div>
      </div>

      {/* Verified Account Details & Direct Actions */}
      {showDetails && (
        <div className="w-full mt-3 space-y-2.5 text-center">
          {method === 'esewa' ? (
            <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3 text-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">eSewa Mobile ID / Number</div>
              <div className="text-lg font-mono font-black text-slate-900 tracking-wider">{campaign.payments.esewaId}</div>
              <div className="text-slate-700 font-semibold">{campaign.payments.esewaName}</div>
            </div>
          ) : (
            <div className="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3 text-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">{campaign.payments.bankName}</div>
              <div className="text-base font-mono font-black text-slate-900 tracking-wider">{campaign.payments.accountNumber}</div>
              <div className="text-slate-800 font-semibold">Account Name: {campaign.payments.accountName}</div>
              <div className="text-slate-600 text-[11px]">{campaign.payments.branch} · SWIFT: {campaign.payments.swiftOrRouting}</div>
            </div>
          )}

          {/* Action Buttons: 1-click Copy & Download */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyDetails}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors border border-slate-200/80 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Details' : 'Copy Number'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official QR</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 pt-1 leading-snug">
            Open your banking app and scan this QR code or send directly to the account above.
          </div>
        </div>
      )}

      {/* Fullscreen High-Contrast Scan Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-5 text-center space-y-4 border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-left">
                <h3 className="text-sm font-bold text-white">
                  {method === 'esewa' ? 'eSewa Official QR Scanner' : 'Nepal SBI Bank QR Scanner'}
                </h3>
                <p className="text-[11px] text-slate-400">Point mobile camera or scanner app directly</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Crisp unzoomed QR on pure white plate */}
            <div className="w-full aspect-square bg-white rounded-2xl p-3 flex items-center justify-center overflow-hidden border-2 border-slate-300 shadow-inner">
              <img
                src={currentImageSrc}
                alt="Scanner View QR"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-xs text-slate-300 font-mono">
              {method === 'esewa'
                ? `eSewa ID: ${campaign.payments.esewaId}`
                : `SBI A/C: ${campaign.payments.accountNumber} (${campaign.payments.accountName})`}
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              Done Scanning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
