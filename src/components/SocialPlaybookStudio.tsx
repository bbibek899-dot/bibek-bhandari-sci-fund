import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { socialStrategyGuides, socialScriptTemplates } from '../data/socialTemplates';
import { Copy, Check, Sparkles, Instagram, Facebook, Share2, HelpCircle, ArrowRight, ShieldCheck, Zap, MessageSquare, ExternalLink } from 'lucide-react';

export const SocialPlaybookStudio: React.FC = () => {
  const { campaign, totalVerifiedRaised, progressPercent, showToast, setCurrentView } = useCampaign();
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'facebook'>('instagram');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    socialScriptTemplates.find(t => t.platform === 'instagram')?.id || 'ig_bio_1'
  );
  const [copied, setCopied] = useState(false);

  const activeStrategy = socialStrategyGuides.find(s => s.platform === selectedPlatform)!;
  const platformTemplates = socialScriptTemplates.filter(t => t.platform === selectedPlatform);
  const activeTemplate = socialScriptTemplates.find(t => t.id === selectedTemplateId) || platformTemplates[0];

  const formatContent = (raw: string) => {
    return raw
      .replace(/{CAMPAIGN_URL}/g, `https://creatorfund.link/@${campaign.creatorHandle.replace('@', '')}`)
      .replace(/{CREATOR_NAME}/g, campaign.creatorName)
      .replace(/{CREATOR_HANDLE}/g, campaign.creatorHandle)
      .replace(/{ESEWA_ID}/g, campaign.payments.esewaId)
      .replace(/{BANK_ACC}/g, campaign.payments.accountNumber)
      .replace(/{BANK_BRANCH}/g, campaign.payments.branch)
      .replace(/{NAME}/g, '[Name]')
      .replace(/{TOTAL_RAISED}/g, `NPR ${totalVerifiedRaised.toLocaleString()}`)
      .replace(/{TARGET_AMOUNT}/g, `NPR ${campaign.targetAmount.toLocaleString()}`);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organic Social Growth System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How to Apply This Toolkit to Facebook, Instagram & TikTok Naturally
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            The biggest mistake small creators make is posting sterile "Please donate" links that algorithms penalize.
            Here is the exact step-by-step playbook to weave your campaign into your daily social media presence without feeling salesy or spammy.
          </p>
        </div>
      </div>

      {/* Platform Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            setSelectedPlatform('instagram');
            const first = socialScriptTemplates.find(t => t.platform === 'instagram');
            if (first) setSelectedTemplateId(first.id);
          }}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            selectedPlatform === 'instagram'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-pink-300" />
          <span>Instagram Playbook</span>
        </button>

        <button
          onClick={() => {
            setSelectedPlatform('tiktok');
            const first = socialScriptTemplates.find(t => t.platform === 'tiktok');
            if (first) setSelectedTemplateId(first.id);
          }}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            selectedPlatform === 'tiktok'
              ? 'bg-cyan-700 text-white shadow-md shadow-cyan-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-300" />
          <span>TikTok Algorithm Playbook</span>
        </button>

        <button
          onClick={() => {
            setSelectedPlatform('facebook');
            const first = socialScriptTemplates.find(t => t.platform === 'facebook');
            if (first) setSelectedTemplateId(first.id);
          }}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            selectedPlatform === 'facebook'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-300" />
          <span>Facebook Community Playbook</span>
        </button>
      </div>

      {/* Main Strategy Guide & Golden Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4-Step Strategy Protocol */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {activeStrategy.platformName} Organic Protocol
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Zero Algorithm Penalty
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {activeStrategy.oneLiner}
              </h2>
            </div>

            {/* Core Golden Rule Box */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">The Golden Rule for {activeStrategy.platformName}:</strong>
                {activeStrategy.keyRule}
              </div>
            </div>

            {/* 4 Execution Steps */}
            <div className="space-y-4 pt-2">
              {activeStrategy.steps.map(step => (
                <div
                  key={step.stepNumber}
                  className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 space-y-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 pl-8">
                    Action: {step.action}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {step.details}
                  </p>

                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-100 rounded-lg p-2 ml-8">
                    💡 <strong>Pro-Tip:</strong> {step.proTip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Script & Caption Generator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Ready-To-Copy Social Scripts</span>
              </h3>
              <span className="text-[11px] text-slate-400">Customized to your goal</span>
            </div>

            {/* Template Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 block">
                Choose Script Type:
              </label>
              <div className="flex flex-col gap-1.5">
                {platformTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedTemplateId === tpl.id
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tpl.title}</span>
                      <span className="text-[10px] opacity-70 uppercase font-mono">{tpl.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rendered Template Box */}
            {activeTemplate && (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-500">
                  {activeTemplate.description}
                </p>

                <div className="relative">
                  <textarea
                    readOnly
                    rows={10}
                    value={formatContent(activeTemplate.content)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:outline-none"
                  />
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg">
                  📌 <strong>Recommendation:</strong> {activeTemplate.proTip}
                </div>

                <button
                  onClick={() => handleCopyText(formatContent(activeTemplate.content), activeTemplate.title)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Script / Caption'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick jump to Story Studio */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/70 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-900">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Need Ready-to-Post Visual Story Graphics?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use our built-in 9:16 Story Card & QR generator to export pixel-perfect slides for your Instagram Stories and TikTok video overlays.
            </p>
            <button
              onClick={() => setCurrentView('qr_story_generator')}
              className="w-full py-2 px-3 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Story & QR Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
