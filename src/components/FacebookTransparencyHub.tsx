import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { getShareableCampaignUrl } from '../utils/urlUtils';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Heart,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
  Award,
  Ticket,
  MessageCircle
} from 'lucide-react';

export const FacebookTransparencyHub: React.FC = () => {
  const {
    campaign,
    donations,
    showToast,
    setActiveTicketDonation,
    setActiveThankYouDonation
  } = useCampaign();
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const verifiedDonations = donations.filter((d) => d.status === 'verified');
  const totalRaised = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);

  // Generate the formatted Facebook post text
  const generateFacebookPost = () => {
    const donorListText = verifiedDonations
      .slice(0, 15)
      .map(
        (d, idx) =>
          `${idx + 1}. ${d.isAnonymous ? 'शुभचिन्तक (Anonymous Supporter)' : d.donorName} - NPR ${d.amount.toLocaleString()} (${d.paymentMethod.toUpperCase()})`
      )
      .join('\n');

    return `🙏 सार्वजनिक धन्यवाद तथा आर्थिक पारदर्शिता (DONATION TRANSPARENCY UPDATE) 🙏

नमस्ते सबैमा, म विवेक भण्डारी (Bibek Bhandari), चन्द्रपुर, रौतहट, नेपाल। 
२०२२ जनवरीमा एक्कासी ढाडको गम्भीर समस्या (D1-D5 Laminectomy) भएपछि विगत केही वर्षदेखि म निरन्तर उपचार तथा पुनःस्थापनामा छु। हाल Neurigo360 मा डा. प्रताप (Dr. Pratap) को प्रत्यक्ष निगरानीमा मेरो दैनिक न्युरो-फिजियोथेरापी चलिरहेको छ।

हामीले वाचा गरेबमोजिम, हाम्रो अभियानमा प्राप्त भएको प्रत्येक एक-एक पैसाको पूर्ण पारदर्शिताका साथ हामी फेसबुकमा हिसाब सार्वजनिक गर्दैछौं।

📊 आर्थिक विवरण (Financial Summary):
• कुल संकलित रकम: NPR ${totalRaised.toLocaleString()}
• ३.५ वर्षे उपचार लक्ष्य: NPR ${campaign.targetAmount.toLocaleString()}
• हालसम्म सहयोग गर्नुहुने महानुभावहरूको संख्या: ${verifiedDonations.length} जना

❤️ हालै सहयोग प्रदान गर्नुहुने आदरणीय सहयोगीहरू:
${donorListText}

${verifiedDonations.length > 15 ? `...र अन्य ${verifiedDonations.length - 15} जना सहयोगी मित्रहरू!\n` : ''}
हाम्रो उपचार खर्चको मुख्य शीर्षकहरू:
१. दैनिक न्युरो-फिजियोथेरापी (Neurigo360 Advance Neuro Rehab Centre, Greater Noida - Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda): ४०%
२. क्लिनिक नजिकै अपाङ्गमैत्री बसोबास/कोठा भाडा: २०%
३. दैनिक औषधि तथा स्प्यास्टिसिटी/दिशा-पिसाब मेडिकल सामान: १५%
४. दैनिक अस्पताल तथा थेरापी आउजाउ यातायात: १३%
५. पोषणयुक्त खाना तथा मेडिकल उपकरणको बिजुली/महसुल: १२%

शल्यक्रिया: Neurosurgeon Dr. Prakash Khetan (Guinness Book of World Records Holder द्वारा गरिएको D1-D5 open laminectomy)

हाम्रो सिधा पारिवारिक बैंक तथा इसेवा खाता:
📱 eSewa ID: ${campaign.payments.esewaId} (${campaign.payments.esewaName})
🏦 Bank: ${campaign.payments.bankName}
🔢 A/C No: ${campaign.payments.accountNumber}
👤 Account Holder: ${campaign.payments.accountName} (${campaign.payments.branch})

🔗 आधिकारिक अभियान लिङ्क: ${getShareableCampaignUrl(campaign.livePublicUrl)}
👤 आधिकारिक फेसबुक: https://www.facebook.com/share/1E1EVtPrPh/

यहाँहरू सबैको माया, साथ र सहयोगको लागि म र मेरो परिवार सदैव ऋणी रहनेछौं। धन्यवाद!`;
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(generateFacebookPost());
    setCopiedPost(true);
    showToast('Facebook transparency post copied to clipboard!');
    setTimeout(() => setCopiedPost(false), 2500);
  };

  const handleCopyLink = () => {
    const url = campaign.socialLinks.facebook || 'https://www.facebook.com/share/1E1EVtPrPh/';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Facebook link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="py-6 space-y-6">
      {/* 100% Facebook Transparency Guarantee Hero Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-xs border border-blue-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Official Facebook Transparency Commitment
            </span>
            <span className="text-xs text-blue-200/80">Every Rupee Accounted For</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
            "हामीलाई सहयोग गर्नुहुने सबै महानुभावहरूको नाम र प्रत्येक पैसा फेसबुकमा सार्वजनिक गरिन्छ।"
          </h2>

          <p className="text-sm text-blue-100/90 leading-relaxed max-w-3xl">
            To ensure complete donor confidence, patient <strong>BIBEK BHANDARI</strong> and family commit that 
            <strong> 100% of contributions received via eSewa and Nepal SBI Bank </strong> 
            are published transparently on our official Facebook profile (<a 
              href="https://www.facebook.com/share/1E1EVtPrPh/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-300 hover:text-white underline font-semibold inline-flex items-center gap-1"
            >
              Bibek Bhandari Facebook Profile <ExternalLink className="w-3 h-3" />
            </a>) with the donor's name, contribution amount, and date.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyPost}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              {copiedPost ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPost ? 'Copied Post to Clipboard!' : 'Copy Today\'s Facebook Transparency Post'}</span>
            </button>

            <a
              href={campaign.socialLinks.facebook || 'https://www.facebook.com/share/1E1EVtPrPh/'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <span>Visit Official Facebook Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
            </a>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-white text-9xl font-black">
          FB
        </div>
      </div>

      {/* Key Transparency Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Total Publicly Verified</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            NPR {totalRaised.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Of NPR {campaign.targetAmount.toLocaleString()} target (3.5 years protocol)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Recognized Supporters</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {verifiedDonations.length} Donors
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            100% listed on Facebook &amp; Public Ledger
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Direct Family Accounts</span>
          </div>
          <div className="text-xs font-bold text-slate-800">
            eSewa: 9861452923
          </div>
          <div className="text-xs font-mono font-medium text-slate-600">
            SBI: 20015243402269 (Sashita Raj Bhandari)
          </div>
        </div>
      </div>

      {/* Public Donor Ledger with Facebook Recognition Badges */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Public Facebook Donor Recognition Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Every donor is recognized by name on Facebook as promised by Bibek Bhandari
            </p>
          </div>

          <button
            onClick={handleCopyPost}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Facebook Status</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {verifiedDonations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No verified donations recorded yet.
            </div>
          ) : (
            verifiedDonations.map((d) => (
              <div
                key={d.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {d.isAnonymous ? 'Anonymous Well-Wisher' : d.donorName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      <Check className="w-3 h-3 text-blue-600" />
                      Shared on Facebook
                    </span>
                  </div>

                  {d.message && (
                    <p className="text-xs text-slate-600 italic">
                      "{d.message}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span>{d.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase font-semibold text-slate-600">
                      {d.paymentMethod} ({d.referenceId})
                    </span>
                    {d.donorSocialHandle && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-blue-600 font-medium">
                          {d.donorSocialHandle}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      NPR {d.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      100% Direct to Rehabilitation
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => setActiveTicketDonation(d)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="View & Download Official Donation Ticket"
                    >
                      <Ticket className="w-3 h-3 text-emerald-600" />
                      <span>Ticket</span>
                    </button>

                    <button
                      onClick={() => setActiveThankYouDonation(d)}
                      className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Send Thank-You Message & Ask to Share"
                    >
                      <MessageCircle className="w-3 h-3 text-pink-500" />
                      <span>Thank &amp; Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
