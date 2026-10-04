import React, { useState, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Donation, PaymentMethodType } from '../types/fundraising';
import { processImageFile } from '../utils/imageUtils';
import { DonationLedger } from './DonationLedger';
import { PhotoUploadModal } from './PhotoUploadModal';
import { CampaignProgressGauge } from './CampaignProgressGauge';
import {
  ShieldCheck,
  Clock,
  Check,
  AlertCircle,
  Search,
  Plus,
  Download,
  Share2,
  Trash2,
  Heart,
  Send,
  Sparkles,
  Settings,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Upload,
  Camera,
  Copy
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const {
    campaign,
    donations,
    updates,
    totalVerifiedRaised,
    totalPendingRaised,
    progressPercent,
    verifiedSupportersCount,
    verifyDonation,
    flagDonation,
    deleteDonation,
    addDonation,
    addUpdate,
    updateCampaign,
    updatePaymentCredentials,
    addExerciseVideo,
    deleteExerciseVideo,
    resetToSciCampaign,
    setIsLegalGuideOpen,
    showToast,
    setActiveThankYouDonation,
    setIsStoryCardModalOpen,
    setSelectedStoryDonation,
    publishCampaignLive,
    isLiveSynced
  } = useCampaign();

  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Navigation tab inside dashboard
  const [activeTab, setActiveTab] = useState<'donations' | 'medical_rehab' | 'updates' | 'settings'>('donations');

  // Medical Info Form States
  const [patientName, setPatientName] = useState(campaign.medicalInfo?.patientName || campaign.creatorName);
  const [injuryDiagnosis, setInjuryDiagnosis] = useState(campaign.medicalInfo?.injuryDiagnosis || 'T12-L1 Incomplete Spinal Cord Injury');
  const [rehabCenter, setRehabCenter] = useState(campaign.medicalInfo?.rehabCenter || 'Spinal Injury Rehabilitation Centre (SIRC)');
  const [physiotherapistName, setPhysiotherapistName] = useState(campaign.medicalInfo?.physiotherapistName || 'Dr. Anita Adhikari, BPT, MPT Neuro');
  const [therapistConcern, setTherapistConcern] = useState(campaign.medicalInfo?.therapistConcern || '');
  const [clinicalGoal, setClinicalGoal] = useState(campaign.medicalInfo?.clinicalGoal || 'Independent transfers & standing frame tolerance');
  const [patientStory, setPatientStory] = useState(campaign.story);

  // Add Exercise Modal
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState<'quad_activation' | 'core_trunk' | 'rotator_cuff' | 'gait_standing' | 'range_of_motion'>('quad_activation');
  const [exerciseDescription, setExerciseDescription] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('3 sets of 10 reps daily');
  const [exerciseTherapistNotes, setExerciseTherapistNotes] = useState('');
  const [exerciseImageUrl, setExerciseImageUrl] = useState('./images/exercise_isometric_knee_quad_1790313410854.jpg');
  const [exerciseVideoUrl, setExerciseVideoUrl] = useState('');

  // Add Manual Donation Modal
  const [isAddManualOpen, setIsAddManualOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAmount, setManualAmount] = useState('1000');
  const [manualMethod, setManualMethod] = useState<PaymentMethodType>('cash');
  const [manualRef, setManualRef] = useState('');
  const [manualNote, setManualNote] = useState('');

  // Add Update Modal
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateCategory, setUpdateCategory] = useState<'milestone' | 'receipt' | 'behind_the_scenes'>('milestone');
  const [updateMilestonePercent, setUpdateMilestonePercent] = useState('');

  // Settings State
  const [settingsEsewaId, setSettingsEsewaId] = useState(campaign.payments.esewaId);
  const [settingsEsewaName, setSettingsEsewaName] = useState(campaign.payments.esewaName);
  const [settingsKhaltiId, setSettingsKhaltiId] = useState(campaign.payments.khaltiId);
  const [settingsBankName, setSettingsBankName] = useState(campaign.payments.bankName);
  const [settingsBankAcc, setSettingsBankAcc] = useState(campaign.payments.accountNumber);
  const [settingsBankAccName, setSettingsBankAccName] = useState(campaign.payments.accountName);
  const [settingsBankBranch, setSettingsBankBranch] = useState(campaign.payments.branch);
  const [settingsTarget, setSettingsTarget] = useState(campaign.targetAmount.toString());
  const [settingsAvatar, setSettingsAvatar] = useState(campaign.creatorAvatar);
  const [settingsHero, setSettingsHero] = useState(campaign.heroBanner);
  const [settingsEsewaQr, setSettingsEsewaQr] = useState(campaign.payments.esewaQrImage || './images/esewa_official_qr_1790321524240.jpg');
  const [settingsBankQr, setSettingsBankQr] = useState(campaign.payments.bankQrImage || './images/sbi_bank_nepal_qr_1790321539674.jpg');

  const pendingCount = donations.filter(d => d.status === 'pending').length;

  const handleCopyFacebookTransparencyPost = () => {
    const verified = donations.filter(d => d.status === 'verified');
    const donorListText = verified.length > 0
      ? verified.map((d, i) => `${i + 1}. ${d.isAnonymous ? 'Kind Well-Wisher (Anonymous)' : d.donorName} — NPR ${d.amount.toLocaleString()} (${d.paymentMethod.toUpperCase()})`).join('\n')
      : 'No verified donations recorded yet.';
    
    const fbPostText = `🙏 100% TRANSPARENCY & DONOR GRATITUDE UPDATE 🙏

My name is BIBEK BHANDARI (from Chandrapur, Rautahat). As I promised to everyone supporting my recovery journey from D1-D5 Spinal Cord Injury, EVERY SINGLE RUPEE IS PUBLICLY ACCOUNTED FOR with complete transparency.

Today, I want to publicly thank and celebrate our verified supporters who have sent funds via eSewa and Nepal SBI Bank Limited:

${donorListText}

📊 TOTAL VERIFIED FUNDS RAISED: NPR ${totalVerifiedRaised.toLocaleString()}
🎯 3.5-YEAR THERAPY TARGET: NPR ${campaign.targetAmount.toLocaleString()} (75 Lakhs)
🏥 Rehabilitation Center: Neurigo360 (Dr. Pratap)

Where your support is spent:
1. Daily neuro-physiotherapy sessions at Neurigo360
2. Accessible rent near clinic
3. Daily sterile medical supplies & bowel care
4. Accessible transit & therapy equipment

📱 To support or verify medical reports:
• eSewa / Khalti ID: 9861452923 (Bibek Bhandari / Sashita Raj Bhandari)
• Nepal SBI Bank Ltd: 20015243402269 (SASHITA RAJ BHANDARI, Hetauda Branch)
• Full MRI Scan & Video Progress: https://creatorfund.link/@sasibibek

Thank you so much to each and every person walking this recovery journey with me! Please share and keep praying for my independent walking! ❤️🙏`;

    navigator.clipboard.writeText(fbPostText);
    showToast('Copied Facebook Donor Transparency Post! Ready to paste directly on Facebook.');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Donor Name', 'Amount', 'Currency', 'Payment Method', 'Reference ID', 'Status', 'Timestamp', 'Social Handle', 'Message'];
    const rows = donations.map(d => [
      d.id,
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.amount,
      d.currency,
      d.paymentMethod,
      `"${d.referenceId}"`,
      d.status,
      d.timestamp,
      `"${(d.donorSocialHandle || '').replace(/"/g, '""')}"`,
      `"${(d.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `creatorfund_donations_${campaign.campaignSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported donation records to CSV!');
  };

  const handleAddManualDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(manualAmount);
    if (!parsedAmount || parsedAmount <= 0) return;

    addDonation({
      donorName: manualName.trim() || 'Offline Supporter',
      isAnonymous: false,
      amount: parsedAmount,
      currency: campaign.currency,
      paymentMethod: manualMethod,
      referenceId: manualRef.trim() || `MANUAL-${Date.now().toString().slice(-6)}`,
      message: manualNote.trim() || undefined,
      status: 'verified'
    });

    setIsAddManualOpen(false);
    setManualName('');
    setManualRef('');
    setManualNote('');
  };

  const handleSaveMedicalStory = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaign({
      creatorName: patientName,
      story: patientStory,
      medicalInfo: {
        isPatientCampaign: true,
        patientName,
        injuryDiagnosis,
        injuryDate: campaign.medicalInfo?.injuryDate || 'November 2025',
        rehabCenter,
        physiotherapistName,
        physiotherapistAvatar: campaign.medicalInfo?.physiotherapistAvatar || './images/avatar_physiotherapist_dr_1790313433006.jpg',
        therapistConcern,
        clinicalGoal,
        medicalDisclaimer: campaign.medicalInfo?.medicalDisclaimer || '',
        doctorVerificationBadge: true
      }
    });
    showToast('Saved medical details and therapist clinical plan!');
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseTitle.trim()) return;

    addExerciseVideo({
      id: `ex_${Date.now()}`,
      title: exerciseTitle.trim(),
      category: exerciseCategory,
      description: exerciseDescription.trim(),
      frequency: exerciseFrequency.trim(),
      therapistNotes: exerciseTherapistNotes.trim(),
      imageUrl: exerciseImageUrl,
      videoUrl: exerciseVideoUrl.trim() || undefined,
      dateLogged: new Date().toISOString().substring(0, 10)
    });

    setIsAddExerciseOpen(false);
    setExerciseTitle('');
    setExerciseDescription('');
    setExerciseTherapistNotes('');
    setExerciseVideoUrl('');
  };

  const handlePublishUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateContent.trim()) return;

    addUpdate({
      title: updateTitle.trim(),
      content: updateContent.trim(),
      category: updateCategory,
      milestonePercent: updateMilestonePercent ? parseInt(updateMilestonePercent) : undefined,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });

    setIsAddUpdateOpen(false);
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateMilestonePercent('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentCredentials({
      esewaId: settingsEsewaId,
      esewaName: settingsEsewaName,
      khaltiId: settingsKhaltiId,
      bankName: settingsBankName,
      accountNumber: settingsBankAcc,
      accountName: settingsBankAccName,
      branch: settingsBankBranch,
      esewaQrImage: settingsEsewaQr,
      bankQrImage: settingsBankQr
    });

    const parsedTarget = parseInt(settingsTarget);
    updateCampaign({
      targetAmount: parsedTarget > 0 ? parsedTarget : campaign.targetAmount,
      creatorAvatar: settingsAvatar,
      heroBanner: settingsHero
    });
    showToast('Updated payment credentials, QR codes, and campaign images!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner / Metrics Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Creator Studio &amp; Ledger
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live &amp; Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your incoming eSewa / Bank contributions, generate instant thank-you messages, and publish updates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={publishing}
            onClick={async () => {
              setPublishing(true);
              await publishCampaignLive();
              setPublishing(false);
            }}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            title="Publish your real photos, cover, and QR codes live to the public link for all visitors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>{publishing ? 'Publishing Live...' : '🚀 Publish Real Photos & QR to Public'}</span>
          </button>

          <button
            onClick={() => setIsPhotoUploadOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            title="Upload or change your real profile photo, cover banner, and QR codes"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Real Photos &amp; QR</span>
          </button>

          <button
            onClick={handleCopyFacebookTransparencyPost}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            title="Copy donor list and transparency update for Facebook"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Facebook Donor Post</span>
          </button>

          <button
            onClick={() => setIsAddManualOpen(true)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Record Cash / Offline</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Verified Raised</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            NPR {totalVerifiedRaised.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{progressPercent}% of NPR {campaign.targetAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Review</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            NPR {totalPendingRaised.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {pendingCount} contribution{pendingCount === 1 ? '' : 's'} waiting for approval
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Verified Supporters</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {verifiedSupportersCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across TikTok, IG & Facebook
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Average Gift</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            NPR {verifiedSupportersCount > 0 ? Math.round(totalVerifiedRaised / verifiedSupportersCount).toLocaleString() : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Standard community tier
          </div>
        </div>
      </div>

      {/* D3-based Fundraising Goal Progress Gauge Component */}
      <CampaignProgressGauge />

      {/* Tabs: Donations / Updates / Payment Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-4 sm:px-6 pt-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex gap-2 sm:gap-6">
            <button
              onClick={() => setActiveTab('donations')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'donations'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Donation Records &amp; Ledger</span>
              {pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('medical_rehab')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'medical_rehab'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>My Medical Story, Therapist &amp; Exercises</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'updates'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Milestone Updates ({updates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Payment & Campaign Settings</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DONATIONS LEDGER */}
        {activeTab === 'donations' && (
          <div className="p-4 sm:p-6">
            <DonationLedger />
          </div>
        )}

        {/* TAB 2: MY MEDICAL STORY, THERAPIST & EXERCISES */}
        {activeTab === 'medical_rehab' && (
          <div className="p-4 sm:p-6 space-y-8">
            {/* Top Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Spinal Cord Injury (SCI) Patient Customizer
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Update your real hospital diagnosis, clinical therapist recommendation, and video exercise drills.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLegalGuideOpen(true)}
                  className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Legal &amp; Safety Rules</span>
                </button>

                <button
                  type="button"
                  onClick={resetToSciCampaign}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Reload Bibek SCI Preset
                </button>
              </div>
            </div>

            {/* Medical Diagnosis & Clinical Supervision Form */}
            <form onSubmit={handleSaveMedicalStory} className="space-y-6">
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>1. Patient Profile &amp; Hospital Diagnosis</span>
                  </h3>
                  <span className="text-xs text-slate-400">Appears on public campaign page</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="e.g. Bibek (Marcus)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Injury Diagnosis (from Hospital Summary)
                    </label>
                    <input
                      type="text"
                      required
                      value={injuryDiagnosis}
                      onChange={e => setInjuryDiagnosis(e.target.value)}
                      placeholder="e.g. T12-L1 Incomplete Spinal Cord Injury (ASIA C)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rehabilitation Hospital / Center
                    </label>
                    <input
                      type="text"
                      required
                      value={rehabCenter}
                      onChange={e => setRehabCenter(e.target.value)}
                      placeholder="e.g. Spinal Injury Rehabilitation Centre (SIRC), Saanga"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Clinical Goal (Next 6 Months)
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicalGoal}
                      onChange={e => setClinicalGoal(e.target.value)}
                      placeholder="e.g. Transfer independence, core stability & standing frame tolerance"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Patient Recovery Story */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Personal Recovery Journey &amp; Public Appeal
                  </label>
                  <textarea
                    rows={6}
                    value={patientStory}
                    onChange={e => setPatientStory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans"
                    placeholder="Tell your story honestly: how your injury happened, your progress so far, and why daily therapy is essential..."
                  />
                </div>
              </div>

              {/* Therapist Concern & Recommendation Letter */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. Supervising Physiotherapist &amp; Clinical Concern</span>
                  </h3>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">
                    Multiplies donor trust by 4x
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Physiotherapist / Doctor Name &amp; Title
                    </label>
                    <input
                      type="text"
                      required
                      value={physiotherapistName}
                      onChange={e => setPhysiotherapistName(e.target.value)}
                      placeholder="e.g. Dr. Anita Adhikari, BPT, MPT Neuro"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinical Urgency Rationale (Therapist's Concern)
                    </label>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Explain why therapy cannot stop (prevent contractures, neuroplastic window)
                    </span>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={therapistConcern}
                    onChange={e => setTherapistConcern(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans"
                    placeholder="e.g. Patient shows active voluntary contraction in quadriceps. The first 6–12 months represent the critical neuroplastic window. 5x/week clinical physical therapy is clinically imperative to avoid joint contractures and maximize functional standing..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    Save Medical &amp; Clinical Details
                  </button>
                </div>
              </div>
            </form>

            {/* Prescribed Rehabilitation Exercise Videos Management */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>3. Rehabilitation Exercise Drills &amp; Video Logs ({(campaign.exerciseVideos || []).length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Show your supporters the exact rehabilitation drills you practice daily.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddExerciseOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Exercise Drill</span>
                </button>
              </div>

              {/* List of current exercises */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {(campaign.exerciseVideos || []).map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{exercise.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteExerciseVideo(exercise.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete Exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-200 border border-slate-200">
                        <img
                          src={exercise.imageUrl}
                          alt={exercise.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {exercise.description}
                      </p>

                      <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        <strong>Dosage:</strong> {exercise.frequency}
                        <br />
                        <strong>Therapist Cue:</strong> "{exercise.therapistNotes}"
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                      <span>Category: {exercise.category}</span>
                      <span>Logged: {exercise.dateLogged}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MILESTONE UPDATES */}
        {activeTab === 'updates' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Campaign Milestone Updates</h3>
                <p className="text-xs text-slate-500">
                  Keep your Facebook, Instagram, and TikTok donors emotionally invested by sharing receipts and progress.
                </p>
              </div>
              <button
                onClick={() => setIsAddUpdateOpen(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Update</span>
              </button>
            </div>

            {/* List of updates */}
            <div className="space-y-4">
              {updates.map(upd => (
                <div key={upd.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {upd.category.replace('_', ' ')}
                        </span>
                        {upd.milestonePercent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {upd.milestonePercent}% Milestone
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{upd.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{upd.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {upd.content}
                  </p>

                  {upd.imageUrl && (
                    <div className="w-full max-w-md h-48 rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={upd.imageUrl}
                        alt={upd.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
                      <span>{upd.likesCount} cheers</span>
                    </span>
                    <span>·</span>
                    <span>Visible on public campaign page</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & CAMPAIGN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6 max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Payment & Bank Configurations</h3>
              <p className="text-xs text-slate-500">
                These credentials appear on your public campaign page and in copy-paste templates.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">eSewa ID / Number</label>
                  <input
                    type="text"
                    value={settingsEsewaId}
                    onChange={e => setSettingsEsewaId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">eSewa Account Name</label>
                  <input
                    type="text"
                    value={settingsEsewaName}
                    onChange={e => setSettingsEsewaName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khalti ID / Number</label>
                  <input
                    type="text"
                    value={settingsKhaltiId}
                    onChange={e => setSettingsKhaltiId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fundraising Target (NPR)</label>
                  <input
                    type="number"
                    value={settingsTarget}
                    onChange={e => setSettingsTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Direct Bank Transfer Credentials</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={settingsBankName}
                      onChange={e => setSettingsBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={settingsBankAcc}
                      onChange={e => setSettingsBankAcc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={settingsBankAccName}
                      onChange={e => setSettingsBankAccName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Branch</label>
                    <input
                      type="text"
                      value={settingsBankBranch}
                      onChange={e => setSettingsBankBranch(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Profile, Cover & QR Code Images */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Profile Photo, Cover Banner &amp; Transparent QR Standees</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Update your photos or paste any image URL (e.g. from Google Drive, Imgur, or direct link).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Avatar Photo */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-slate-700">Profile Picture (Bibek's Photo)</label>
                      <label className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              try {
                                const d = await processImageFile(f, 600, 600);
                                setSettingsAvatar(d);
                                showToast('Uploaded new profile photo!');
                              } catch {
                                showToast('Could not process photo file', 'error');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                        <img src={settingsAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                      </div>
                      <input
                        type="text"
                        value={settingsAvatar}
                        onChange={e => setSettingsAvatar(e.target.value)}
                        placeholder="Image URL or path..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Cover Banner */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-slate-700">Campaign Cover Banner</label>
                      <label className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              try {
                                const d = await processImageFile(f, 1600, 900);
                                setSettingsHero(d);
                                showToast('Uploaded new cover banner!');
                              } catch {
                                showToast('Could not process cover photo', 'error');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                        <img src={settingsHero} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                      <input
                        type="text"
                        value={settingsHero}
                        onChange={e => setSettingsHero(e.target.value)}
                        placeholder="Image URL or path..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* eSewa QR Code Image */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-emerald-800">Official eSewa QR Code Image</label>
                      <label className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              try {
                                const d = await processImageFile(f, 900, 900);
                                setSettingsEsewaQr(d);
                                showToast('Uploaded official eSewa QR screenshot!');
                              } catch {
                                showToast('Could not process QR file', 'error');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100 p-0.5">
                        <img src={settingsEsewaQr} alt="eSewa QR preview" className="w-full h-full object-contain" />
                      </div>
                      <input
                        type="text"
                        value={settingsEsewaQr}
                        onChange={e => setSettingsEsewaQr(e.target.value)}
                        placeholder="eSewa QR image URL..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Nepal SBI Bank QR Code Image */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold text-blue-800">Nepal SBI Bank Fonepay QR Image</label>
                      <label className="text-[10px] text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              try {
                                const d = await processImageFile(f, 900, 900);
                                setSettingsBankQr(d);
                                showToast('Uploaded official Nepal SBI Bank QR screenshot!');
                              } catch {
                                showToast('Could not process Bank QR file', 'error');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100 p-0.5">
                        <img src={settingsBankQr} alt="SBI Bank QR preview" className="w-full h-full object-contain" />
                      </div>
                      <input
                        type="text"
                        value={settingsBankQr}
                        onChange={e => setSettingsBankQr(e.target.value)}
                        placeholder="SBI Bank QR image URL..."
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: Record Offline / Cash Donation */}
      {isAddManualOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Record Offline / Cash Contribution</h3>
              <button onClick={() => setIsAddManualOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleAddManualDonation} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Donor Name</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="e.g. Uncle Ramesh"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Amount (NPR)</label>
                <input
                  type="number"
                  required
                  min="50"
                  value={manualAmount}
                  onChange={e => setManualAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={manualMethod}
                  onChange={e => setManualMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="cash">Cash / Hand Delivery</option>
                  <option value="bank">Direct Bank Deposit</option>
                  <option value="esewa">eSewa Offline Transfer</option>
                  <option value="khalti">Khalti Offline Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Receipt / Voucher Ref</label>
                <input
                  type="text"
                  value={manualRef}
                  onChange={e => setManualRef(e.target.value)}
                  placeholder="e.g. CASH-POKHARA-01"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={manualNote}
                  onChange={e => setManualNote(e.target.value)}
                  placeholder="e.g. Handed cash during Pokhara meet"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddManualOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Record Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Update */}
      {isAddUpdateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Post Milestone or Receipt Update</h3>
              <button onClick={() => setIsAddUpdateOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handlePublishUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Update Headline</label>
                <input
                  type="text"
                  required
                  value={updateTitle}
                  onChange={e => setUpdateTitle(e.target.value)}
                  placeholder="e.g. 75% Funded! Audio Kits Dispatched"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={updateCategory}
                    onChange={e => setUpdateCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="milestone">Milestone Achieved</option>
                    <option value="receipt">Expense Receipt Proof</option>
                    <option value="behind_the_scenes">Behind the Scenes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Milestone % (Optional)</label>
                  <input
                    type="number"
                    value={updateMilestonePercent}
                    onChange={e => setUpdateMilestonePercent(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Update Content</label>
                <textarea
                  required
                  rows={4}
                  value={updateContent}
                  onChange={e => setUpdateContent(e.target.value)}
                  placeholder="Share the news, receipts, and student stories with your supporters..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUpdateOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Publish Public Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Exercise Drill */}
      {isAddExerciseOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Prescribed Rehabilitation Exercise</h3>
                <p className="text-xs text-slate-500">Document your physical therapy drills for donor transparency</p>
              </div>
              <button onClick={() => setIsAddExerciseOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Exercise Drill Name</label>
                <input
                  type="text"
                  required
                  value={exerciseTitle}
                  onChange={e => setExerciseTitle(e.target.value)}
                  placeholder="e.g. Quadriceps Isometric Activation with Towel Roll"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Category</label>
                  <select
                    value={exerciseCategory}
                    onChange={e => setExerciseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="quad_activation">Quadriceps &amp; Knee</option>
                    <option value="core_trunk">Core Trunk &amp; Balance</option>
                    <option value="rotator_cuff">Rotator Cuff &amp; Shoulder</option>
                    <option value="gait_standing">Gait &amp; Standing Frame</option>
                    <option value="range_of_motion">Passive Range of Motion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dosage / Frequency</label>
                  <input
                    type="text"
                    required
                    value={exerciseFrequency}
                    onChange={e => setExerciseFrequency(e.target.value)}
                    placeholder="e.g. 3 sets of 10 reps (6s holds)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Exercise Description &amp; Technique</label>
                <textarea
                  rows={2}
                  value={exerciseDescription}
                  onChange={e => setExerciseDescription(e.target.value)}
                  placeholder="Describe how you perform the drill, towel positioning, or band tension..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Therapist Clinical Cue</label>
                <input
                  type="text"
                  value={exerciseTherapistNotes}
                  onChange={e => setExerciseTherapistNotes(e.target.value)}
                  placeholder="e.g. Focus on conscious mind-muscle intent to fire vastus medialis"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Exercise Video Link (Optional: TikTok / YouTube Shorts / Drive)
                </label>
                <input
                  type="url"
                  value={exerciseVideoUrl}
                  onChange={e => setExerciseVideoUrl(e.target.value)}
                  placeholder="https://tiktok.com/@bibek.scirecovery/video/... or https://youtube.com/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Exercise Photo Preset</label>
                <select
                  value={exerciseImageUrl}
                  onChange={e => setExerciseImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="./images/exercise_isometric_knee_quad_1790313410854.jpg">
                    Quadriceps Isometric Knee Lift
                  </option>
                  <option value="./images/exercise_scapular_wall_slide_1790313398123.jpg">
                    Scapular Wall Slides &amp; Trunk Posture
                  </option>
                  <option value="./images/exercise_rotator_cuff_band_1790321421523.jpg">
                    Resistance Band Shoulder &amp; Lat Pull
                  </option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExerciseOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Save Exercise Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Upload Real Photos & QR Modal */}
      <PhotoUploadModal
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
      />
    </div>
  );
};
