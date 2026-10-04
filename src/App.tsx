import React from 'react';
import { CampaignProvider, useCampaign } from './context/CampaignContext';
import { TopNavbar } from './components/TopNavbar';
import { MessengerBanner } from './components/MessengerBanner';
import { PublicCampaignView } from './components/PublicCampaignView';
import { CreatorDashboard } from './components/CreatorDashboard';
import { SocialPlaybookStudio } from './components/SocialPlaybookStudio';
import { StoryQrCardGenerator } from './components/StoryQrCardGenerator';
import { DonateModal } from './components/DonateModal';
import { ThankYouModal } from './components/ThankYouModal';
import { DonationTicketModal } from './components/DonationTicketModal';
import { MessengerShareModal } from './components/MessengerShareModal';
import { LegalSafetyGuideModal } from './components/LegalSafetyGuideModal';
import { CheckCircle2, AlertCircle, Info, Heart, Sparkles, ExternalLink, Share2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    toast,
    isDonateModalOpen,
    setIsDonateModalOpen,
    activeThankYouDonation,
    setActiveThankYouDonation,
    activeTicketDonation,
    setActiveTicketDonation,
    isShareModalOpen,
    setIsShareModalOpen,
    isStoryCardModalOpen,
    setIsStoryCardModalOpen,
    isLegalGuideOpen,
    setIsLegalGuideOpen,
    campaign
  } = useCampaign();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Messenger Mobile In-App Guidance Banner */}
      <MessengerBanner />

      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'public' && <PublicCampaignView />}
        {currentView === 'dashboard' && <CreatorDashboard />}
        {currentView === 'social_studio' && <SocialPlaybookStudio />}
        {currentView === 'qr_story_generator' && <StoryQrCardGenerator />}
      </main>

      {/* Modals */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />

      <ThankYouModal
        donation={activeThankYouDonation}
        onClose={() => setActiveThankYouDonation(null)}
        onOpenTicket={() => {
          if (activeThankYouDonation) {
            setActiveTicketDonation(activeThankYouDonation);
            setActiveThankYouDonation(null);
          }
        }}
      />

      <DonationTicketModal
        donation={activeTicketDonation}
        onClose={() => setActiveTicketDonation(null)}
        onOpenThankYou={() => {
          if (activeTicketDonation) {
            setActiveThankYouDonation(activeTicketDonation);
            setActiveTicketDonation(null);
          }
        }}
      />

      <MessengerShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <LegalSafetyGuideModal
        isOpen={isLegalGuideOpen}
        onClose={() => setIsLegalGuideOpen(false)}
      />

      {/* Floating Share Helper for Messenger & WhatsApp (Desktop only to prevent blocking mobile touch CTA) */}
      <button
        onClick={() => setIsShareModalOpen(true)}
        className="hidden md:flex fixed bottom-5 left-5 z-40 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-xl border border-blue-400/40 items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
        title="Copy Public Link for Messenger & WhatsApp"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Share2 className="w-4 h-4 text-white" />
        <span>Copy Link (Messenger / WhatsApp)</span>
      </button>

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CreatorFund</span>
            <span aria-hidden="true">·</span>
            <span>Small Creator Social Fundraising Toolkit</span>
            <span aria-hidden="true">·</span>
            <span>Zero Platform Fees</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('public')}
              className="hover:text-slate-900 transition-colors"
            >
              Campaign
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Creator Ledger
            </button>
            <button
              onClick={() => setCurrentView('social_studio')}
              className="hover:text-slate-900 transition-colors"
            >
              Social Playbook
            </button>
            <button
              onClick={() => setCurrentView('qr_story_generator')}
              className="hover:text-slate-900 transition-colors"
            >
              Story Cards
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CampaignProvider>
      <AppContent />
    </CampaignProvider>
  );
}
