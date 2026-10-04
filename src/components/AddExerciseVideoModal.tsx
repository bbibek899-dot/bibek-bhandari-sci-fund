import React, { useState, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { RehabExerciseVideo } from '../types/fundraising';
import { processImageFile } from '../utils/imageUtils';
import {
  Video,
  Upload,
  X,
  Plus,
  Activity,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface AddExerciseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExerciseVideoModal: React.FC<AddExerciseVideoModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addExerciseVideo, showToast } = useCampaign();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'quad_activation' | 'core_trunk' | 'rotator_cuff' | 'gait_standing' | 'range_of_motion'>('gait_standing');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.tiktok.com/@sasibibek');
  const [frequency, setFrequency] = useState('3 sets of 10 reps daily');
  const [therapistNotes, setTherapistNotes] = useState('Dr. Pratap: Maintain balance and focus on intentional neuro-motor activation.');
  const [imageUrl, setImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1200, 800, 0.9);
      setImageUrl(dataUrl);
      showToast('Loaded exercise thumbnail photo!');
    } catch (err) {
      console.error(err);
      showToast('Could not process photo file', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an exercise title', 'error');
      return;
    }

    const newExercise: RehabExerciseVideo = {
      id: `ex_${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || 'Prescribed neuro-physiotherapy drill at Neurigo360 under Dr. Pratap.',
      imageUrl: imageUrl || './images/exercise_isometric_knee_quad_1790313410854.jpg',
      videoUrl: videoUrl.trim() || 'https://www.tiktok.com/@sasibibek',
      frequency: frequency.trim() || 'Daily under supervision',
      therapistNotes: therapistNotes.trim(),
      dateLogged: new Date().toISOString().split('T')[0]
    };

    addExerciseVideo(newExercise);
    showToast(`Added exercise video: "${newExercise.title}"!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add New Rehab Exercise Video</h3>
              <p className="text-xs text-slate-400">Prescribed by Dr. Pratap at Neurigo360</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Thumbnail Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Exercise Photo / Thumbnail
            </label>
            {imageUrl ? (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 mb-2">
                <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
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
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50"
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">
                  Tap to Choose Exercise Photo
                </div>
                <div className="text-[11px] text-slate-400">
                  Photo from therapy mat, standing frame or parallel bars
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

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Exercise Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Standing Frame Weight Shifts &amp; Fall-Fear Reduction"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Category & Video URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Area / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="gait_standing">Gait &amp; Standing Balance</option>
                <option value="range_of_motion">Foot Drop &amp; Dorsiflexion</option>
                <option value="quad_activation">Quadriceps &amp; Leg Firing</option>
                <option value="core_trunk">Trunk &amp; Spine Stability</option>
                <option value="rotator_cuff">Upper Body Endurance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Video Link (TikTok / YouTube)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@sasibibek"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Frequency & Dosage */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Prescribed Sets / Reps</label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. 3 sets of 10 reps daily"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          {/* Dr. Pratap's Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Physiotherapist Notes (Dr. Pratap - Neurigo360)
            </label>
            <textarea
              rows={2}
              value={therapistNotes}
              onChange={(e) => setTherapistNotes(e.target.value)}
              placeholder="Clinical cues, e.g. keep knees aligned, activate core, don't rush movement..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Add Exercise Drill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
