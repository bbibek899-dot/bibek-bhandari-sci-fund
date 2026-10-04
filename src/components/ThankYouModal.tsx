import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Donation } from '../types/fundraising';
import { getShareableCampaignUrl } from '../utils/urlUtils';
import {
  X,
  Copy,
  Check,
  MessageCircle,
  Heart,
  Share2,
  Phone,
  Sparkles,
  Ticket,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

interface ThankYouModalProps {
  donation: Donation | null;
  onClose: () => void;
  onOpenTicket?: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  donation,
  onClose,
  onOpenTicket
}) => {
  const {
    campaign,
    totalVerifiedRaised,
    showToast,
    setActiveTicketDonation,
    markDonationThanked
  } = useCampaign();

  const [language, setLanguage] = useState<'nepali' | 'english'>('nepali');
  const [selectedChannel, setSelectedChannel] = useState<'messenger' | 'whatsapp' | 'sms' | 'viber' | 'facebook'>('messenger');
  const [copied, setCopied] = useState(false);

  if (!donation) return null;

  // Clean public campaign link that opens smoothly in Messenger/iOS/Android
  const campaignUrl = getShareableCampaignUrl(campaign.livePublicUrl);

  // Build thank-you message with explicit share request
  const nepaliMessage = `नमस्ते ${donation.donorName} ज्यु!

विवेक भण्डारीको स्पाइनल कर्ड इन्जुरी (Neurosurgeon Dr. Prakash Khetan - Guinness World Record Holder द्वारा गरिएको D1-D5 open laminectomy शल्यक्रिया) र Neurigo360 Advance Neuro Rehabilitation Centre (Greater Noida Paramount Golf Foreste) मा Dr. Pratap Kunwar Singh (Founder/PT) तथा Dr. Shakal Dev Gonda (PT) को रेखदेखमा दैनिक फिजियोथेरापीको लागि तपाईंले गर्नुभएको रु ${donation.amount.toLocaleString()} (${donation.paymentMethod.toUpperCase()} मार्फत, Ref: ${donation.referenceId}) को अमूल्य सहयोगको लागि हृदयदेखि नै धेरै धेरै धन्यवाद व्यक्त गर्दछौं।

तपाईंको यो साथले विवेकलाई फेरि आफ्नै खुट्टामा उभिने र हिँड्ने नयाँ जीवन र आशा दिएको छ। हामी तपाईंको यो सहयोगलाई १००% पारदर्शी रूपमा फेसबुकमा पनि सम्मानसहित सार्वजनिक गर्दैछौं।

कृपया यो अभियानको लिंक आफ्ना साथीभाइ, आफन्त र ग्रुपहरूमा पनि सेयर गरिदिनुहुन हार्दिक अनुरोध गर्दछौं, ताकि विवेकले आफ्नो ३.५ वर्षको सम्पूर्ण उपचार पूरा गर्न सकोस्:
🔗 ${campaignUrl}
(iPhone / Messenger मा 'Action required' देखिएमा 'Authenticate in new window' थिच्नुहोला वा माथि दायाँको ••• थिचेर 'Open in Safari' छान्नुहोला 🙏)

सशीता राज भण्डारी तथा विवेक भण्डारी परिवार 🙏
फोन/eSewa: 9861452923`;

  const englishMessage = `Dear ${donation.donorName},

Heartfelt thank you for your generous medical contribution of NPR ${donation.amount.toLocaleString()} (via ${donation.paymentMethod.toUpperCase()}, Reference: ${donation.referenceId}) supporting Bibek Bhandari's spinal cord neuro-rehabilitation at Neurigo360 Advance Neuro Rehabilitation Centre (Greater Noida Paramount Golf Foreste) under Dr. Pratap Kunwar Singh (BPT., MPT. - Founder/PT) & Dr. Shakal Dev Gonda (BPT., MPT.), following emergency open D1-D5 spine surgery by Neurosurgeon Dr. Prakash Khetan (Guinness Book of World Records Holder).

Your compassion gives Bibek real hope to overcome paralysis and walk independently again. Every single rupee is documented with 100% Facebook public transparency.

Could you please share this campaign link with your family, friends, and social network too? Your share will help Bibek reach more compassionate hearts:
🔗 ${campaignUrl}
(iPhone / Messenger note: If you see 'Action required', tap 'Authenticate in new window' or tap ••• at top-right & select 'Open in Safari')

With profound gratitude,
Sashita Raj Bhandari & Bibek Bhandari
Official Rehabilitation Portal: ${campaignUrl}`;

  const messageText = language === 'nepali' ? nepaliMessage : englishMessage;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    markDonationThanked(donation.id);
    showToast('Copied Thank-You & Share Request to clipboard! 🙏');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTicket = () => {
    setActiveTicketDonation(donation);
    if (onOpenTicket) {
      onOpenTicket();
    }
  };

  const handleChannelAction = (channel: 'messenger' | 'whatsapp' | 'sms' | 'viber' | 'facebook') => {
    setSelectedChannel(channel);
    markDonationThanked(donation.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                Direct Donor Gratitude
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Thank-You &amp; Share Message Generator
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Donor Info Strip */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{donation.donorName}</span>
              {donation.donorSocialHandle && (
                <span className="text-blue-600 font-mono">({donation.donorSocialHandle})</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-700">{donation.paymentMethod.toUpperCase()}</span>
              <span>·</span>
              <span className="font-mono text-slate-500">{donation.referenceId}</span>
              <span>·</span>
              <span className="font-bold text-emerald-700 text-sm">
                NPR {donation.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Language
              </label>
              <span className="text-[11px] text-slate-500">
                Includes explicit request to share with friends
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('nepali')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  language === 'nepali'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>हृदयस्पर्शी नेपाली (Nepali)</span>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('english')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  language === 'english'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>International English</span>
              </button>
            </div>
          </div>

          {/* Formatted Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Personalized Message &amp; Share Call-to-Action:
              </label>
              <span className="text-[11px] text-emerald-700 font-medium">Ready to send</span>
            </div>
            <textarea
              readOnly
              rows={7}
              value={messageText}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans focus:outline-none"
            />
          </div>

          {/* 1-Tap Direct Channels */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>1-Tap Send Direct to Donor:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Facebook Messenger */}
              <a
                href={`https://m.me/?text=${encodeURIComponent(messageText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleChannelAction('messenger')}
                className="py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Messenger</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleChannelAction('whatsapp')}
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}&quote=${encodeURIComponent(messageText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleChannelAction('facebook')}
                className="py-2.5 px-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>

              {/* SMS / Viber */}
              <a
                href={`sms:?body=${encodeURIComponent(messageText)}`}
                onClick={() => handleChannelAction('sms')}
                className="py-2.5 px-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Direct SMS</span>
              </a>
            </div>
          </div>

          {/* Action Row: Copy & Open Ticket */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleCopyMessage}
              className="w-full sm:flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-98 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Thank-You & Share Request'}</span>
            </button>

            <button
              onClick={handleOpenTicket}
              className="w-full sm:w-auto py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>View Official Donation Ticket</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
