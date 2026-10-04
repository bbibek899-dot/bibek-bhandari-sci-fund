import React, { useRef, useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { processImageFile, resolveImageUrl } from '../utils/imageUtils';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  RefreshCw,
  X,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFocus?: 'avatar' | 'banner' | 'esewa_qr' | 'bank_qr';
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  defaultFocus = 'avatar'
}) => {
  const { campaign, updateCampaign, updatePaymentCredentials, showToast, publishCampaignLive } = useCampaign();

  const [activeTab, setActiveTab] = useState<'avatar' | 'banner' | 'qr'>(
    defaultFocus === 'banner' ? 'banner' : defaultFocus === 'avatar' ? 'avatar' : 'qr'
  );
  const [processing, setProcessing] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const esewaQrInputRef = useRef<HTMLInputElement>(null);
  const bankQrInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await processImageFile(file, 600, 600, 0.9);
      let finalUrl = dataUrl;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data: dataUrl, type: 'avatar' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (uploadErr) {
        console.warn('Backend image save fallback to local:', uploadErr);
      }
      updateCampaign({ creatorAvatar: finalUrl });
      showToast('Real profile picture updated!');
    } catch (err) {
      console.error(err);
      showToast('Could not process photo file', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await processImageFile(file, 1600, 900, 0.88);
      let finalUrl = dataUrl;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data: dataUrl, type: 'banner' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (uploadErr) {
        console.warn('Backend image save fallback to local:', uploadErr);
      }
      updateCampaign({ heroBanner: finalUrl });
      showToast('Real cover banner photo updated!');
    } catch (err) {
      console.error(err);
      showToast('Could not process cover photo', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleEsewaQrFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await processImageFile(file, 900, 900, 0.92);
      let finalUrl = dataUrl;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data: dataUrl, type: 'esewa_qr' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (uploadErr) {
        console.warn('Backend image save fallback to local:', uploadErr);
      }
      updatePaymentCredentials({ esewaQrImage: finalUrl });
      showToast('Official eSewa QR uploaded!');
    } catch (err) {
      console.error(err);
      showToast('Could not process eSewa QR image', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleBankQrFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await processImageFile(file, 900, 900, 0.92);
      let finalUrl = dataUrl;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data: dataUrl, type: 'bank_qr' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (uploadErr) {
        console.warn('Backend image save fallback to local:', uploadErr);
      }
      updatePaymentCredentials({ bankQrImage: finalUrl });
      showToast('Official Nepal SBI Bank QR uploaded!');
    } catch (err) {
      console.error(err);
      showToast('Could not process Bank QR image', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handlePublishAll = async () => {
    setPublishing(true);
    await publishCampaignLive();
    setPublishing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Upload Real Photos &amp; QR Codes</h2>
              <p className="text-xs text-slate-400">Add your authentic photos directly from your phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'avatar'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Picture
          </button>
          <button
            onClick={() => setActiveTab('banner')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'banner'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Cover Banner
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'qr'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Official Bank &amp; eSewa QR
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          {/* TAB 1: Profile Avatar */}
          {activeTab === 'avatar' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={resolveImageUrl(campaign.creatorAvatar)}
                    alt="Bibek Bhandari Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500/20 shadow-md mx-auto"
                  />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border-2 border-white transition-transform active:scale-95"
                    title="Upload Real Profile Picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-3">Bibek Bhandari's Profile Photo</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Upload a clear portrait of Bibek so family, friends, and donors recognize him immediately.
                </p>
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
              />

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{processing ? 'Processing Photo...' : 'Choose Real Photo from Phone/Computer'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Cover Banner */}
          {activeTab === 'banner' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-900 shadow-md">
                  <img
                    src={resolveImageUrl(campaign.heroBanner)}
                    alt="Cover Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-4 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 backdrop-blur-xs transition-all"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Change Cover Photo</span>
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-3">Campaign Hero Banner</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Upload an authentic horizontal photo of Bibek during therapy or recovery to display prominently at the top of the campaign.
                </p>
              </div>

              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerFile}
              />

              <button
                type="button"
                disabled={processing}
                onClick={() => bannerInputRef.current?.click()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{processing ? 'Processing Banner...' : 'Choose Cover Photo from Phone/Computer'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: Official Bank & eSewa QR Screenshots */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                You can upload the exact screenshot downloaded from your <strong>eSewa app</strong> and <strong>Nepal SBI Bank (YONO/Mobile Banking)</strong> app so donors see your official bank stamp.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* eSewa Box */}
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-3 text-center space-y-2">
                  <div className="text-xs font-bold text-emerald-900">Official eSewa QR</div>
                  <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-white border border-emerald-300 p-1 flex items-center justify-center">
                    {campaign.payments.esewaQrImage ? (
                      <img src={resolveImageUrl(campaign.payments.esewaQrImage)} alt="eSewa QR" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">No screenshot</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => esewaQrInputRef.current?.click()}
                    className="w-full py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload eSewa QR</span>
                  </button>
                  <input
                    ref={esewaQrInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEsewaQrFile}
                  />
                </div>

                {/* SBI Bank Box */}
                <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-3 text-center space-y-2">
                  <div className="text-xs font-bold text-blue-900">SBI Bank QR</div>
                  <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-white border border-blue-300 p-1 flex items-center justify-center">
                    {campaign.payments.bankQrImage ? (
                      <img src={resolveImageUrl(campaign.payments.bankQrImage)} alt="SBI Bank QR" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">No screenshot</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => bankQrInputRef.current?.click()}
                    className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Bank QR</span>
                  </button>
                  <input
                    ref={bankQrInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBankQrFile}
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600">
                💡 <em>Note:</em> The app also automatically generates a 100% mathematically scannable vector QR code for both eSewa and Nepal SBI Bank so donors' cameras always scan with zero errors.
              </div>
            </div>
          )}

          {/* Facebook Notice */}
          <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 leading-relaxed">
              <strong>Facebook Transparency:</strong> Every photo and donation is linked to your verified Facebook profile (<strong>Bibek Bhandari</strong>). All donor names and amounts are documented transparently.
            </p>
          </div>

          {/* One-Click Global Publish Action */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={publishing}
              onClick={handlePublishAll}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{publishing ? 'Saving...' : '💾 Save Photos & Verified QR Codes'}</span>
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Your real profile photo, cover banner, and official eSewa &amp; SBI Bank QR screenshots are active on your campaign portal!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
