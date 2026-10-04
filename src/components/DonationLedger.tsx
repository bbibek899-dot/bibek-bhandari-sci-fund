import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useCampaign } from '../context/CampaignContext';
import { Donation, PaymentMethodType } from '../types/fundraising';
import { getShareableCampaignUrl } from '../utils/urlUtils';
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
  Copy,
  ExternalLink,
  Ticket,
  Filter,
  CheckCircle2,
  Eye,
  MessageCircle,
  Phone,
  Printer,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const DonationLedger: React.FC = () => {
  const {
    campaign,
    donations,
    totalVerifiedRaised,
    totalPendingRaised,
    progressPercent,
    verifiedSupportersCount,
    verifyDonation,
    flagDonation,
    deleteDonation,
    addDonation,
    markDonationThanked,
    showToast,
    setActiveThankYouDonation,
    setActiveTicketDonation,
    setIsStoryCardModalOpen,
    setSelectedStoryDonation
  } = useCampaign();

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'flagged'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Verified Dispatch Modal (Automated Verification + Thank-You + Ticket Generator)
  const [verifiedDispatchDonation, setVerifiedDispatchDonation] = useState<Donation | null>(null);
  const [dispatchTab, setDispatchTab] = useState<'thankyou' | 'ticket'>('thankyou');
  const [dispatchLang, setDispatchLang] = useState<'nepali' | 'english'>('nepali');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [dispatchQrUrl, setDispatchQrUrl] = useState<string>('');

  // Manual Offline Donation Modal
  const [isAddManualOpen, setIsAddManualOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAmount, setManualAmount] = useState('1000');
  const [manualMethod, setManualMethod] = useState<PaymentMethodType>('cash');
  const [manualRef, setManualRef] = useState('');
  const [manualNote, setManualNote] = useState('');

  // Clean public campaign URL for sharing & verification QR
  const campaignUrl = getShareableCampaignUrl(campaign.livePublicUrl);

  // Filter donations
  const filteredDonations = donations.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || d.paymentMethod === methodFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.donorName.toLowerCase().includes(q) ||
      d.referenceId.toLowerCase().includes(q) ||
      (d.ticketNumber && d.ticketNumber.toLowerCase().includes(q)) ||
      (d.donorSocialHandle && d.donorSocialHandle.toLowerCase().includes(q)) ||
      (d.message && d.message.toLowerCase().includes(q));
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const pendingCount = donations.filter(d => d.status === 'pending').length;
  const verifiedCount = donations.filter(d => d.status === 'verified').length;
  const flaggedCount = donations.filter(d => d.status === 'flagged').length;
  const unthankedCount = donations.filter(d => d.status === 'verified' && !d.thankYouSent).length;

  // Generate QR code for ticket verification inside dispatch modal
  useEffect(() => {
    if (!verifiedDispatchDonation) return;
    const ticketId = verifiedDispatchDonation.ticketNumber || `NEPAL-SCI-2026-${(verifiedDispatchDonation.referenceId || '88219A').slice(-6).toUpperCase()}`;
    const payload = `${campaignUrl}?ticket=${encodeURIComponent(ticketId)}&ref=${encodeURIComponent(verifiedDispatchDonation.referenceId)}`;

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setDispatchQrUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [verifiedDispatchDonation, campaignUrl]);

  // Handle Verify Action: verifies donation, creates ticket, and opens automated Thank-You + Ticket Dispatch Modal
  const handleVerifyAction = (donation: Donation) => {
    const ticketId = donation.ticketNumber || `NEPAL-SCI-2026-${(donation.referenceId || Math.random().toString(36).substring(2, 8)).slice(-6).toUpperCase()}`;
    
    // Call context verify which updates state and generates ticket
    verifyDonation(donation.id);

    const verifiedRecord: Donation = {
      ...donation,
      status: 'verified',
      ticketNumber: ticketId
    };

    // Automatically trigger the verification Thank-You & Ticket Dispatch panel
    setVerifiedDispatchDonation(verifiedRecord);
    setDispatchTab('thankyou');
  };

  // Thank You Message templates
  const getThankYouMessage = (donation: Donation, lang: 'nepali' | 'english') => {
    const ticketId = donation.ticketNumber || `NEPAL-SCI-2026-${(donation.referenceId || '88219A').slice(-6).toUpperCase()}`;
    if (lang === 'nepali') {
      return `नमस्ते ${donation.donorName} ज्यु!

विवेक भण्डारीको स्पाइनल कर्ड इन्जुरी (Neurosurgeon Dr. Prakash Khetan - Guinness World Record Holder द्वारा गरिएको D1-D5 open laminectomy शल्यक्रिया) र Neurigo360 Advance Neuro Rehabilitation Centre (Greater Noida Paramount Golf Foreste) मा Dr. Pratap Kunwar Singh (Founder/PT) तथा Dr. Shakal Dev Gonda (PT) को रेखदेखमा दैनिक फिजियोथेरापीको लागि तपाईंले गर्नुभएको रु ${donation.amount.toLocaleString()} (${donation.paymentMethod.toUpperCase()} मार्फत, Ref: ${donation.referenceId}) को अमूल्य सहयोगको लागि हृदयदेखि नै धेरै धेरै धन्यवाद व्यक्त गर्दछौं।

🎫 तपाईंको आधिकारिक डोनेसन टिकट नं: ${ticketId}
हामी तपाईंको यो सहयोगलाई १००% पारदर्शी रूपमा फेसबुकमा पनि सम्मानसहित सार्वजनिक गर्दैछौं।

तपाईंको यो साथले विवेकलाई फेरि आफ्नै खुट्टामा उभिने र हिँड्ने नयाँ आशा दिएको छ। कृपया यो अभियानको लिंक आफ्ना साथीभाइ, आफन्त र फेसबुक/मेसेन्जर ग्रुपहरूमा पनि सेयर गरिदिनुहुन हार्दिक अनुरोध गर्दछौं:
🔗 ${campaignUrl}
(iPhone / Messenger मा 'Action required' देखिएमा 'Authenticate in new window' मा थिच्नुहोला वा माथि दायाँको ••• थिचेर 'Open in Safari' छान्नुहोला 🙏)

सशीता राज भण्डारी तथा विवेक भण्डारी परिवार 🙏
सम्पर्क/eSewa: 9861452923`;
    }

    return `Dear ${donation.donorName},

Heartfelt thank you for your generous medical contribution of NPR ${donation.amount.toLocaleString()} (via ${donation.paymentMethod.toUpperCase()}, Reference: ${donation.referenceId}) supporting Bibek Bhandari's spinal cord neuro-rehabilitation at Neurigo360 Advance Neuro Rehabilitation Centre (Greater Noida Paramount Golf Foreste) under Dr. Pratap Kunwar Singh (BPT., MPT. - Founder/PT) & Dr. Shakal Dev Gonda (BPT., MPT.), following emergency open spine surgery by Neurosurgeon Dr. Prakash Khetan (Guinness Book of World Records Holder).

🎫 Official Donation Ticket ID: ${ticketId}
Your support is recorded with 100% public transparency on Facebook.

Your compassion gives Bibek real hope to overcome paralysis and walk independently again. Could you please share this campaign link with your family, friends, and social networks too?
🔗 ${campaignUrl}
(iPhone / Messenger note: If you see 'Action required', tap 'Authenticate in new window' or tap ••• at top-right & select 'Open in Safari')

With profound gratitude,
Sashita Raj Bhandari & Bibek Bhandari
Rehabilitation Portal: ${campaignUrl}`;
  };

  const getTicketSummaryText = (donation: Donation) => {
    const ticketId = donation.ticketNumber || `NEPAL-SCI-2026-${(donation.referenceId || '88219A').slice(-6).toUpperCase()}`;
    return `🎫 OFFICIAL DONATION TICKET & VERIFICATION RECEIPT
Ticket ID: ${ticketId}
Donor: ${donation.donorName}
Amount: NPR ${donation.amount.toLocaleString()}
Payment Channel: ${donation.paymentMethod.toUpperCase()} (Ref: ${donation.referenceId})
Date: ${new Date(donation.timestamp).toLocaleDateString()}
Status: VERIFIED & CONFIRMED
Beneficiary: Bibek Bhandari · Spinal Cord Recovery Fund (D1-D5 Open Surgery Rehab)
Operating Surgeon: Neurosurgeon Dr. Prakash Khetan (Guinness World Record Holder)
Supervising Centre: Neurigo360 Advance Neuro Rehab Centre, Greater Noida (Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda)
Facebook Ledger: 100% Publicly Accountable
Verify & Support: ${campaignUrl}`;
  };

  const handleCopyMessage = () => {
    if (!verifiedDispatchDonation) return;
    const msg = getThankYouMessage(verifiedDispatchDonation, dispatchLang);
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    showToast('Copied thank-you message to clipboard!');
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleCopyTicket = () => {
    if (!verifiedDispatchDonation) return;
    const text = getTicketSummaryText(verifiedDispatchDonation);
    navigator.clipboard.writeText(text);
    setCopiedTicket(true);
    showToast('Copied official ticket receipt to clipboard!');
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleDownloadTicketText = () => {
    if (!verifiedDispatchDonation) return;
    const text = getTicketSummaryText(verifiedDispatchDonation);
    const ticketId = verifiedDispatchDonation.ticketNumber || 'TICKET';
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Donation_Ticket_${ticketId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Downloaded official ticket file!');
  };

  const handleCopyFacebookTransparencyPost = () => {
    const verified = donations.filter(d => d.status === 'verified');
    const donorListText = verified.length > 0
      ? verified.map((d, i) => `${i + 1}. ${d.isAnonymous ? 'Kind Well-Wisher (Anonymous)' : d.donorName} — NPR ${d.amount.toLocaleString()} (${d.paymentMethod.toUpperCase()}) [Ticket: ${d.ticketNumber || 'VERIFIED'}]`).join('\n')
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
• Full MRI Scan & Verified Ledger: ${campaignUrl}

Thank you so much to each and every person walking this recovery journey with me! Please share and keep praying for my independent walking! ❤️🙏`;

    navigator.clipboard.writeText(fbPostText);
    showToast('Copied Facebook Donor Transparency Post! Ready to paste directly on Facebook.');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Donor Name', 'Amount', 'Currency', 'Payment Method', 'Reference ID', 'Ticket Number', 'Status', 'Thank You Sent', 'Timestamp', 'Social Handle', 'Message'];
    const rows = donations.map(d => [
      d.id,
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.amount,
      d.currency,
      d.paymentMethod,
      `"${d.referenceId}"`,
      `"${d.ticketNumber || ''}"`,
      d.status,
      d.thankYouSent ? 'Yes' : 'No',
      d.timestamp,
      `"${(d.donorSocialHandle || '').replace(/"/g, '""')}"`,
      `"${(d.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `creatorfund_donations_ledger_${campaign.campaignSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported full donation ledger to CSV!');
  };

  const handleAddManualDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(manualAmount);
    if (!parsedAmount || parsedAmount <= 0) return;

    const newRef = manualRef.trim() || `MANUAL-${Date.now().toString().slice(-6)}`;
    const ticketId = `NEPAL-SCI-2026-${newRef.slice(-6).toUpperCase()}`;

    addDonation({
      donorName: manualName.trim() || 'Offline Supporter',
      isAnonymous: false,
      amount: parsedAmount,
      currency: campaign.currency,
      paymentMethod: manualMethod,
      referenceId: newRef,
      ticketNumber: ticketId,
      message: manualNote.trim() || undefined,
      status: 'verified'
    });

    setIsAddManualOpen(false);
    setManualName('');
    setManualRef('');
    setManualNote('');

    // Prompt immediate thank-you dispatch
    const manualRecord: Donation = {
      id: `don_${Date.now()}`,
      donorName: manualName.trim() || 'Offline Supporter',
      isAnonymous: false,
      amount: parsedAmount,
      currency: campaign.currency,
      paymentMethod: manualMethod,
      referenceId: newRef,
      ticketNumber: ticketId,
      message: manualNote.trim() || undefined,
      status: 'verified',
      timestamp: new Date().toISOString()
    };
    setVerifiedDispatchDonation(manualRecord);
    setDispatchTab('thankyou');
  };

  return (
    <div className="space-y-6">
      {/* LEDGER HEADER & METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Verified Raised</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            NPR {totalVerifiedRaised.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{progressPercent}% of target</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">Pending Review</div>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-1 tabular-nums">
            NPR {totalPendingRaised.toLocaleString()}
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            {pendingCount} incoming donation{pendingCount === 1 ? '' : 's'} to verify
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Verified Supporters</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {verifiedSupportersCount}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Official tickets issued</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Pending Thank-Yous</div>
          <div className="text-xl sm:text-2xl font-bold text-pink-600 mt-1 tabular-nums">
            {unthankedCount}
          </div>
          <div className="text-xs text-pink-600 font-medium mt-1 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Awaiting direct note</span>
          </div>
        </div>
      </div>

      {/* 100% FACEBOOK TRANSPARENCY ACCORDION BAR */}
      <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>100% Facebook Public Transparency Ledger</span>
              <span className="text-[10px] bg-blue-500/40 text-blue-100 font-medium px-2 py-0.5 rounded-full border border-blue-400/30">
                Bibek's Strict Pledge
              </span>
            </div>
            <div className="text-xs text-blue-200 mt-0.5">
              Every single rupee received via eSewa or SBI Bank is verified, issued an official ticket, and published to Facebook.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyFacebookTransparencyPost}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Transparency Update</span>
          </button>
          <a
            href={campaign.socialLinks.facebook || 'https://www.facebook.com/share/1E1EVtPrPh/'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
          >
            <span>Open Facebook</span>
            <ExternalLink className="w-3 h-3 text-blue-300" />
          </a>
        </div>
      </div>

      {/* LEDGER TOOLBAR: FILTERS, SEARCH, RECORD CASH, EXPORT */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({donations.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'verified' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('flagged')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'flagged' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flagged ({flaggedCount})
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setIsAddManualOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Record Cash / Offline</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Second Row: Payment Method Filter + Live Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Method:</span>
            {['all', 'esewa', 'bank', 'khalti', 'cash'].map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setMethodFilter(method)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  methodFilter === method
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {method === 'all' ? 'All Channels' : method === 'bank' ? 'SBI Bank' : method}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search donor, ref #, ticket ID, note..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* DONATION LEDGER TABLE & LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Incoming Contribution Ledger
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredDonations.length} records
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Click <strong className="text-emerald-700">"Verify"</strong> on incoming gifts to issue ticket &amp; generate thank-you
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Supporter</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Channel / Ref</th>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-1">
                      <p className="font-semibold text-slate-600">No donation records found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or record an offline contribution.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDonations.map(donation => (
                  <tr key={donation.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Supporter */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{donation.donorName}</span>
                        {donation.isAnonymous && (
                          <span className="text-[10px] text-slate-400 font-normal italic bg-slate-100 px-1.5 py-0.5 rounded">
                            Anon
                          </span>
                        )}
                      </div>
                      {donation.donorSocialHandle && (
                        <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                          {donation.donorSocialHandle}
                        </div>
                      )}
                      {donation.message && (
                        <div className="text-[11px] text-slate-600 italic mt-1 max-w-xs truncate bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          "{donation.message}"
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-sm tabular-nums">
                        NPR {donation.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">100% directly to clinic</div>
                    </td>

                    {/* Channel & Reference */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        donation.paymentMethod === 'esewa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : donation.paymentMethod === 'khalti'
                          ? 'bg-purple-100 text-purple-800'
                          : donation.paymentMethod === 'bank'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {donation.paymentMethod === 'bank' ? 'SBI BANK' : donation.paymentMethod}
                      </span>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>{donation.referenceId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(donation.referenceId);
                            showToast(`Copied ref: ${donation.referenceId}`);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy reference ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Ticket ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {donation.ticketNumber ? (
                        <button
                          type="button"
                          onClick={() => setActiveTicketDonation(donation)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200 transition-colors"
                          title="View verified donation ticket"
                        >
                          <Ticket className="w-3 h-3 text-blue-600" />
                          <span>{donation.ticketNumber}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not issued yet</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {donation.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                      {donation.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Needs Review</span>
                        </span>
                      )}
                      {donation.status === 'flagged' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Flagged</span>
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {donation.timestamp}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* THE KEY VERIFY ACTION */}
                        {donation.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyAction(donation)}
                            title="Verify contribution, generate official ticket & thank-you message"
                            className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 group"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Verify</span>
                          </button>
                        )}

                        {/* Thank You Generator button */}
                        {donation.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => {
                              setVerifiedDispatchDonation(donation);
                              setDispatchTab('thankyou');
                            }}
                            title="Generate & Send Thank-You Message"
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 border ${
                              donation.thankYouSent
                                ? 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
                                : 'text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100'
                            }`}
                          >
                            <Send className="w-3 h-3 text-pink-600" />
                            <span>{donation.thankYouSent ? 'Thanked' : 'Thank You'}</span>
                          </button>
                        )}

                        {/* Ticket button */}
                        {donation.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => {
                              setVerifiedDispatchDonation(donation);
                              setDispatchTab('ticket');
                            }}
                            title="Open Official Donation Ticket"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          >
                            <Ticket className="w-4 h-4" />
                          </button>
                        )}

                        {/* Social Shoutout */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStoryDonation(donation);
                            setIsStoryCardModalOpen(true);
                          }}
                          title="Generate Social Story Card"
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        {/* Delete record */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete record for ${donation.donorName}?`)) {
                              deleteDonation(donation.id);
                            }
                          }}
                          title="Delete entry"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View (Optimized for iOS / Android) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredDonations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No donation records match your filter.
            </div>
          ) : (
            filteredDonations.map(donation => (
              <div key={donation.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{donation.donorName}</span>
                      {donation.isAnonymous && (
                        <span className="text-[10px] text-slate-400 italic bg-slate-100 px-1 py-0.2 rounded">
                          Anon
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {donation.timestamp}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-slate-900 text-base tabular-nums">
                      NPR {donation.amount.toLocaleString()}
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                      donation.paymentMethod === 'esewa'
                        ? 'bg-emerald-100 text-emerald-800'
                        : donation.paymentMethod === 'khalti'
                        ? 'bg-purple-100 text-purple-800'
                        : donation.paymentMethod === 'bank'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {donation.paymentMethod}
                    </span>
                  </div>
                </div>

                {donation.message && (
                  <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                    "{donation.message}"
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {donation.status === 'verified' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    )}
                    {donation.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending Review</span>
                      </span>
                    )}

                    {donation.ticketNumber && (
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {donation.ticketNumber}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {donation.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleVerifyAction(donation)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify &amp; Dispatch</span>
                      </button>
                    )}

                    {donation.status === 'verified' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setVerifiedDispatchDonation(donation);
                            setDispatchTab('thankyou');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Thank You</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setVerifiedDispatchDonation(donation);
                            setDispatchTab('ticket');
                          }}
                          className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1"
                        >
                          <Ticket className="w-3 h-3" />
                          <span>Ticket</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AUTOMATED VERIFICATION & DISPATCH MODAL (THANK YOU + TICKET GENERATOR) */}
      {verifiedDispatchDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Contribution Verified!
                    </h3>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-emerald-100 border border-white/30">
                      Live Receipt Generated
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Official Ticket: <strong className="text-white font-mono">{verifiedDispatchDonation.ticketNumber || `NEPAL-SCI-2026-${verifiedDispatchDonation.referenceId.slice(-6).toUpperCase()}`}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerifiedDispatchDonation(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Switcher */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setDispatchTab('thankyou')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  dispatchTab === 'thankyou'
                    ? 'border-pink-600 text-pink-700 bg-white px-4 rounded-t-xl border-t border-x border-slate-200 -mb-px'
                    : 'border-transparent text-slate-500 hover:text-slate-900 px-4'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-pink-600" />
                <span>Thank-You Message &amp; Messenger Share</span>
              </button>

              <button
                type="button"
                onClick={() => setDispatchTab('ticket')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  dispatchTab === 'ticket'
                    ? 'border-blue-600 text-blue-700 bg-white px-4 rounded-t-xl border-t border-x border-slate-200 -mb-px'
                    : 'border-transparent text-slate-500 hover:text-slate-900 px-4'
                }`}
              >
                <Ticket className="w-4 h-4 text-blue-600" />
                <span>Official Donation Ticket &amp; QR</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* TAB 1: THANK-YOU GENERATOR */}
              {dispatchTab === 'thankyou' && (
                <div className="space-y-4">
                  {/* Language Selector & Recipient Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <div className="text-xs text-slate-500">Recipient Donor:</div>
                      <div className="text-sm font-bold text-slate-900">
                        {verifiedDispatchDonation.donorName} · NPR {verifiedDispatchDonation.amount.toLocaleString()} ({verifiedDispatchDonation.paymentMethod.toUpperCase()})
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setDispatchLang('nepali')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                          dispatchLang === 'nepali'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        नेपाली (Nepali)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDispatchLang('english')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                          dispatchLang === 'english'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>

                  {/* Message Preview Box */}
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={8}
                      value={getThankYouMessage(verifiedDispatchDonation, dispatchLang)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-pink-500 leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedMessage ? 'Copied!' : 'Copy Text'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct Sharing Channels */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Send Direct Gratitude Message &amp; Ask to Share:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Messenger */}
                      <a
                        href={`https://m.me/?text=${encodeURIComponent(getThankYouMessage(verifiedDispatchDonation, dispatchLang))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markDonationThanked(verifiedDispatchDonation.id)}
                        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send via Messenger</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getThankYouMessage(verifiedDispatchDonation, dispatchLang))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markDonationThanked(verifiedDispatchDonation.id)}
                        className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Send via WhatsApp</span>
                      </a>

                      {/* Viber */}
                      <a
                        href={`viber://forward?text=${encodeURIComponent(getThankYouMessage(verifiedDispatchDonation, dispatchLang))}`}
                        onClick={() => markDonationThanked(verifiedDispatchDonation.id)}
                        className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send via Viber</span>
                      </a>
                    </div>
                  </div>

                  {/* Mark as Thanked Toggle */}
                  <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-pink-900">
                      <Heart className="w-4 h-4 text-pink-600 shrink-0" />
                      <span>Has this donor already received their thank-you note?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        markDonationThanked(verifiedDispatchDonation.id);
                        setVerifiedDispatchDonation(prev => prev ? { ...prev, thankYouSent: true } : null);
                      }}
                      className="px-3 py-1 bg-white hover:bg-pink-100 text-pink-700 border border-pink-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      {verifiedDispatchDonation.thankYouSent ? '✓ Marked as Sent' : 'Mark as Thanked'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: OFFICIAL DONATION TICKET */}
              {dispatchTab === 'ticket' && (
                <div className="space-y-4">
                  {/* Visual Ticket Receipt Card */}
                  <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl border-2 border-slate-800 shadow-xl relative overflow-hidden space-y-4">
                    {/* Watermark / Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Official Medical Rehabilitation Receipt</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white mt-0.5">
                          Bibek Bhandari · SCI Recovery Fund
                        </h4>
                        <div className="text-[11px] text-slate-400">
                          Neurigo360 Rehabilitation Centre (Dr. Pratap) · D1-D5 Laminectomy
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          VERIFIED
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          Ticket #{verifiedDispatchDonation.ticketNumber || `NEPAL-SCI-2026-${verifiedDispatchDonation.referenceId.slice(-6).toUpperCase()}`}
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="sm:col-span-2 space-y-2.5">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Honored Supporter</div>
                          <div className="text-base font-bold text-white flex items-center gap-1.5">
                            <span>{verifiedDispatchDonation.donorName}</span>
                            {verifiedDispatchDonation.isAnonymous && <span className="text-xs text-slate-400">(Anon)</span>}
                          </div>
                        </div>

                        <div className="flex gap-6">
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Amount</div>
                            <div className="text-lg font-black text-emerald-400 font-mono">
                              NPR {verifiedDispatchDonation.amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Payment Channel</div>
                            <div className="text-xs font-bold text-slate-200 uppercase">
                              {verifiedDispatchDonation.paymentMethod}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Ref: {verifiedDispatchDonation.referenceId}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Verification Timestamp</div>
                          <div className="text-xs text-slate-300 font-mono">
                            {verifiedDispatchDonation.timestamp}
                          </div>
                        </div>
                      </div>

                      {/* Live QR Verification Code */}
                      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl text-slate-900 border border-slate-200">
                        {dispatchQrUrl ? (
                          <img src={dispatchQrUrl} alt="Ticket Verification QR" className="w-28 h-28 object-contain" />
                        ) : (
                          <div className="w-28 h-28 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                            Generating QR...
                          </div>
                        )}
                        <span className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-wider">
                          Scan to Verify
                        </span>
                      </div>
                    </div>

                    {/* Bottom verification pledge */}
                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Supervised by Sashita Raj Bhandari &amp; Neurigo360</span>
                      <span className="text-emerald-400 font-semibold">100% Transparent</span>
                    </div>
                  </div>

                  {/* Ticket Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyTicket}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTicket ? 'Copied Receipt!' : 'Copy Ticket Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadTicketText}
                      className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .TXT Ticket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print Ticket</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ticket &amp; message are securely recorded in the public ledger.
              </span>
              <button
                type="button"
                onClick={() => setVerifiedDispatchDonation(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Ledger Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD CASH / MANUAL OFFLINE MODAL */}
      {isAddManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Record Cash / Offline Donation</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddManualOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualDonation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donor Full Name
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar Shrestha"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (NPR)
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={manualAmount}
                    onChange={e => setManualAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Channel
                  </label>
                  <select
                    value={manualMethod}
                    onChange={e => setManualMethod(e.target.value as PaymentMethodType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="cash">In-person Cash</option>
                    <option value="bank">Nepal SBI Bank</option>
                    <option value="esewa">eSewa Direct</option>
                    <option value="khalti">Khalti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Receipt / Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={manualRef}
                  onChange={e => setManualRef(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Well Wishes
                </label>
                <textarea
                  rows={2}
                  value={manualNote}
                  onChange={e => setManualNote(e.target.value)}
                  placeholder="Given at Neurigo360 clinic, hospital visit, etc."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddManualOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                >
                  Save &amp; Generate Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
