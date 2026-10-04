import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { resolveImageUrl } from '../utils/imageUtils';
import { getShareableCampaignUrl, getDomainDisplay, OFFICIAL_LIVE_URL } from '../utils/urlUtils';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Phone,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Eye,
  Info,
  Compass,
  ArrowRight,
  HelpCircle,
  Globe,
  Edit3
} from 'lucide-react';

interface MessengerShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessengerShareModal: React.FC<MessengerShareModalProps> = ({
  isOpen,
  onClose
}) => {
  const { campaign, updateCampaign, showToast } = useCampaign();
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick_share' | 'ios_fix' | 'preview' | 'how_to_copy'>('quick_share');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(campaign.livePublicUrl || OFFICIAL_LIVE_URL);

  if (!isOpen) return null;

  // The clean real public URL that opens smoothly in Messenger, iOS, and Android
  const cleanPublicUrl = getShareableCampaignUrl(campaign.livePublicUrl);
  const domainDisplay = getDomainDisplay(cleanPublicUrl);

  const shareTitle = `Support Bibek Bhandari · Spinal Cord Injury (D1-D5) Rehabilitation Fund`;
  
  const nepaliShareMessage = `🙏 विवेक भण्डारीको स्पाइनल कर्ड इन्जुरी (D1-D5 open laminectomy) उपचार तथा Neurigo360 Advance Neuro Rehab Centre (Greater Noida) मा Dr. Pratap Kunwar Singh र Dr. Shakal Dev Gonda को रेखदेखमा दैनिक फिजियोथेरापी सहयोग अभियान

👨‍⚕️ ओपन सर्जरी: Neurosurgeon Dr. Prakash Khetan (Guinness World Record Holder)
🏥 फिजियोथेरापी केन्द्र: Neurigo360, Greater Noida Paramount Golf Foreste

📱 प्रत्यक्ष सहयोग पठाउने खाता विवरण:
• eSewa / Khalti: 9861452923 (Bibek / Sashita Bhandari)
• Nepal SBI Bank Ltd: 20015243402269 (SASHITA RAJ BHANDARI, Hetauda Branch)
• १००% फेसबुक पारदर्शी अपडेट: https://www.facebook.com/share/1E1EVtPrPh/

🔗 पूर्ण मेडिकल रिपोर्ट, MRI स्क्यान र दैनिक फिजियोथेरापी भिडियो हेर्न:
👉 ${cleanPublicUrl}

(💡 iPhone / Messenger मा खोल्दा: माथि दायाँको ••• तीन थोप्ला थिचेर 'Open in Safari' छान्नुहोला 🙏)`;

  const englishShareMessage = `Please support Bibek Bhandari's spinal cord recovery journey after emergency open D1-D5 spine surgery by Neurosurgeon Dr. Prakash Khetan (Guinness World Record Holder). Daily intensive neuro-physiotherapy at Neurigo360 Advance Neuro Rehabilitation Centre (Greater Noida Paramount Golf Foreste) under Dr. Pratap Kunwar Singh (Founder/PT) & Dr. Shakal Dev Gonda (PT). Direct eSewa & Nepal SBI Bank support with 100% Facebook public transparency:

📱 Direct Donation Credentials:
• eSewa / Khalti ID: 9861452923 (Bibek / Sashita Bhandari)
• Nepal SBI Bank Ltd: 20015243402269 (SASHITA RAJ BHANDARI, Hetauda Branch)
• SWIFT: NSBINPKX

🔗 Full Medical Reports, MRI Scans & Daily Therapy Videos:
👉 ${cleanPublicUrl}

(💡 On iPhone / Messenger: Tap ••• at top-right & select 'Open in Safari' for instant smooth access)`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cleanPublicUrl);
    setCopied(true);
    showToast('Real official link copied! Ready to paste into Messenger or WhatsApp.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    let formatted = customUrlInput.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    updateCampaign({ livePublicUrl: formatted });
    setIsEditingUrl(false);
    showToast('Official live link updated!');
  };

  const handleResetToOfficialGithub = () => {
    updateCampaign({ livePublicUrl: OFFICIAL_LIVE_URL });
    setCustomUrlInput(OFFICIAL_LIVE_URL);
    setIsEditingUrl(false);
    showToast('Reset to official GitHub Pages link!');
  };

  const handleCopyNepaliMsg = () => {
    navigator.clipboard.writeText(nepaliShareMessage);
    setCopiedMsg(true);
    showToast('Copied Nepali message with public link & bank details!');
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: nepaliShareMessage,
          url: cleanPublicUrl
        });
        showToast('Shared successfully!');
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>iOS &amp; Android Compatible</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-300">Public Link</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Share Link to Messenger &amp; WhatsApp
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('quick_share')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quick_share'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Copy &amp; 1-Tap Share</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios_fix')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ml-3 sm:ml-5 ${
              activeTab === 'ios_fix'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Fix "Action Required" on iPhone</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ml-3 sm:ml-5 ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Photo &amp; Cover Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('how_to_copy')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ml-3 sm:ml-5 ${
              activeTab === 'how_to_copy'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span>How to Copy</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* TAB 1: QUICK SHARE & COPY */}
          {activeTab === 'quick_share' && (
            <div className="space-y-4">
              {/* Solution Alert */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900 text-xs">Official Permanent Live Link:</div>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    This link uses your permanent live website (<code className="font-mono font-bold bg-emerald-100 px-1 rounded">{domainDisplay}</code>) which opens smoothly for all your friends on Android &amp; iPhone without asking for login, and loads Bibek's photo and cover banner!
                  </p>
                </div>
              </div>

              {/* Main Copy Link Block */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real Public Link for Friends:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingUrl(!isEditingUrl)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingUrl ? 'Cancel Edit' : 'Custom Link'}</span>
                  </button>
                </div>

                {isEditingUrl ? (
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-2xl space-y-2">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Edit or Enter Your Live Website Link:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://your-domain.com/"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleSaveCustomUrl}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                      >
                        Save
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>Default: GitHub Pages Official Link</span>
                      <button
                        type="button"
                        onClick={handleResetToOfficialGithub}
                        className="text-emerald-700 hover:underline font-semibold"
                      >
                        Reset to Official GitHub Pages
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                    <span className="text-xs font-mono text-slate-900 truncate flex-1 select-all font-semibold">
                      {cleanPublicUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied Real Link!' : 'Copy Real Link'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 1-Tap Send Buttons */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-800">1-Tap Direct Sharing:</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Messenger */}
                  <a
                    href={`https://m.me/?text=${encodeURIComponent(nepaliShareMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via Messenger</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(nepaliShareMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </a>

                  {/* Facebook Share Dialog */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanPublicUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on Facebook</span>
                  </a>

                  {/* Copy Ready-Made Nepali Message */}
                  <button
                    type="button"
                    onClick={handleCopyNepaliMsg}
                    className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                  >
                    {copiedMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMsg ? 'Message Copied!' : 'Copy Nepali Message'}</span>
                  </button>
                </div>
              </div>

              {/* iPhone In-App Cookie Notice helper */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>Seeing <strong>"Action required to load your app"</strong> on iPhone?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('ios_fix')}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition-colors whitespace-nowrap"
                >
                  See 2-Second Fix &rarr;
                </button>
              </div>

              {/* Native Mobile Share Sheet */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Open Phone Share Sheet (Viber, Instagram, Telegram)</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: FIX FOR "ACTION REQUIRED TO LOAD YOUR APP" (MATCHING USER SCREENSHOT) */}
          {activeTab === 'ios_fix' && (
            <div className="space-y-4">
              {/* Screenshot Re-creation Callout */}
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-3xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    !
                  </div>
                  <div>
                    <h4 className="font-bold text-red-950 text-sm">
                      Did your friend see this screen in Messenger?
                    </h4>
                    <p className="text-xs text-red-700">
                      "Action required to load your app — browser is blocking a required security cookie"
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Why this happens:</strong> Apple's iOS has a privacy setting in Messenger's internal web browser that temporarily blocks cookies until confirmed.
                </p>

                {/* The Working Solution */}
                <div className="space-y-2.5 pt-1">
                  {/* Solution 1: Safari / Chrome */}
                  <div className="p-3.5 bg-white rounded-2xl border-2 border-emerald-400 shadow-xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>The 100% Working Fix: Tap ••• (three dots) &gt; "Open in Safari"</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Guaranteed</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        In the top-right corner of Messenger, tap the <strong>••• (three dots)</strong> menu and tap <strong>"Open in Safari"</strong> (or <strong>"Open in Chrome"</strong>). In Safari, the entire campaign, real photos, MRI reports, and videos will load with 100% full-screen perfection without any cookie prompt!
                      </p>
                    </div>
                  </div>

                  {/* Why button is unresponsive explanation */}
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Why the screen feels unresponsive on iPhone:</span>
                      <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                        Apple's iOS blocks popups inside Messenger's internal browser, so tapping "Authenticate in new window" does not respond. Opening in Safari completely bypasses this iOS restriction!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Bank & eSewa Fallback */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Direct Bank &amp; eSewa Details Included in Message:</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Our ready-made message already includes direct eSewa (9861452923) and SBI Bank Account details (20015243402269) so supporters can contribute even without opening any browser!
                </p>
                <button
                  type="button"
                  onClick={handleCopyNepaliMsg}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complete Message With Instructions</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CARD PREVIEW (PHOTO & COVER) */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Here is the real social preview card that Messenger, WhatsApp, and Facebook display when your link is shared:
              </div>

              {/* Realistic Social Preview Mockup */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-md bg-white">
                {/* Cover Image */}
                <div className="relative aspect-[1.91/1] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={resolveImageUrl(campaign.heroBanner || './images/bibek_cover_photo_real.webp')}
                    alt="Cover Photo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const fallback = 'https://i.postimg.cc/HxzVYR0H/fbafd65cd7b5e3bb597bfa2e50abb7e6.webp';
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/70 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Real Cover Photo Loaded</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-start gap-3">
                  <img
                    src={resolveImageUrl(campaign.creatorAvatar || './images/bibek_profile_real.jpg')}
                    alt="Bibek Bhandari"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    onError={(e) => {
                      const fallback = 'https://i.postimg.cc/mZ6gmQ8d/IMG-7096.jpg';
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider font-mono">
                      {domainDisplay}
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                      Bibek Bhandari · SCI Neuro-Rehabilitation &amp; Mobility Fund
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      Supporting Bibek Bhandari after open spine surgery by Dr. Prakash Khetan (Guinness World Record Holder) with daily physiotherapy at Neurigo360 Greater Noida under Dr. Pratap Kunwar Singh.
                    </div>
                  </div>
                </div>
              </div>

              {/* Cache Refresh Action for Facebook & Messenger */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Is Messenger still showing an old blank preview?</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Facebook &amp; Messenger save link previews in their cache. If you shared an old link previously, click below to tell Facebook's scraper to fetch the fresh cover and photo immediately:
                </p>
                <a
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(cleanPublicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <span>Open Facebook Sharing Debugger &amp; Scrape Fresh</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO COPY LINK INSTRUCTION */}
          {activeTab === 'how_to_copy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>How To Share Seamlessly With Donors &amp; Friends</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Your official live website is hosted at:
                  <br />
                  <code className="block mt-1 p-2 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-900 select-all">
                    {cleanPublicUrl}
                  </code>
                  This link has <strong>no login requirements</strong> and opens immediately on every iPhone, Android, and PC when shared through Facebook, Messenger, WhatsApp, or Viber.
                </p>
              </div>

              {/* The Correct Steps */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-900">How to get the smooth link every time:</div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="text-xs text-slate-700">
                    <strong>Never copy the browser address bar if it contains "ais-dev" or "run.app"</strong> — those are private runner environments that won't open for external friends.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="text-xs text-slate-700">
                    <strong>Click the "Copy Real Link" or "Share" button</strong> right here in the app to automatically copy your permanent website link.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="text-xs text-slate-700">
                    <strong>Paste the copied link in your Facebook post or Messenger chat</strong>. Friends will see Bibek's photo and cover banner instantly and can donate directly via eSewa and Nepal SBI Bank!
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Copy Official Live Link Now</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Direct Family Account · Zero Fees</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
