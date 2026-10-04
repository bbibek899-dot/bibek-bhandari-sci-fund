import React, { useState, useEffect } from 'react';
import { Smartphone, X, ExternalLink, Sparkles, AlertTriangle, Copy, Check, Share2 } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';

export const MessengerBanner: React.FC = () => {
  const { setIsShareModalOpen, showToast } = useCampaign();
  const [isInsideMessenger, setIsInsideMessenger] = useState(false);
  const [isDevPreview, setIsDevPreview] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const cleanPublicUrl = 'https://ais-pre-v36ev7ejomvg4o2rvkenh6-712254875975.asia-southeast1.run.app';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin || '';
      if (origin.includes('ais-dev-')) {
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
  }, []);

  const handleCopyPublic = () => {
    navigator.clipboard.writeText(cleanPublicUrl);
    setCopied(true);
    showToast('Copied public link for Messenger & WhatsApp!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isDismissed) return null;

  // Banner 1: Dev Preview Helper (Directly solves "how to copy link from chat or preview section")
  if (isDevPreview) {
    return (
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white px-3 sm:px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm z-40 border-b border-amber-500/50">
        <div className="flex items-center gap-2 overflow-hidden">
          <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />
          <span className="leading-snug">
            <strong>Sharing to Messenger or WhatsApp?</strong> Don't copy your browser top address bar (it is private and won't open for friends). Click here for the Public Link with your photo &amp; cover!
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyPublic}
            className="px-2.5 py-1 bg-white text-amber-950 font-bold text-xs rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-xs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-amber-900" />}
            <span>{copied ? 'Copied Public Link!' : 'Copy Public Link'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 py-1 bg-amber-900 hover:bg-amber-950 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            <span>1-Tap Share</span>
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
