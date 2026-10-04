import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, Donation, CampaignUpdate, PaymentMethodType, RehabExerciseVideo } from '../types/fundraising';
import { initialCampaign, sciPatientCampaign, initialDonations, initialUpdates } from '../data/defaultCampaign';
import confetti from 'canvas-confetti';

interface ToastInfo {
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface CampaignContextType {
  campaign: Campaign;
  donations: Donation[];
  updates: CampaignUpdate[];
  currentView: 'public' | 'dashboard' | 'social_studio' | 'qr_story_generator';
  setCurrentView: (view: 'public' | 'dashboard' | 'social_studio' | 'qr_story_generator') => void;
  previewDevice: 'desktop' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'mobile') => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Actions
  updateCampaign: (updates: Partial<Campaign>) => void;
  updatePaymentCredentials: (credentials: Partial<Campaign['payments']>) => void;
  verifyDonation: (donationId: string) => void;
  flagDonation: (donationId: string) => void;
  deleteDonation: (donationId: string) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'timestamp'>) => void;
  addUpdate: (newUpdate: Omit<CampaignUpdate, 'id' | 'likesCount' | 'commentsCount'>) => void;
  likeUpdate: (updateId: string) => void;
  
  // Modals & Triggers
  activeThankYouDonation: Donation | null;
  setActiveThankYouDonation: (donation: Donation | null) => void;
  activeTicketDonation: Donation | null;
  setActiveTicketDonation: (donation: Donation | null) => void;
  isDonateModalOpen: boolean;
  setIsDonateModalOpen: (isOpen: boolean) => void;
  isStoryCardModalOpen: boolean;
  setIsStoryCardModalOpen: (isOpen: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (isOpen: boolean) => void;
  isLegalGuideOpen: boolean;
  setIsLegalGuideOpen: (isOpen: boolean) => void;
  selectedStoryDonation: Donation | null;
  setSelectedStoryDonation: (donation: Donation | null) => void;
  markDonationThanked: (donationId: string) => void;
  
  // Exercise and Preset Actions
  addExerciseVideo: (exercise: import('../types/fundraising').RehabExerciseVideo) => void;
  deleteExerciseVideo: (id: string) => void;
  resetToSciCampaign: () => void;
  
  // Live Sync & Publishing
  publishCampaignLive: () => Promise<void>;
  isLiveSynced: boolean;

  // Helpers
  totalVerifiedRaised: number;
  totalPendingRaised: number;
  progressPercent: number;
  verifiedSupportersCount: number;
  triggerCelebration: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CAMPAIGN = 'creatorfund_campaign_v5';
const LOCAL_STORAGE_KEY_DONATIONS = 'creatorfund_donations_v5';
const LOCAL_STORAGE_KEY_UPDATES = 'creatorfund_updates_v5';

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaign, setCampaign] = useState<Campaign>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CAMPAIGN);
      if (!saved) return initialCampaign;
      const parsed: Campaign = JSON.parse(saved);
      // Ensure official QR images and photos are always present
      if (!parsed.payments?.esewaQrImage || parsed.payments.esewaQrImage.trim() === '') {
        parsed.payments = { ...(parsed.payments || {}), esewaQrImage: initialCampaign.payments.esewaQrImage };
      }
      if (!parsed.payments?.bankQrImage || parsed.payments.bankQrImage.trim() === '') {
        parsed.payments = { ...(parsed.payments || {}), bankQrImage: initialCampaign.payments.bankQrImage };
      }
      if (!parsed.creatorAvatar || parsed.creatorAvatar.includes('/src/assets/')) {
        parsed.creatorAvatar = initialCampaign.creatorAvatar;
      }
      if (!parsed.heroBanner || parsed.heroBanner.includes('/src/assets/')) {
        parsed.heroBanner = initialCampaign.heroBanner;
      }
      return parsed;
    } catch {
      return initialCampaign;
    }
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DONATIONS);
      return saved ? JSON.parse(saved) : initialDonations;
    } catch {
      return initialDonations;
    }
  });

  const [updates, setUpdates] = useState<CampaignUpdate[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_UPDATES);
      return saved ? JSON.parse(saved) : initialUpdates;
    } catch {
      return initialUpdates;
    }
  });

  const [currentView, setCurrentView] = useState<'public' | 'dashboard' | 'social_studio' | 'qr_story_generator'>('public');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [activeThankYouDonation, setActiveThankYouDonation] = useState<Donation | null>(null);
  const [activeTicketDonation, setActiveTicketDonation] = useState<Donation | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isStoryCardModalOpen, setIsStoryCardModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLegalGuideOpen, setIsLegalGuideOpen] = useState(false);
  const [selectedStoryDonation, setSelectedStoryDonation] = useState<Donation | null>(null);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(true);

  // Load published campaign and donations from server on mount
  useEffect(() => {
    fetch('/api/campaign')
      .then(res => (res.ok ? res.json() : null))
      .then(serverCampaign => {
        const isDev = typeof window !== 'undefined' && window.location.origin.includes('ais-dev-');
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CAMPAIGN);

        if (serverCampaign && serverCampaign.title) {
          if (!isDev || !saved) {
            setCampaign(serverCampaign);
          } else {
            try {
              const parsed = JSON.parse(saved);
              setCampaign(parsed);
              fetch('/api/campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: saved
              }).catch(err => console.log('Auto-publish sync error:', err));
            } catch {
              setCampaign(serverCampaign);
            }
          }
        } else if (saved && isDev) {
          // Push local saved to server if server was fresh
          fetch('/api/campaign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: saved
          }).catch(err => console.log('Init push error:', err));
        }
      })
      .catch(err => console.log('Could not load server campaign:', err));

    fetch('/api/donations')
      .then(res => (res.ok ? res.json() : null))
      .then(serverDonations => {
        if (Array.isArray(serverDonations) && serverDonations.length > 0) {
          setDonations(serverDonations);
        }
      })
      .catch(err => console.log('Could not load server donations:', err));
  }, []);

  // Safe sync to local storage (handles iOS Safari quota exceptions)
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CAMPAIGN, JSON.stringify(campaign));
    } catch (e) {
      console.warn('LocalStorage quota or permission error:', e);
    }
  }, [campaign]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DONATIONS, JSON.stringify(donations));
    } catch (e) {
      console.warn('LocalStorage quota error:', e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_UPDATES, JSON.stringify(updates));
    } catch (e) {
      console.warn('LocalStorage quota error:', e);
    }
  }, [updates]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#3b82f6', '#f59e0b', '#ec4899']
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  const addExerciseVideo = (exercise: import('../types/fundraising').RehabExerciseVideo) => {
    setCampaign(prev => ({
      ...prev,
      exerciseVideos: [exercise, ...(prev.exerciseVideos || [])]
    }));
    showToast(`Added exercise video: "${exercise.title}"!`);
  };

  const deleteExerciseVideo = (id: string) => {
    setCampaign(prev => ({
      ...prev,
      exerciseVideos: (prev.exerciseVideos || []).filter(ex => ex.id !== id)
    }));
    showToast('Exercise video entry removed.', 'info');
  };

  const resetToSciCampaign = () => {
    setCampaign(sciPatientCampaign);
    showToast('Switched to Bibek SCI Patient Recovery Campaign!');
  };

  // Verified amount calculations
  const totalVerifiedRaised = donations
    .filter(d => d.status === 'verified')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPendingRaised = donations
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + d.amount, 0);

  const verifiedSupportersCount = donations.filter(d => d.status === 'verified').length;

  const progressPercent = Math.min(100, Math.round((totalVerifiedRaised / campaign.targetAmount) * 100));

  const publishCampaignLive = async () => {
    setIsLiveSynced(false);
    try {
      const resp = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      });
      const donResp = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donations)
      });
      if (resp.ok && donResp.ok) {
        setIsLiveSynced(true);
      }
    } catch {
      // Running on static GitHub Pages
    }
    triggerCelebration();
    showToast('All photos, cover banner, and official QR codes are saved & active!');
  };

  const updateCampaign = (newDetails: Partial<Campaign>) => {
    setCampaign(prev => {
      const updated = { ...prev, ...newDetails };
      fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(e => console.log('Sync error:', e));
      return updated;
    });
    showToast('Campaign details updated and published!');
  };

  const updatePaymentCredentials = (credentials: Partial<Campaign['payments']>) => {
    setCampaign(prev => {
      const updated = {
        ...prev,
        payments: { ...prev.payments, ...credentials }
      };
      fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(e => console.log('Sync error:', e));
      return updated;
    });
    showToast('Payment credentials updated and published!');
  };

  const verifyDonation = (donationId: string) => {
    const target = donations.find(d => d.id === donationId);
    const generatedTicket = target?.ticketNumber || `NEPAL-SCI-2026-${(target?.referenceId || Math.random().toString(36).substring(2, 8)).slice(-6).toUpperCase()}`;

    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              status: 'verified' as const,
              ticketNumber: d.ticketNumber || generatedTicket
            }
          : d
      )
    );
    triggerCelebration();
    showToast(`Verified donation of NPR ${target?.amount.toLocaleString()} from ${target?.donorName || 'donor'}! Ticket ${generatedTicket} generated.`);
    
    // Prompt creator to send the automatic thank-you message and dispatch ticket
    if (target) {
      const updatedTarget: Donation = {
        ...target,
        status: 'verified',
        ticketNumber: target.ticketNumber || generatedTicket
      };
      setActiveThankYouDonation(updatedTarget);
    }
  };

  const flagDonation = (donationId: string) => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: 'flagged' as const } : d))
    );
    showToast('Donation flagged for review.', 'info');
  };

  const deleteDonation = (donationId: string) => {
    setDonations(prev => prev.filter(d => d.id !== donationId));
    showToast('Donation entry removed.', 'info');
  };

  const addDonation = (newDonationData: Omit<Donation, 'id' | 'timestamp'>) => {
    const newDonation: Donation = {
      ...newDonationData,
      id: `don_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setDonations(prev => [newDonation, ...prev]);
    triggerCelebration();

    if (newDonation.status === 'verified') {
      showToast(`Logged contribution of NPR ${newDonation.amount.toLocaleString()}!`);
      setActiveThankYouDonation(newDonation);
    } else {
      showToast('Thank you! Your payment proof was submitted. The creator will verify shortly.');
    }
  };

  const addUpdate = (newUpdateData: Omit<CampaignUpdate, 'id' | 'likesCount' | 'commentsCount'>) => {
    const newUpd: CampaignUpdate = {
      ...newUpdateData,
      id: `upd_${Date.now()}`,
      likesCount: 1,
      commentsCount: 0
    };
    setUpdates(prev => [newUpd, ...prev]);
    showToast('New campaign milestone update published!');
  };

  const likeUpdate = (updateId: string) => {
    setUpdates(prev =>
      prev.map(u => (u.id === updateId ? { ...u, likesCount: u.likesCount + 1 } : u))
    );
    showToast('Heart sent to creator! ❤️');
  };

  const markDonationThanked = (donationId: string) => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, thankYouSent: true } : d))
    );
    showToast('Marked as thanked & shared request sent! 🙏');
  };

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        donations,
        updates,
        currentView,
        setCurrentView,
        previewDevice,
        setPreviewDevice,
        toast,
        showToast,
        updateCampaign,
        updatePaymentCredentials,
        verifyDonation,
        flagDonation,
        deleteDonation,
        addDonation,
        addUpdate,
        likeUpdate,
        activeThankYouDonation,
        setActiveThankYouDonation,
        activeTicketDonation,
        setActiveTicketDonation,
        isDonateModalOpen,
        setIsDonateModalOpen,
        isStoryCardModalOpen,
        setIsStoryCardModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        isLegalGuideOpen,
        setIsLegalGuideOpen,
        selectedStoryDonation,
        setSelectedStoryDonation,
        markDonationThanked,
        addExerciseVideo,
        deleteExerciseVideo,
        resetToSciCampaign,
        totalVerifiedRaised,
        totalPendingRaised,
        progressPercent,
        verifiedSupportersCount,
        triggerCelebration,
        publishCampaignLive,
        isLiveSynced
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
