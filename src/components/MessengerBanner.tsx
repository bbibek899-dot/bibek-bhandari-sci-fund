import React, { useState, useEffect } from 'react';
import { Smartphone, X, ExternalLink, Sparkles, AlertTriangle, Copy, Check, Share2, Globe } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { getShareableCampaignUrl, getDomainDisplay } from '../utils/urlUtils';

export const MessengerBanner: React.FC = () => {
  const { campaign, setIsShareModalOpen, showToast } = useCampaign();
  const [isInsideMessenger, setIsInsideMessenger] = useState(false);
  const [isDevPreview, setIsDevPreview] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const realShareUrl = getShareableCampaignUrl(campaign.livePublicUrl);
  const domainDisplay = getDomainDisplay(realShareUrl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin || '';
      const host = window.location.hostname || '';
      
      // Auto-redirect if visitor accessed via ais-pre- or external run.app
      if (host.includes('ais-pre-') || (host.includes('run.app') && !host.includes('ais-dev-'))) {
        try {
          window.location.replace(realShareUrl + window.location.search + window.location.hash);
        } catch (e) {
          console.error(e);
        }
      }

      if (origin.includes('ais-dev-') || origin.includes('run.app')) {
        setIsDevPreview(true);
      }
    }

    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      const insideFb = /FBAN|FBAV|Messenger|FB_IAB/i.test(ua);
      if (insideFb) {
        setIsInsideMessenger(true);
      }
    }
  }, [realShareUrl]);

  const handleCopyPublic = () => {
    navigator.clipboard.writeText(realShareUrl);
    setCopied(true);
    showToast('Copied real official link: ' + realShareUrl + ' (No run.app / No cookie error!)');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToRealSite = () => {
    window.location.href = realShareUrl;
  };

  if (isDismissed) return null;

  // Banner 1: Real Share Link Helper
  if (isDevPreview) {
    return (
      <div className="bg-gradient-to-r from-red-800 via-amber-800 to-slate-900 text-white px-3 sm:px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md z-40 border-b border-amber-500/50">
        <div className="flex items-center gap-2 overflow-hidden">
          <Globe className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
          <span className="leading-snug">
            <strong className="text-amber-200">REAL OFFICIAL WEBSITE FOR DONORS:</strong> <code className="bg-black/40 px-1.5 py-0.5 rounded text-[11px] font-mono text-white font-bold">{domainDisplay}</code>
            <span className="hidden sm:inline text-amber-100 ml-1.5">(Opens smoothly on iOS &amp; Android without "run.app" cookie block)</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleGoToRealSite}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-xs active:scale-95"
          >
            <span>Open Real Website</span>
            <ExternalLink className="w-3 h-3 text-slate-950" />
          </button>
          <button
            type="button"
            onClick={handleCopyPublic}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-white" />}
            <span>{copied ? 'Copied Real Link!' : 'Copy Real Link'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            <span>Share Guide</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-6 h-6 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-1"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Banner 2: For users who opened inside Facebook / Messenger In-App Browser
  if (isInsideMessenger) {
    return (
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white px-3.5 py-2 text-xs flex items-center justify-between shadow-xs z-40 border-b border-blue-600/50">
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <Smartphone className="w-4 h-4 text-blue-200 shrink-0" />
          <span className="truncate">
            <strong>Opened in Messenger:</strong> For best experience &amp; full-screen MRI scan zoom, tap <strong>•••</strong> (top right) &gt; <strong>Open in Chrome / Safari</strong>.
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="w-6 h-6 rounded-full hover:bg-white/20 text-blue-200 flex items-center justify-center shrink-0 transition-colors"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
};
