import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { PhotoUploadModal } from './PhotoUploadModal';
import { Share2, Smartphone, Monitor, Check, ExternalLink, Sparkles, ShieldCheck, Camera } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    previewDevice,
    setPreviewDevice,
    campaign,
    showToast,
    setIsDonateModalOpen,
    setIsLegalGuideOpen,
    setIsShareModalOpen
  } = useCampaign();

  const [copiedLink, setCopiedLink] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('public')}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              CF
            </span>
            <span>CreatorFund</span>
          </button>
        </div>

        {/* Zone 2: Navigation tabs (Hidden on mobile for clean public view, visible on desktop) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setCurrentView('public')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              currentView === 'public'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Campaign Page
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              currentView === 'dashboard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Creator Ledger
          </button>
          <button
            onClick={() => setCurrentView('social_studio')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              currentView === 'social_studio'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Social Growth Playbook
          </button>
          <button
            onClick={() => setCurrentView('qr_story_generator')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              currentView === 'qr_story_generator'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            QR &amp; Story Studio
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {currentView === 'public' && (
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setPreviewDevice('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                title="Mobile Bio-Link View"
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsPhotoUploadOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
            title="Upload real photos & official bank/eSewa QR screenshots"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload Photos &amp; QR</span>
          </button>

          <button
            onClick={() => setIsLegalGuideOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            title="Legal, Safety & Medical Compliance Guide"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Legal &amp; Safety</span>
          </button>

          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-all whitespace-nowrap shadow-xs"
            title="Copy clean public link for Messenger, WhatsApp, or iOS/Android"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Link (Messenger/WhatsApp)</span>
            <span className="sm:hidden">Share</span>
          </button>

          <button
            onClick={() => setIsDonateModalOpen(true)}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Donate / QR</span>
          </button>
        </div>
      </div>

      <PhotoUploadModal
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
      />
    </header>
  );
};
