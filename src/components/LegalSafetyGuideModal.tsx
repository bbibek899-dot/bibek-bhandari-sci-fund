import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Lock, Heart, ExternalLink, HelpCircle, Video, BookOpen } from 'lucide-react';

interface LegalSafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalSafetyGuideModal: React.FC<LegalSafetyGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'legality' | 'bank_safety' | 'therapist_consent' | 'video_guidelines' | 'disclaimer_text'>('legality');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Patient Legal, Safety & Medical Compliance Guide
              </h2>
              <p className="text-xs text-slate-300">
                How to legally, safely, and transparently fund your Spinal Cord Injury (SCI) recovery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto scrollbar-none shrink-0 gap-2 sm:gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('legality')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'legality'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Is It Legal?
          </button>
          <button
            onClick={() => setActiveSection('bank_safety')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'bank_safety'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Bank & eSewa Safety
          </button>
          <button
            onClick={() => setActiveSection('therapist_consent')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'therapist_consent'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Therapist Concern & Proof
          </button>
          <button
            onClick={() => setActiveSection('video_guidelines')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'video_guidelines'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Exercise Videos & Privacy
          </button>
          <button
            onClick={() => setActiveSection('disclaimer_text')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'disclaimer_text'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            5. Mandatory Legal Disclaimers
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed flex-1">
          
          {/* SECTION 1: LEGALITY */}
          {activeSection === 'legality' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm">Yes, Personal Medical Fundraising is 100% Legal</h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Asking friends, family, and followers for financial help to cover your own medical bills, surgeries, wheelchairs, and physical therapy sessions is legally considered <strong>Direct Personal Aid / Non-Commercial Medical Gifts</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Key Differences You Must Know:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-900 block mb-1">Your Campaign: Direct Personal Aid</span>
                    <ul className="space-y-1 text-slate-600 list-disc pl-4">
                      <li>Money goes directly to patient's personal bank / eSewa.</li>
                      <li>No NGO registration or bureaucratic permit needed.</li>
                      <li>Donations are voluntary gifts, not tax-deductible for donors.</li>
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-900 block mb-1">Registered Charity / NGO</span>
                    <ul className="space-y-1 text-slate-600 list-disc pl-4">
                      <li>Requires social welfare council approval & charity audits.</li>
                      <li>Can issue tax-deduction exemption certificates.</li>
                      <li>Takes 20–30% overhead and takes months to approve.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>The 3 Rules to Prevent Any Fraud Accusations or Legal Issues:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                  <li><strong>Never exaggerate or forge medical documents:</strong> Use the exact diagnosis from your hospital discharge summary (e.g., <em>T12-L1 Incomplete Spinal Cord Injury</em>).</li>
                  <li><strong>Upload Genuine Hospital & Clinic Receipts:</strong> Whenever you pay for physiotherapy sessions, catheters, or wheelchair equipment, photograph the billing invoice and upload it to the "Updates" tab.</li>
                  <li><strong>State Account Ownership Clearly:</strong> Explicitly state that the bank account belongs to you (or your direct family member/legal guardian).</li>
                </ol>
              </div>
            </div>
          )}

          {/* SECTION 2: BANK SAFETY */}
          {activeSection === 'bank_safety' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">How to Publicly Share Your Details Safely</h3>
              <p className="text-xs text-slate-600">
                You can safely post your account information on social media if you follow standard banking protocols:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SAFE to Share Publicly:</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                    <li><strong>Bank Name & Branch:</strong> (e.g. Nabil Bank, Maitidevi Branch)</li>
                    <li><strong>Account Holder Full Name:</strong> Must match your official citizenship / hospital card.</li>
                    <li><strong>Account Number:</strong> Safe because people can only <em>deposit</em> money into it.</li>
                    <li><strong>eSewa / Khalti Mobile Number:</strong> Safe for receiving wallet transfers.</li>
                    <li><strong>Fonepay / Mobile Banking QR code:</strong> Safe for direct scan & pay.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                  <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>NEVER Share With Anyone:</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                    <li><strong>One-Time Passwords (OTPs):</strong> Never give SMS codes to anyone claiming to "verify a donation".</li>
                    <li><strong>Mobile Banking PIN / Password:</strong> No legitimate donor ever needs your PIN.</li>
                    <li><strong>ATM Card 16-digit number, Expiry, or CVV:</strong> Donations never require your card numbers.</li>
                    <li><strong>"Receive Money Request":</strong> Beware of scammers sending an eSewa "collect request" pretending they are sending you money.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-100 p-3.5 rounded-xl text-xs text-slate-600">
                💡 <strong>Safety Pro-Tip:</strong> In your campaign settings, specify the transaction remarks advice: <em>"Please write 'Bibek SCI Rehab' in your eSewa or bank transfer remarks"</em> so you can easily reconcile statements.
              </div>
            </div>
          )}

          {/* SECTION 3: THERAPIST CONCERN */}
          {activeSection === 'therapist_consent' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">How to Feature Your Physiotherapist's Concern Legally</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Having your licensed neuro-physiotherapist or rehabilitation doctor mentioned gives <strong>massive credibility</strong> to your fundraiser. People donate 4x more when they see real clinical oversight.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Step 1: Get Written or Verbal Consent from Your Therapist</h4>
                <p className="text-xs text-slate-600">
                  During your next therapy session, tell your physiotherapist:
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs italic text-slate-700">
                  "Doctor, I am launching a community crowdfunding page to fund my ongoing 6 months of daily therapy and wheelchair equipment. Would you be comfortable if I quote your clinical recommendation note and mention our rehabilitation center name?"
                </div>
                <p className="text-xs text-slate-500">
                  95% of physiotherapists in Nepal and abroad are happy to support, as long as you do not claim they guarantee 100% cure.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Step 2: What to Include in the "Therapist Concern" Box</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                  <li><strong>Current Status:</strong> "Patient has active motor response in quadriceps / L2-L4 myotomes."</li>
                  <li><strong>The Clinical Need:</strong> "Requires 5x/week intensive neuro-rehab and standing frame balance."</li>
                  <li><strong>The Critical Risk (Urgency):</strong> "Gaps in therapy risk joint contractures, muscle atrophy, and loss of transfer independence."</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 4: EXERCISE VIDEOS */}
          {activeSection === 'video_guidelines' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">How to Film & Share Your Exercise Videos Ethically</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Short exercise videos showing your daily effort (towel-roll quad activations, wheelchair transfers, standing frame sessions) are the #1 driver of community empathy and donations on TikTok and Instagram.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-900">1. Protect Other Patients' Privacy</span>
                  <p className="text-slate-600">
                    When filming inside a hospital or rehabilitation gym (like SIRC Saanga), angle the camera so only YOU and your therapist's hands are visible. Never capture other patients' faces or medical charts in the background.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-900">2. Mandatory Exercise Medical Disclaimer</span>
                  <p className="text-slate-600">
                    Always add this one-line caption to your TikTok or Instagram videos:
                    <br />
                    <span className="italic font-mono text-[11px] text-slate-800">
                      "Prescribed specifically for my T12-L1 SCI recovery by my licensed physiotherapist. Please consult a doctor before attempting."
                    </span>
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-900">3. Document Real Progress, Not Just Sadness</span>
                  <p className="text-slate-600">
                    Audiences on TikTok and Reels love celebrating grit! Show the sweat, the struggle, and the small wins (e.g. <em>"Today I balanced for 10 seconds without holding the parallel bars"</em>).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: DISCLAIMER TEXT */}
          {activeSection === 'disclaimer_text' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Standard Legal Disclaimer for Your Page & Posts</h3>
              <p className="text-xs text-slate-600">
                You can copy-paste this standard legal disclaimer directly into your social media posts, Facebook notes, or print posters:
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  <strong>LEGAL NOTICE & MEDICAL DISCLOSURE:</strong><br />
                  This fundraiser is organized solely for personal medical and physical rehabilitation expenses for Bibek (Marcus), who is undergoing recovery for a T12-L1 Spinal Cord Injury (SCI) under clinical supervision.
                  <br /><br />
                  All contributions are voluntary personal gifts deposited directly into the patient's verified personal bank account and eSewa wallet. These contributions are not tax-deductible charitable donations under NGO provisions.
                  <br /><br />
                  Itemized clinical bills, therapy attendance receipts, and medical progress notes are maintained transparently on this portal for donor verification.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Need to update your clinical or bank details? Go to <strong>Creator Ledger &gt; Settings</strong>.
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
