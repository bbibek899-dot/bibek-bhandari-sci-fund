import React, { useState, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { RecoveryPhoto } from '../types/fundraising';
import { processImageFile } from '../utils/imageUtils';
import {
  Camera,
  Upload,
  Plus,
  X,
  Maximize2,
  Calendar,
  MapPin,
  Heart,
  Eye,
  ShieldCheck,
  Sparkles,
  Download
} from 'lucide-react';

export const RecoveryPhotoGallery: React.FC = () => {
  const { campaign, updateCampaign, showToast } = useCampaign();
  const [selectedPhoto, setSelectedPhoto] = useState<RecoveryPhoto | null>(null);
  const [stageFilter, setStageFilter] = useState<'all' | 'surgery_time' | 'wheelchair_mobilization' | 'neurigo360_therapy' | 'standing_balance'>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadStage, setUploadStage] = useState<'surgery_time' | 'wheelchair_mobilization' | 'neurigo360_therapy' | 'standing_balance'>('surgery_time');
  const [uploadDate, setUploadDate] = useState('May 2022');
  const [uploadLocation, setUploadLocation] = useState('Vaishnavi Neuro Hospital, Allahabad');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadImageData, setUploadImageData] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = campaign.recoveryPhotos || [];

  const filteredPhotos = stageFilter === 'all'
    ? photos
    : photos.filter((p) => p.stage === stageFilter);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 1200, 0.9);
      setUploadImageData(dataUrl);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      showToast('Loaded photo! Complete the caption and save.');
    } catch (err) {
      console.error(err);
      showToast('Could not process photo file', 'error');
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadImageData) {
      showToast('Please select or upload a surgery or wheelchair photo', 'error');
      return;
    }
    if (!uploadTitle.trim()) {
      showToast('Please enter a title for the photo', 'error');
      return;
    }

    const newPhoto: RecoveryPhoto = {
      id: `photo_${Date.now()}`,
      title: uploadTitle.trim(),
      stage: uploadStage,
      date: uploadDate.trim() || '2026',
      location: uploadLocation.trim() || 'Nepal',
      imageUrl: uploadImageData,
      caption: uploadCaption.trim() || 'Authentic recovery progress photo documenting Bibek’s rehabilitation journey.'
    };

    updateCampaign({
      recoveryPhotos: [newPhoto, ...photos]
    });

    showToast(`Added recovery photo: "${newPhoto.title}"!`);
    setIsUploadOpen(false);
    // Reset form
    setUploadTitle('');
    setUploadCaption('');
    setUploadImageData('');
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'surgery_time':
        return 'Surgery Time & Hospital Bed';
      case 'wheelchair_mobilization':
        return 'Wheelchair Mobilization';
      case 'neurigo360_therapy':
        return 'Neurigo360 Neuro-Rehab';
      case 'standing_balance':
        return 'Standing Frame & Balance';
      default:
        return stage;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Upload Trigger */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              Documented Recovery Timeline
            </span>
            <span className="text-xs text-slate-400">Total Photos: {photos.length}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Bibek Bhandari · Surgery Time &amp; Wheelchair Recovery Journey
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Real photos chronicling Bibek's battle from emergency D1-D5 spine surgery at Vaishnavi Neuro Hospital in Allahabad, through wheelchair adaptation, to daily neuro-rehabilitation at Neurigo360 with Dr. Pratap.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Surgery / Wheelchair Photo</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setStageFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            stageFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Photos ({photos.length})
        </button>

        <button
          onClick={() => setStageFilter('surgery_time')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            stageFilter === 'surgery_time'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Surgery Time (May 2022)
        </button>

        <button
          onClick={() => setStageFilter('wheelchair_mobilization')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            stageFilter === 'wheelchair_mobilization'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Wheelchair Mobilization
        </button>

        <button
          onClick={() => setStageFilter('neurigo360_therapy')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            stageFilter === 'neurigo360_therapy'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Neurigo360 Therapy (Dr. Pratap)
        </button>

        <button
          onClick={() => setStageFilter('standing_balance')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            stageFilter === 'standing_balance'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Standing Frame &amp; Balance
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Image display */}
            <div
              className="relative aspect-[16/10] bg-slate-950 cursor-pointer group overflow-hidden"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                <Maximize2 className="w-4 h-4 mr-1.5" />
                Tap to View Photo Fullscreen
              </div>

              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/10">
                  {getStageLabel(photo.stage)}
                </span>
              </div>
            </div>

            {/* Photo metadata */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {photo.title}
                </h4>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {photo.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {photo.location}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPhoto(photo)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enlarge Photo</span>
                </button>
                <span className="text-[10px] text-slate-400 font-medium">Verified Timeline Record</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Photo Inspector Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-slate-950 text-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {getStageLabel(selectedPhoto.stage)}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {selectedPhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60 min-h-[350px]">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>{selectedPhoto.date}</span>
                <span>·</span>
                <span>{selectedPhoto.location}</span>
              </div>
              <p className="text-slate-200">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Recovery Photo Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Upload Surgery or Wheelchair Photo</h3>
                  <p className="text-xs text-slate-400">Share your real recovery photos to inspire supporters</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recovery Photo File <span className="text-red-500">*</span>
                </label>
                {uploadImageData ? (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 mb-2">
                    <img src={uploadImageData} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1 bg-black/70 hover:bg-black text-white text-xs rounded-lg backdrop-blur-md"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-800">
                      Tap to Choose Surgery Time / Wheelchair Photo
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      From phone gallery or computer (JPG, PNG)
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Surgery Recovery at Vaishnavi Neuro Hospital"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Recovery Stage</label>
                  <select
                    value={uploadStage}
                    onChange={(e) => setUploadStage(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    <option value="surgery_time">Surgery Time (May 2022)</option>
                    <option value="wheelchair_mobilization">Wheelchair Mobilization</option>
                    <option value="neurigo360_therapy">Neurigo360 Therapy (Dr. Pratap)</option>
                    <option value="standing_balance">Standing Frame &amp; Balance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    placeholder="e.g. May 30, 2022"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={uploadLocation}
                  onChange={(e) => setUploadLocation(e.target.value)}
                  placeholder="e.g. Vaishnavi Neuro Hospital, Allahabad"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Caption / Story Behind Photo</label>
                <textarea
                  rows={2}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Describe what was happening during this stage of your recovery..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
