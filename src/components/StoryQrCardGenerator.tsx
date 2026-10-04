import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useCampaign } from '../context/CampaignContext';
import { Donation } from '../types/fundraising';
import { resolveImageUrl } from '../utils/imageUtils';
import { Download, Copy, Check, Sparkles, Smartphone, QrCode, Heart, Share2, Layers, RefreshCw } from 'lucide-react';

export const StoryQrCardGenerator: React.FC = () => {
  const { campaign, totalVerifiedRaised, progressPercent, donations, showToast, selectedStoryDonation } = useCampaign();
  
  const [cardType, setCardType] = useState<'pitch_story' | 'shoutout' | 'payment_qr'>(
    selectedStoryDonation ? 'shoutout' : 'pitch_story'
  );
  const [selectedDonationId, setSelectedDonationId] = useState<string>(
    selectedStoryDonation?.id || (donations[0]?.id || '')
  );
  const [storyTheme, setStoryTheme] = useState<'dark' | 'emerald' | 'cream'>('dark');
  const [copied, setCopied] = useState(false);
  const [scannableQrUrl, setScannableQrUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(campaign.payments.esewaId || '9861452923', {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H'
    }).then(setScannableQrUrl).catch(console.error);
  }, [campaign.payments.esewaId]);

  const activeDonation = donations.find(d => d.id === selectedDonationId) || donations[0];

  const handleCopyStoryCopy = () => {
    let copyText = '';
    if (cardType === 'shoutout' && activeDonation) {
      copyText = `Huge heartfelt gratitude to ${activeDonation.donorName} for supporting my neuro-rehabilitation with NPR ${activeDonation.amount.toLocaleString()}! We have raised NPR ${totalVerifiedRaised.toLocaleString()} so far for my 3.5-year intensive therapy at Neurigo360 Advance Neuro Rehab Centre under Dr. Pratap Kunwar Singh. Tap link in bio to stand with me! ❤️🙏`;
    } else if (cardType === 'pitch_story') {
      copyText = `Fighting to walk again after sudden D1-D5 spinal injury and emergency open surgery by Dr. Prakash Khetan (Guinness World Record Holder). Daily therapy at Neurigo360 Greater Noida with Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda. Target: NPR 75 Lakhs. eSewa: ${campaign.payments.esewaId} / Nepal SBI Bank: ${campaign.payments.accountNumber}`;
    } else {
      copyText = `Scan to support Bibek Bhandari's SCI Recovery Fund! Accepts eSewa (${campaign.payments.esewaId}), Khalti (${campaign.payments.khaltiId}), and ${campaign.payments.bankName} (A/C: ${campaign.payments.accountNumber}, ${campaign.payments.accountName}). 100% direct personal medical fund.`;
    }

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    showToast('Copied story caption and tags to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getBackgroundStyle = () => {
    if (storyTheme === 'dark') {
      return 'bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white';
    }
    if (storyTheme === 'emerald') {
      return 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white';
    }
    return 'bg-gradient-to-b from-stone-100 via-white to-stone-200 text-slate-900';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Social Story & QR Asset Studio
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Generate pixel-perfect 9:16 Instagram/TikTok story graphics, thank-you shoutouts, and QR stickers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card Type Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              1. Select Asset Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCardType('pitch_story')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  cardType === 'pitch_story'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1.5 opacity-80" />
                <div className="font-semibold">Story Pitch</div>
                <div className="text-[10px] opacity-70 mt-0.5">Campaign progress card</div>
              </button>

              <button
                type="button"
                onClick={() => setCardType('shoutout')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  cardType === 'shoutout'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-4 h-4 mb-1.5 opacity-80" />
                <div className="font-semibold">Donor Shoutout</div>
                <div className="text-[10px] opacity-70 mt-0.5">Thank a supporter</div>
              </button>

              <button
                type="button"
                onClick={() => setCardType('payment_qr')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  cardType === 'payment_qr'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 mb-1.5 opacity-80" />
                <div className="font-semibold">eSewa / QR Card</div>
                <div className="text-[10px] opacity-70 mt-0.5">Scan to contribute</div>
              </button>
            </div>

            {/* If Shoutout, select which donor */}
            {cardType === 'shoutout' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Choose Supporter to Feature:
                </label>
                <select
                  value={selectedDonationId}
                  onChange={e => setSelectedDonationId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {donations.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.donorName} — NPR {d.amount.toLocaleString()} ({d.paymentMethod.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Theme switcher */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Visual Style:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStoryTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                    storyTheme === 'dark' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 inline-block" />
                  Midnight Cinema
                </button>
                <button
                  type="button"
                  onClick={() => setStoryTheme('emerald')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                    storyTheme === 'emerald' ? 'border-emerald-900 bg-emerald-900 text-white' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-emerald-700 inline-block" />
                  Forest Growth
                </button>
                <button
                  type="button"
                  onClick={() => setStoryTheme('cream')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                    storyTheme === 'cream' ? 'border-stone-900 bg-stone-900 text-white' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-stone-200 border border-stone-400 inline-block" />
                  Editorial Paper
                </button>
              </div>
            </div>
          </div>

          {/* Posting Instructions / Pro Tips */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>How to Post This on Instagram & TikTok</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Instagram Story:</strong> Take a screenshot of the 9:16 card on the right, open Instagram Stories, select the image, and add the native <strong>"LINK" sticker</strong> right over the designated link sticker zone!
              </li>
              <li>
                <strong>TikTok Video Overlay:</strong> Place this graphic in your CapCut / InShot editor as a 3-second closing call-to-action slide.
              </li>
              <li>
                <strong>Facebook Post:</strong> Post this high-resolution visual on Facebook and paste your campaign shortlink in the <em>first comment</em>.
              </li>
            </ul>

            <button
              onClick={handleCopyStoryCopy}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Story Caption Copied!' : 'Copy Matching Caption & Hashtags'}</span>
            </button>
          </div>
        </div>

        {/* Live Story Canvas Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-2">
            <span>9:16 Smartphone Ratio Preview</span>
            <span>·</span>
            <span>Ready for Stories & Reels</span>
          </div>

          {/* 9:16 Mockup Frame */}
          <div
            id="story-graphic-canvas"
            className={`w-[320px] sm:w-[360px] h-[580px] sm:h-[640px] rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden border border-slate-800 ${getBackgroundStyle()}`}
          >
            {/* Background subtle art overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white to-transparent" />

            {/* Top Bar of the Story Card */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={resolveImageUrl(campaign.creatorAvatar || './images/bibek_profile_real.jpg')}
                  alt={campaign.creatorName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = 'https://i.postimg.cc/mZ6gmQ8d/IMG-7096.jpg';
                    if (target.src !== fallback) target.src = fallback;
                  }}
                />
                <div>
                  <div className="text-xs font-bold leading-tight">{campaign.creatorName}</div>
                  <div className="text-[10px] opacity-70">{campaign.creatorHandle}</div>
                </div>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-xs">
                Neurigo360 Neuro-Rehab
              </div>
            </div>

            {/* Center Content depending on cardType */}
            <div className="relative z-10 my-auto py-4 space-y-4">
              {cardType === 'pitch_story' && (
                <div className="space-y-4 text-center">
                  <div className="w-full h-36 rounded-2xl overflow-hidden shadow-lg border border-white/10 relative">
                    <img
                      src={campaign.heroBanner}
                      alt="Campaign Hero"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                      <span className="text-xs font-semibold text-white drop-shadow">Bibek Bhandari · SCI Recovery</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold leading-snug tracking-tight">
                      3.5 Yrs Intensive Neuro-Rehabilitation &amp; Mobility
                    </h3>
                    <p className="text-xs opacity-80 mt-1 line-clamp-2">
                      Daily physiotherapy at Neurigo360 Greater Noida with Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda. Overcoming foot drop &amp; fighting to walk again.
                    </p>
                  </div>

                  {/* Progress Thermometer */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span>NPR {totalVerifiedRaised.toLocaleString()}</span>
                      <span className="text-emerald-400">{progressPercent}% Funded</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] opacity-70">
                      <span>Goal: NPR {campaign.targetAmount.toLocaleString()}</span>
                      <span>{campaign.daysRemaining} days left</span>
                    </div>
                  </div>
                </div>
              )}

              {cardType === 'shoutout' && activeDonation && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <Heart className="w-8 h-8 fill-current" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-widest font-semibold opacity-70">
                      Community Supporter Shoutout
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">
                      Thank You, {activeDonation.donorName}!
                    </h3>
                    {activeDonation.donorSocialHandle && (
                      <div className="text-xs text-emerald-400 font-mono">
                        {activeDonation.donorSocialHandle}
                      </div>
                    )}
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">
                      NPR {activeDonation.amount.toLocaleString()}
                    </div>
                    <div className="text-[11px] opacity-70 mt-1">
                      via {activeDonation.paymentMethod.toUpperCase()} (Ref: {activeDonation.referenceId})
                    </div>
                    {activeDonation.message && (
                      <p className="text-xs italic mt-3 pt-3 border-t border-white/10 opacity-90">
                        "{activeDonation.message}"
                      </p>
                    )}
                  </div>

                  <div className="text-xs opacity-80">
                    Brings our total to <span className="font-bold text-white">NPR {totalVerifiedRaised.toLocaleString()}</span> ({progressPercent}%)!
                  </div>
                </div>
              )}

              {cardType === 'payment_qr' && (
                <div className="space-y-4 text-center">
                  <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-xl max-w-[260px] mx-auto border border-white/20">
                    <div className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">
                      Scan with eSewa / Mobile Banking
                    </div>
                    <div className="w-44 h-44 bg-white rounded-xl p-1 mx-auto border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
                      <img
                        src={campaign.payments.esewaQrImage || scannableQrUrl}
                        alt="eSewa QR Code"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-xs font-mono font-bold text-slate-800">
                      eSewa ID: {campaign.payments.esewaId}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Name: {campaign.payments.esewaName}
                    </div>
                  </div>

                  <div className="text-xs opacity-90 font-medium">
                    Or direct {campaign.payments.bankName} transfer: <span className="font-mono text-emerald-400 font-bold">{campaign.payments.accountNumber}</span> ({campaign.payments.accountName})
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Designated Link Sticker Zone */}
            <div className="relative z-10 pt-2 border-t border-white/10 text-center">
              <div className="border-2 border-dashed border-white/30 rounded-xl p-2.5 bg-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mb-0.5">
                  👉 Place Instagram "Link" Sticker Here 👈
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 underline">
                  creatorfund.link/@{campaign.creatorHandle.replace('@', '')}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-3 text-center">
            Tip: Press Screenshot (Print Screen / Cmd+Shift+4) to save this story card!
          </div>
        </div>
      </div>
    </div>
  );
};
