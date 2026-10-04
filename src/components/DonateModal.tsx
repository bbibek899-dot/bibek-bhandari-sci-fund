import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { PaymentMethodType, Donation } from '../types/fundraising';
import { RealScannableQr } from './RealScannableQr';
import { getShareableCampaignUrl } from '../utils/urlUtils';
import { X, Copy, Check, QrCode, Building, Wallet, ShieldCheck, Heart, Sparkles, Send, ExternalLink, Maximize2, Ticket, Share2, MessageCircle, Phone, Award, CheckCircle2 } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const {
    campaign,
    addDonation,
    showToast,
    triggerCelebration,
    setActiveTicketDonation,
    setActiveThankYouDonation,
    setIsShareModalOpen
  } = useCampaign();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('esewa');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form states
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [amount, setAmount] = useState('1000');
  const [referenceId, setReferenceId] = useState('');
  const [message, setMessage] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'tiktok' | 'facebook' | 'whatsapp'>('whatsapp');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState<Donation | null>(null);
  const [thankYouCopied, setThankYouCopied] = useState(false);

  if (!isOpen) return null;

  const campaignUrl = getShareableCampaignUrl(campaign.livePublicUrl);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString());
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      showToast('Please enter a valid contribution amount', 'error');
      return;
    }
    if (!referenceId.trim()) {
      showToast('Please enter the transaction reference or transaction code', 'error');
      return;
    }

    const newDonationObj: Donation = {
      id: `don_${Date.now()}`,
      donorName: isAnonymous ? 'Kind Supporter' : (donorName.trim() || 'Supporter'),
      isAnonymous,
      amount: parsedAmount,
      currency: campaign.currency,
      paymentMethod: selectedMethod,
      referenceId: referenceId.trim(),
      message: message.trim() || undefined,
      timestamp: new Date().toISOString(),
      status: 'pending',
      donorPhone: donorPhone.trim() || undefined,
      donorSocialHandle: socialHandle.trim() || undefined,
      donorSocialPlatform: socialPlatform,
      ticketNumber: `NEPAL-SCI-2026-${referenceId.trim().slice(-6).toUpperCase() || '88219A'}`
    };

    addDonation(newDonationObj);
    setSubmittedDonation(newDonationObj);
    setIsSubmitted(true);
    triggerCelebration();
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedDonation(null);
    setDonorName('');
    setDonorPhone('');
    setReferenceId('');
    setMessage('');
    setSocialHandle('');
    onClose();
  };

  const handleOpenTicket = () => {
    if (submittedDonation) {
      setActiveTicketDonation(submittedDonation);
      onClose();
    }
  };

  const handleOpenThankYou = () => {
    if (submittedDonation) {
      setActiveThankYouDonation(submittedDonation);
      onClose();
    }
  };

  const handleOpenShare = () => {
    setIsShareModalOpen(true);
    onClose();
  };

  // Generate thank you message text
  const thankYouTextNepali = submittedDonation
    ? `नमस्ते ${submittedDonation.donorName} ज्यु! विवेक भण्डारीको स्पाइनल कर्ड इन्जुरी (D1-D5 open laminectomy) उपचार तथा Neurigo360 Advance Neuro Rehabilitation Centre (Greater Noida Paramount Golf Foreste) मा Dr. Pratap Kunwar Singh र Dr. Shakal Dev Gonda को रेखदेखमा दैनिक फिजियोथेरापीको लागि तपाईंले गर्नुभएको रु ${submittedDonation.amount.toLocaleString()} (${submittedDonation.paymentMethod.toUpperCase()} मार्फत, Ref: ${submittedDonation.referenceId}) को अमूल्य सहयोगको लागि हृदयदेखि नै धेरै धेरै धन्यवाद! तपाईंको सहयोग हाम्रो पारदर्शी फेसबुक पेजमा पनि सम्मानपूर्वक सार्वजनिक गरिएको छ। 🔗 ${campaignUrl}`
    : '';

  const handleCopyThankYouNote = () => {
    navigator.clipboard.writeText(thankYouTextNepali);
    setThankYouCopied(true);
    showToast('Copied personalized Thank-You note to clipboard!');
    setTimeout(() => setThankYouCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              {isSubmitted ? 'Payment Proof Submitted!' : 'Direct Medical Contribution'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              100% direct to {campaign.creatorName} &amp; Family Account (No platform cuts)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facebook Transparency Commitment Banner */}
        <div className="px-4 py-2.5 bg-blue-50/90 border-b border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold text-blue-950">Facebook Public Accountability Pledge:</span> Every single penny is accounted for. Verified donor names &amp; amounts are published with gratitude on{' '}
            <a
              href="https://www.facebook.com/share/1E1EVtPrPh/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-blue-800 hover:text-blue-900 inline-flex items-center gap-0.5"
            >
              <span>Bibek's Facebook</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {' '}(unless marked Anonymous).
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Header Success State */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-7 h-7 fill-emerald-600 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Danyabad! Thank You From My Heart!</h4>
                <p className="text-xs text-slate-600 mt-0.5 max-w-sm mx-auto">
                  Your direct contribution of <strong className="text-slate-900">NPR {parseFloat(amount).toLocaleString()}</strong> has been recorded under Reference <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">{referenceId}</span>.
                </p>
              </div>
            </div>

            {/* Official Digital Thank-You & Appreciation Certificate Card */}
            <div className="bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/90 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-sm text-left relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                      Official Certificate of Appreciation
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Bibek Bhandari SCI Recovery Fund
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  {submittedDonation?.ticketNumber || 'VERIFIED-DONOR'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-800 leading-relaxed">
                <p className="font-medium">
                  "आदरणीय <strong className="text-slate-950 font-bold">{submittedDonation?.donorName}</strong> ज्यु, तपाईंले मेरो स्पाइनल कर्ड इन्जुरी (D1-D5 open laminectomy) उपचार तथा <strong>Neurigo360 Advance Neuro Rehabilitation Centre, Greater Noida</strong> मा <strong>Dr. Pratap Kunwar Singh (Founder/PT)</strong> र <strong>Dr. Shakal Dev Gonda (PT)</strong> को प्रत्यक्ष रेखदेखमा दैनिक फिजियोथेरापीको लागि गर्नुभएको <strong>रु {submittedDonation?.amount.toLocaleString()}</strong> को सहयोगको लागि सशीता राज भण्डारी तथा विवेक भण्डारी परिवार हृदयदेखि नै कृतज्ञता व्यक्त गर्दछौं।"
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Surgical Care: Dr. Prakash Khetan (Guinness World Record Holder)</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Direct Thank You Actions */}
            <div className="space-y-2 pt-1 text-left">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Gratitude &amp; Receipt Options:</span>
              </div>

              {/* Action 1: Send on WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${(submittedDonation?.donorPhone || '').replace(/[^0-9]/g, '') || '9779861452923'}?text=${encodeURIComponent(thankYouTextNepali)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>1-Tap WhatsApp Thank-You</span>
                </a>

                <a
                  href={`https://wa.me/9779861452923?text=${encodeURIComponent(`नमस्ते विवेक जी! मैले तपाईंको स्पाइनल कर्ड इन्जुरी उपचार अभियानको लागि रु ${parseFloat(amount).toLocaleString()} (${selectedMethod.toUpperCase()}) सहयोग पठाएको छु। Reference ID: ${referenceId}। मेरो नाम: ${donorName.trim() || 'Supporter'}। स्वास्थ्यलाभको कामना गर्दछु!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>Confirm with Bibek (+977 9861452923)</span>
                </a>
              </div>

              {/* Action 2: View Ticket & Copy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleOpenTicket}
                  className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4 text-blue-700" />
                  <span>Save Official Donation Ticket</span>
                </button>

                <button
                  onClick={handleCopyThankYouNote}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  {thankYouCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{thankYouCopied ? 'Copied Thank-You Note!' : 'Copy Thank-You Text'}</span>
                </button>
              </div>

              {/* Action 3: Social Share */}
              <button
                onClick={handleOpenShare}
                className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-700" />
                <span>Share Campaign Link on Messenger / WhatsApp</span>
              </button>
            </div>

            {/* Clarification Box: How Thank-You Works */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Will a thank you message be sent to you?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-900">
                <strong>YES!</strong> Because eSewa and bank transfers are direct personal transfers, our portal has instantly generated your official Appreciation Certificate above. You can tap the <strong>WhatsApp</strong> button above to receive or forward it right away. In addition, your contribution is honored publicly on <strong>Bibek's Facebook Transparency Ledger</strong> and listed on the live Supporters Wall.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Back to Campaign
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Clean Direct Payment Method Switcher */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Official QR &amp; Account
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">100% Direct Family Account</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('esewa')}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex items-center justify-center gap-2.5 ${
                    selectedMethod === 'esewa'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    eS
                  </div>
                  <div className="text-left">
                    <span className="text-xs block font-bold text-slate-900">Official eSewa QR</span>
                    <span className="text-[10px] text-slate-500 block">ID: 9861452923</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex items-center justify-center gap-2.5 ${
                    selectedMethod === 'bank'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    SBI
                  </div>
                  <div className="text-left">
                    <span className="text-xs block font-bold text-slate-900">Nepal SBI Bank QR</span>
                    <span className="text-[10px] text-slate-500 block">A/C: 20015243402269</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Official Real Scannable QR Code */}
            <div>
              <RealScannableQr
                method={selectedMethod === 'bank' || selectedMethod === 'fonepay' ? 'bank' : 'esewa'}
                size={240}
                showDetails={true}
              />
            </div>

            {/* 100% Facebook Transparency Guarantee */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <span className="font-bold">Facebook Public Transparency:</span>{' '}
                Bibek publicly acknowledges every single rupee received on his{' '}
                <a
                  href={campaign.socialLinks.facebook || 'https://www.facebook.com/share/1E1EVtPrPh/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-blue-700 hover:text-blue-900"
                >
                  Facebook Profile
                </a>{' '}
                with donor name &amp; receipt verification.
              </div>
            </div>

            {/* Submission Form (Clear & Simple) */}
            <form onSubmit={handleSubmitProof} className="space-y-4 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Log Your Contribution Proof (Optional)
                </label>
                <span className="text-[11px] text-slate-500 font-medium">To appear on donor wall</span>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Amount Sent (NPR)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[500, 1000, 2500, 5000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetAmount(val)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        amount === val.toString()
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Rs. {val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">NPR</span>
                  <input
                    type="number"
                    required
                    min="50"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent tabular-nums"
                  />
                </div>
              </div>

              {/* Donor Name & Anonymous Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Name (for Wall & Credits)
                  </label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    placeholder={isAnonymous ? 'Supporter (Anonymous)' : 'e.g. Binod KC'}
                    className={`w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      isAnonymous ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
                    }`}
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <label htmlFor="anonCheck" className="text-xs text-slate-500 cursor-pointer">
                      Keep my name anonymous
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Transaction ID / Ref Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceId}
                    onChange={e => setReferenceId(e.target.value)}
                    placeholder="e.g. ESW-8472910 or bank ref"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Found in your eSewa receipt or bank SMS
                  </span>
                </div>
              </div>

              {/* WhatsApp or Mobile Number for Instant Thank-You & Ticket */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your WhatsApp / Mobile Number (For Direct Thank-You)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Instant Gratitude
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={e => setDonorPhone(e.target.value)}
                    placeholder="e.g. 9861452923 or +977..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  A personalized Thank-You card and official donation receipt will be addressed to you!
                </span>
              </div>

              {/* Social Handle for Auto Thank-You */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={socialPlatform}
                    onChange={e => setSocialPlatform(e.target.value as any)}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Handle / Phone (for personal shoutout)
                  </label>
                  <input
                    type="text"
                    value={socialHandle}
                    onChange={e => setSocialHandle(e.target.value)}
                    placeholder="@yourhandle or 98..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Message of Encouragement */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Message of Encouragement (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g. Keep inspiring through your storytelling!"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Contribution Proof</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
