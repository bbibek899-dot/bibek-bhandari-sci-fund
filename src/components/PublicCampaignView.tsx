import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { PaymentMethodType } from '../types/fundraising';
import { resolveImageUrl } from '../utils/imageUtils';
import { PhotoUploadModal } from './PhotoUploadModal';
import { FacebookTransparencyHub } from './FacebookTransparencyHub';
import { MedicalPortfolioView } from './MedicalPortfolioView';
import {
  Heart,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  MapPin,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  QrCode,
  Building,
  Smartphone,
  Sparkles,
  Info,
  Video,
  FileText,
  Activity,
  AlertTriangle,
  Target,
  CheckCircle2,
  Stethoscope,
  Award,
  Camera,
  Upload,
  Ticket
} from 'lucide-react';

export const PublicCampaignView: React.FC = () => {
  const {
    campaign,
    donations,
    updates,
    totalVerifiedRaised,
    progressPercent,
    verifiedSupportersCount,
    previewDevice,
    setIsDonateModalOpen,
    setIsLegalGuideOpen,
    setIsShareModalOpen,
    setActiveTicketDonation,
    setActiveThankYouDonation,
    setCurrentView,
    likeUpdate,
    showToast
  } = useCampaign();

  const [activeTab, setActiveTab] = useState<'story' | 'medical' | 'facebook_transparency' | 'exercises' | 'therapist' | 'updates' | 'wall'>('story');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [photoUploadFocus, setPhotoUploadFocus] = useState<'avatar' | 'banner' | 'esewa_qr' | 'bank_qr'>('avatar');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleShareCampaign = () => {
    setIsShareModalOpen(true);
  };

  const verifiedDonations = donations.filter(d => d.status === 'verified');

  // Outer container responsive wrapper for previewDevice
  return (
    <div className={`mx-auto transition-all ${
      previewDevice === 'mobile'
        ? 'max-w-[430px] my-6 rounded-[40px] shadow-2xl border-[8px] border-slate-900 bg-white overflow-hidden'
        : 'max-w-5xl px-4 sm:px-6 py-6 sm:py-10'
    }`}>
      
      {/* Mobile top simulated camera notch if in mobile preview */}
      {previewDevice === 'mobile' && (
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-6 flex items-center justify-between font-mono">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full" />
          <span>5G · 100%</span>
        </div>
      )}

      {/* Hero Visual Banner */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-sm group">
        <img
          src={resolveImageUrl(campaign.heroBanner || './images/bibek_cover_photo_real.webp')}
          alt={campaign.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            const fallbackRemote = 'https://i.postimg.cc/HxzVYR0H/fbafd65cd7b5e3bb597bfa2e50abb7e6.webp';
            if (target.src !== fallbackRemote) {
              target.src = fallbackRemote;
            }
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified SCI Patient Recovery Fund</span>
            <span aria-hidden="true">·</span>
            <span>{campaign.category}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {campaign.title}
          </h1>
          {campaign.tagline && (
            <p className="text-xs sm:text-sm text-slate-200 mt-2 font-normal line-clamp-2 leading-relaxed">
              {campaign.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Creator Bar & Meta */}
      <div className="py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="relative cursor-pointer group"
            onClick={() => {
              setPhotoUploadFocus('avatar');
              setIsPhotoUploadOpen(true);
            }}
            title="Bibek Bhandari Profile"
          >
            <img
              src={resolveImageUrl(campaign.creatorAvatar || './images/bibek_profile_real.jpg')}
              alt={campaign.creatorName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                const fallbackRemote = 'https://i.postimg.cc/mZ6gmQ8d/IMG-7096.jpg';
                if (target.src !== fallbackRemote) {
                  target.src = fallbackRemote;
                }
              }}
            />
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white border-2 border-white shadow-xs">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-slate-900">{campaign.creatorName}</span>
              <span className="text-[11px] text-slate-500 font-mono">{campaign.creatorHandle}</span>
              <span className="inline-flex items-center text-emerald-600 ml-1" title="Verified SCI Patient Campaign">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            {/* Real patient location & clinical metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-medium text-slate-700">{campaign.location}</span>
              <span aria-hidden="true">·</span>
              <span>Neurigo360 Rehabilitation (Dr. Pratap)</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">100% Direct to Family Account</span>
            </div>

            {/* Direct Verified Social Media Links */}
            <div className="flex items-center gap-2.5 mt-2">
              {campaign.socialLinks.tiktok && (
                <a
                  href={campaign.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-black" />
                  <span>TikTok: @sasibibek</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {campaign.socialLinks.instagram && (
                <a
                  href={campaign.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-semibold transition-colors"
                >
                  <span>Instagram: @a1r4y3an</span>
                  <ExternalLink className="w-3 h-3 text-pink-400" />
                </a>
              )}
              {campaign.socialLinks.facebook && (
                <a
                  href={campaign.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors"
                >
                  <span>Facebook Profile</span>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareCampaign}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => setIsDonateModalOpen(true)}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Support via eSewa / Bank</span>
          </button>
        </div>
      </div>

      {/* Progress Thermometer & Key Metrics */}
      <div className="my-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              NPR {totalVerifiedRaised.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              raised of <span className="font-semibold text-slate-700">NPR {campaign.targetAmount.toLocaleString()}</span> target
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
              {progressPercent}%
            </span>
            <div className="text-xs text-slate-500 mt-0.5">
              funded by community
            </div>
          </div>
        </div>

        {/* Thermometer Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3 Quick Stats - Zero Pill */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-center">
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              {verifiedSupportersCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Verified Donors</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              {campaign.daysRemaining}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Days Remaining</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              0%
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Platform Fee (100% Direct)</div>
          </div>
        </div>
      </div>

      {/* Facebook Transparency Commitment Banner */}
      <div className="my-5 p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl border border-blue-800/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/40">
                100% Facebook Public Transparency
              </span>
              <span className="text-xs text-blue-300 font-medium hidden sm:inline">
                Verified Medical Accountability
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Every Single Penny &amp; Donor Name Will Be Shared Publicly on Facebook
            </h4>
            <p className="text-xs text-blue-200/90 leading-snug">
              Bibek Bhandari personally verifies every transaction and publishes donor names, hospital receipts, and gratitude posts directly on his verified personal Facebook timeline.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('facebook_transparency')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Open Transparency Ledger</span>
          </button>
          <a
            href="https://www.facebook.com/share/1E1EVtPrPh/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
          >
            <span>Visit Facebook Profile</span>
            <ExternalLink className="w-3 h-3 text-blue-300" />
          </a>
        </div>
      </div>

      {/* Quick Direct Payment Bar (eSewa / SBI Bank 1-tap copy & QR preview) */}
      <div className="my-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fast Contribution &amp; Direct QR Options</span>
          </div>
          <span className="text-xs text-slate-500">Tap to copy details or scan QR</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* eSewa Quick Box */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-emerald-800">eSewa ID (Mobile)</div>
              <div className="font-mono font-bold text-slate-900 text-sm">{campaign.payments.esewaId}</div>
              <div className="text-[10px] text-slate-500">{campaign.payments.esewaName}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(campaign.payments.esewaId, 'eSewa ID')}
                className="p-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/80 rounded-lg transition-colors"
                title="Copy eSewa ID"
              >
                {copiedText === 'eSewa ID' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="p-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/80 rounded-lg transition-colors"
                title="View eSewa QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nepal SBI Bank Quick Box */}
          <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-blue-800">{campaign.payments.bankName}</div>
              <div className="font-mono font-bold text-slate-900 text-sm">{campaign.payments.accountNumber}</div>
              <div className="text-[10px] text-slate-500">{campaign.payments.accountName} (Hetauda)</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(campaign.payments.accountNumber, 'Bank Account')}
                className="p-2 text-xs font-semibold text-blue-800 hover:bg-blue-100/80 rounded-lg transition-colors"
                title="Copy Account Number"
              >
                {copiedText === 'Bank Account' ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="p-2 text-xs font-semibold text-blue-800 hover:bg-blue-100/80 rounded-lg transition-colors"
                title="View SBI Bank QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scan QR or Fonepay Box */}
          <div
            onClick={() => setIsDonateModalOpen(true)}
            className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100/60 transition-colors"
          >
            <div>
              <div className="text-[10px] uppercase font-bold text-purple-800">Scan QR Code Standee</div>
              <div className="font-semibold text-slate-900 text-sm">eSewa / SBI Bank Fonepay</div>
              <div className="text-[10px] text-slate-500">Tap to open scan-ready QR</div>
            </div>
            <div className="p-2 text-purple-700 bg-white rounded-lg border border-purple-200">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="pt-1 text-center">
          <button
            onClick={() => setIsDonateModalOpen(true)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
          >
            Already sent money via eSewa or SBI Bank? Tap here to submit your transaction reference &amp; name!
          </button>
        </div>
      </div>

      {/* Clinical Diagnosis & Physiotherapist Oversight Banner */}
      {campaign.medicalInfo && (
        <div className="my-6 bg-emerald-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-800/80 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-emerald-600/60 bg-emerald-900">
                <img
                  src={resolveImageUrl(campaign.medicalInfo.physiotherapistAvatar || campaign.creatorAvatar)}
                  alt={campaign.medicalInfo.physiotherapistName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200">
                    Clinical Neuro-Rehab Oversight
                  </span>
                  <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                    <span>🏆</span>
                    <span>Surgeon Dr. Prakash Khetan (Guinness World Record Holder)</span>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {campaign.medicalInfo.injuryDiagnosis}
                </h3>
                <div className="text-xs text-emerald-200/90 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Rehab Centre: <strong>Neurigo360 Advance Neuro Rehab Centre, Greater Noida</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Supervising PT: <strong>{campaign.medicalInfo.physiotherapistName}</strong> &amp; <strong>Dr. Shakal Dev Gonda (BPT., MPT.)</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('medical')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Medical Records</span>
              </button>
              <button
                onClick={() => setIsLegalGuideOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-600/50 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Legal &amp; Disclosure</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabbed Content Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-3 sm:gap-6 mt-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('story')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'story'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Story &amp; Budget
        </button>

        <button
          onClick={() => setActiveTab('medical')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'medical'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Medical Portfolio &amp; MRI Timeline</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
            Verified
          </span>
        </button>

        <button
          onClick={() => setActiveTab('facebook_transparency')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'facebook_transparency'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Facebook Transparency &amp; Ledger</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
            100% Shared
          </span>
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Daily Rehab Exercises</span>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {campaign.exerciseVideos?.length || 3}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('therapist')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'therapist'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Dr. Pratap (Neurigo360)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        <button
          onClick={() => setActiveTab('updates')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'updates'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Milestone Updates</span>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {updates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('wall')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'wall'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Supporters Wall</span>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {verifiedDonations.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: STORY & BUDGET */}
      {activeTab === 'story' && (
        <div className="py-6 space-y-8">
          {/* Main Prose */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {campaign.story}
          </div>

          {/* Transparent Itemized Budget Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                100% Itemized Budget Transparency
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every rupee is tracked. Invoices and receipts are uploaded directly in the updates tab.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {campaign.budgetBreakdown.map(item => (
                <div key={item.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-slate-800 leading-snug">
                      {item.item}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-emerald-700 tabular-nums">
                    NPR {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Equipment Photo Gallery */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Rehabilitation Lab &amp; Clinical Setting</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 relative group">
                <img
                  src={resolveImageUrl('images/exercise_scapular_wall_slide_1790313398123.jpg')}
                  alt="Trunk & Scapular Balance Training"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs">
                  <div className="font-bold">Trunk Posture &amp; Transfer Conditioning</div>
                  <div className="text-[10px] text-slate-200">Saanga Neuro-Rehab Gym</div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 relative group">
                <img
                  src={resolveImageUrl('images/exercise_isometric_knee_quad_1790313410854.jpg')}
                  alt="Quadriceps Isometric Activation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs">
                  <div className="font-bold">Quadriceps Myotome Stimulation</div>
                  <div className="text-[10px] text-slate-200">Daily Mat Exercise Protocol</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEDICAL PORTFOLIO, MRI SCANS, SURGERY HISTORY & STRUCTURED TIMELINE */}
      {activeTab === 'medical' && (
        <div className="py-6">
          <MedicalPortfolioView />
        </div>
      )}

      {/* TAB CONTENT: 100% FACEBOOK TRANSPARENCY & DONOR RECOGNITION */}
      {activeTab === 'facebook_transparency' && (
        <FacebookTransparencyHub />
      )}

      {activeTab === 'exercises' && (
        <div className="py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Prescribed Neuro-Rehabilitation Protocol &amp; Video Logs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily exercise drills prescribed by {campaign.medicalInfo?.physiotherapistName || 'licensed physiotherapist'} to rewire neural motor units.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors self-start sm:self-auto"
            >
              + Add / Manage Exercises (Creator Mode)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(campaign.exerciseVideos || []).map((exercise, index) => (
              <div
                key={exercise.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo / Video Banner */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img
                      src={resolveImageUrl(exercise.imageUrl)}
                      alt={exercise.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-semibold uppercase tracking-wider">
                      {exercise.category.replace('_', ' ')}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold">
                      Prescribed Drills
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span>Logged: {exercise.dateLogged}</span>
                      <span className="font-mono text-emerald-700 font-semibold">{exercise.frequency}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {index + 1}. {exercise.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {exercise.description}
                    </p>

                    {/* Therapist clinical note */}
                    <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-950 space-y-0.5">
                      <div className="font-bold text-[10px] text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Therapist Clinical Cue:</span>
                      </div>
                      <p className="text-[11px] leading-snug italic">
                        "{exercise.therapistNotes}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {exercise.videoUrl ? (
                      <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Watch Video Clip</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">Active in daily recovery</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Check out Bibek's recovery drill: ${exercise.title} at https://creatorfund.link/@${campaign.creatorHandle.replace('@', '')}`);
                      showToast(`Copied drill link for ${exercise.title}!`);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-medium text-[11px] flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Drill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Medical Disclaimer:</strong> These exercises are prescribed specifically for Bibek's individual neuroplastic spinal rehabilitation by licensed physiotherapists. Do not attempt without medical evaluation from your physician.
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: THERAPIST CONCERN & CLINICAL PLAN */}
      {activeTab === 'therapist' && (
        <div className="py-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={resolveImageUrl(campaign.medicalInfo?.physiotherapistAvatar || campaign.creatorAvatar)}
                  alt={campaign.medicalInfo?.physiotherapistName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900">
                      {campaign.medicalInfo?.physiotherapistName || 'Dr. Pratap (Lead Neuro-Physiotherapist)'}
                    </h3>
                    <span className="text-emerald-600" title="Licensed Neuro-Physiotherapist">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Lead Neuro-Rehabilitation Specialist · {campaign.medicalInfo?.rehabCenter || 'Neurigo360, Nepal'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Verified Clinical Certification
                </span>
              </div>
            </div>

            {/* Official Clinical Concern Box */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary Clinical Observation &amp; Urgency Rationale
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic">
                "{campaign.medicalInfo?.therapistConcern}"
              </div>
            </div>

            {/* 3 Clinical Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Diagnosis Level</div>
                <div className="text-xs font-bold text-slate-900">
                  {campaign.medicalInfo?.injuryDiagnosis}
                </div>
                <div className="text-[11px] text-slate-500">Incomplete motor sparing</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Recommended Dosage</div>
                <div className="text-xs font-bold text-slate-900">Daily Intensive Sessions</div>
                <div className="text-[11px] text-slate-500">3.5-Year Intensive Protocol</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Primary Objective</div>
                <div className="text-xs font-bold text-slate-900">
                  {campaign.medicalInfo?.clinicalGoal}
                </div>
              </div>
            </div>

            {/* Legal compliance notice */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span>Consent verified for public fundraising transparency under Nepal Medical Council guidelines.</span>
              <button
                onClick={() => setIsLegalGuideOpen(true)}
                className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
              >
                Read full legal &amp; safety disclosure &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: MILESTONE UPDATES */}
      {activeTab === 'updates' && (
        <div className="py-6 space-y-6">
          {updates.map(upd => (
            <div key={upd.id} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-900">{campaign.creatorName}</span>
                <span aria-hidden="true">·</span>
                <span>{upd.date}</span>
                {upd.milestonePercent && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-bold">{upd.milestonePercent}% Milestone</span>
                  </>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">{upd.title}</h3>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {upd.content}
              </p>

              {upd.imageUrl && (
                <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={resolveImageUrl(upd.imageUrl)}
                    alt={upd.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => likeUpdate(upd.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-semibold transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{upd.likesCount} Cheers</span>
                </button>
                <span className="text-[11px] text-slate-400">Public proof on blockchain & ledger</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: SUPPORTERS WALL */}
      {activeTab === 'wall' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {verifiedDonations.length} Verified Backers
            </h3>
            <span className="text-xs text-slate-500">Updated in real-time</span>
          </div>

          <div className="space-y-3">
            {verifiedDonations.map(d => (
              <div
                key={d.id}
                className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{d.donorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{d.timestamp}</span>
                    <span className="inline-flex items-center text-emerald-600" title="Verified Transaction">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  {d.donorSocialHandle && (
                    <div className="text-xs text-slate-500 font-mono">
                      {d.donorSocialPlatform && `@${d.donorSocialHandle.replace('@', '')} on ${d.donorSocialPlatform}`}
                    </div>
                  )}
                  {d.message && (
                    <p className="text-xs text-slate-700 italic">
                      "{d.message}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="font-extrabold text-sm text-emerald-700 tabular-nums">
                      NPR {d.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">
                      via {d.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => setActiveTicketDonation(d)}
                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                      title="View Official Donation Ticket"
                    >
                      <Ticket className="w-3 h-3 text-emerald-600" />
                      <span>Ticket</span>
                    </button>
                    <button
                      onClick={() => setActiveThankYouDonation(d)}
                      className="px-2 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                      title="Send Direct Thank You & Ask to Share"
                    >
                      <MessageCircle className="w-3 h-3 text-pink-500" />
                      <span>Thank &amp; Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Legal & Medical Disclosure Card */}
      <div className="my-8 bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Patient Transparency &amp; Medical Disclosure</span>
        </div>
        <p className="leading-relaxed">
          {campaign.medicalInfo?.medicalDisclaimer ||
            "This is a verified personal medical rehabilitation fundraiser managed directly by the patient and family. 100% of contributions are deposited directly into the patient's verified personal bank/eSewa account for physical therapy sessions, clinical visits, and assistive equipment. Itemized hospital receipts are continuously uploaded for public inspection."}
        </p>
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Direct Personal Medical Gift · Zero Platform Intermediary Fee</span>
          <button
            onClick={() => setIsLegalGuideOpen(true)}
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2 text-xs"
          >
            Read Legal &amp; Compliance Details &rarr;
          </button>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar adhering to 15% viewport height cap */}
      <div className="sticky bottom-0 z-30 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center gap-2 shadow-lg">
        <button
          onClick={() => setIsDonateModalOpen(true)}
          className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>Contribute via eSewa / Bank / QR</span>
        </button>
        <button
          onClick={handleShareCampaign}
          className="p-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          title="Share campaign"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Real Photo & Official QR Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
        defaultFocus={photoUploadFocus}
      />
    </div>
  );
};
