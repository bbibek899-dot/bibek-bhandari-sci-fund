import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { PaymentMethodType, Donation } from '../types/fundraising';
import { RealScannableQr } from './RealScannableQr';
import { X, Copy, Check, QrCode, Building, Wallet, ShieldCheck, Heart, Sparkles, Send, ExternalLink, Maximize2, Ticket, Share2, MessageCircle } from 'lucide-react';

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
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [amount, setAmount] = useState('1000');
  const [referenceId, setReferenceId] = useState('');
  const [message, setMessage] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'tiktok' | 'facebook' | 'whatsapp'>('facebook');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState<Donation | null>(null);

  if (!isOpen) return null;

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
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Danyabad! Thank You!</h4>
              <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Your contribution of <strong className="text-slate-900">NPR {parseFloat(amount).toLocaleString()}</strong> was logged with reference ID <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{referenceId}</span>.
              </p>
            </div>

            {/* Quick Actions Strip */}
            <div className="space-y-2 pt-2 text-left">
              <button
                onClick={handleOpenTicket}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Ticket className="w-4 h-4" />
                <span>View &amp; Save Official Donation Ticket</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleOpenThankYou}
                  className="py-2.5 px-3 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-pink-600" />
                  <span>Send Thank-You Note</span>
                </button>

                <button
                  onClick={handleOpenShare}
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Share on Messenger</span>
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>What happens next:</span>
              </div>
              <p>• {campaign.creatorName} and family will verify your reference with the bank/eSewa statement.</p>
              <p>• Your contribution will be publicly acknowledged on Bibek's verified Facebook page.</p>
              <p>• Your name will appear on the Supporters Wall on this portal.</p>
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
            {/* Payment Method Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Step 1: Choose Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('esewa')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'esewa'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center mx-auto mb-1">
                    eS
                  </div>
                  <span className="text-xs block truncate">eSewa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'bank'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto mb-1 font-bold text-[10px]">
                    SBI
                  </div>
                  <span className="text-xs block truncate">Nepal SBI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('fonepay')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'fonepay'
                      ? 'border-red-600 bg-red-50/70 text-red-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center mx-auto mb-1">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span className="text-xs block truncate">Fonepay QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('khalti')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedMethod === 'khalti'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-1">
                    KH
                  </div>
                  <span className="text-xs block truncate">Khalti</span>
                </button>
              </div>
            </div>

            {/* Payment Details & Real Transparent QR Code Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Step 2: Send Money via {selectedMethod.toUpperCase()} &amp; Real Scannable QR
              </div>

              {/* Real 100% Mathematically Scannable QR Component */}
              <RealScannableQr
                method={selectedMethod === 'bank' || selectedMethod === 'fonepay' ? 'bank' : 'esewa'}
                size={220}
                showDetails={true}
              />

              {/* 100% Facebook Transparency Guarantee */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">हाम्रो फेसबुक पारदर्शिता प्रतिबद्धता (Facebook Transparency):</span>{' '}
                  Bibek commits that every single penny received is posted publicly on his{' '}
                  <a
                    href={campaign.socialLinks.facebook || 'https://www.facebook.com/share/1E1EVtPrPh/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-blue-700 hover:text-blue-900"
                  >
                    Facebook Profile
                  </a>{' '}
                  with the donor's name and amount.
                </div>
              </div>
            </div>

            {/* Step 3: Submission Form */}
            <form onSubmit={handleSubmitProof} className="space-y-4 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Step 3: Submit Your Payment Proof
                </label>
                <span className="text-[11px] text-slate-500">Takes 15 seconds</span>
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
