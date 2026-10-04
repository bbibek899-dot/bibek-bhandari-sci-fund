import React, { useState, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { MedicalDocument, RecoveryPhoto, RehabExerciseVideo, ClinicalTimelineEvent } from '../types/fundraising';
import { processImageFile, resolveImageUrl } from '../utils/imageUtils';
import { AddExerciseVideoModal } from './AddExerciseVideoModal';
import {
  FileText,
  Camera,
  Calendar,
  Building,
  User,
  ShieldCheck,
  Stethoscope,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Plus,
  X,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  Heart,
  ExternalLink,
  Target,
  Award,
  Video,
  ChevronRight,
  Layers,
  Upload
} from 'lucide-react';

export const MedicalPortfolioView: React.FC = () => {
  const { campaign, updateCampaign, showToast, addExerciseVideo } = useCampaign();

  // Active Portfolio Section Tab
  const [portfolioTab, setPortfolioTab] = useState<'timeline' | 'mri_scans' | 'surgery_photos' | 'exercises' | 'physician'>('timeline');

  // Modals & Viewers
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<RecoveryPhoto | null>(null);
  const [docZoom, setDocZoom] = useState<number>(1.0);
  const [photoZoom, setPhotoZoom] = useState<number>(1.0);

  // Upload Modals
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  // Photo Stage Filter
  const [photoFilter, setPhotoFilter] = useState<'all' | 'surgery_time' | 'wheelchair_mobilization' | 'neurigo360_therapy' | 'standing_balance'>('all');

  // Document Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'mri_scan' | 'discharge_summary' | 'physician_note' | 'physio_assessment'>('mri_scan');
  const [docHospital, setDocHospital] = useState('Vaishnavi Neuro Hospital, Allahabad');
  const [docDoctor, setDocDoctor] = useState('Dr. Prakash Khetan');
  const [docDate, setDocDate] = useState('May 2022');
  const [docCaption, setDocCaption] = useState('');
  const [docImage, setDocImage] = useState('');

  // Photo Upload Form State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoStage, setPhotoStage] = useState<'surgery_time' | 'wheelchair_mobilization' | 'neurigo360_therapy' | 'standing_balance'>('surgery_time');
  const [photoDate, setPhotoDate] = useState('May 2022');
  const [photoLocation, setPhotoLocation] = useState('Vaishnavi Neuro Hospital, Allahabad');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoImage, setPhotoImage] = useState('');

  const docInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const medicalDocs = campaign.medicalDocuments || [];
  const recoveryPhotos = campaign.recoveryPhotos || [];
  const exerciseVideos = campaign.exerciseVideos || [];

  // Structured Clinical Timeline Data
  const clinicalTimeline: ClinicalTimelineEvent[] = [
    {
      id: 'tl_1',
      phase: 'Phase 1',
      date: 'May 2022',
      title: 'Sudden Spinal Trauma & Cord Paraparesis',
      subtitle: 'Acute Thoracic Spinal Cord Injury',
      description: 'Sudden overnight onset of paraparesis and severe sensory loss below the thoracic level. Emergency evacuation and clinical stabilization initiated.',
      hospitalOrCenter: 'Emergency Neuro Transport, Nepal to India',
      status: 'completed',
      keyTakeaways: [
        'Acute spinal shock and loss of motor voluntary function',
        'Diagnostic MRI ordered immediately',
        'Incomplete cord status confirmed (focal myelopathy)'
      ]
    },
    {
      id: 'tl_2',
      phase: 'Phase 2',
      date: 'May 30, 2022',
      title: 'Emergency D1-D5 Laminectomy & Cord Decompression',
      subtitle: 'Open Neuro-Surgical Intervention',
      description: 'Under the surgical leadership of Neurosurgeon Dr. Prakash Khetan (who holds the Guinness Book of World Records for removing 296 cysts from brain successfully) at Vaishnavi Neuro Hospital in Allahabad, emergency multi-level open D1-D5 dorsal laminectomy was executed to relieve severe spinal canal compression and preserve viability of motor pathways.',
      hospitalOrCenter: 'Vaishnavi Neuro Hospital, Allahabad',
      physicianOrTherapist: 'Neurosurgeon Dr. Prakash Khetan (Guinness World Record Holder)',
      status: 'completed',
      keyTakeaways: [
        'Surgical cord decompression successful via open thoracic laminectomy D1-D5',
        'Intact motor-sparing incomplete spinal cord pattern confirmed',
        'Uninterrupted 3.5-year daily neuroplastic rehabilitation protocol prescribed'
      ]
    },
    {
      id: 'tl_3',
      phase: 'Phase 3',
      date: 'July 2022 – 2024',
      title: 'ICU Discharge, Bed Rest & Wheelchair Mobilization',
      subtitle: 'Early Adaptation & Spasticity Management',
      description: 'Intensive early-phase bedside recovery, continuous repositioning to prevent pressure decubitus ulcers, and learning independent bed-to-wheelchair transfers despite severe foot drop and lower-limb spasticity.',
      hospitalOrCenter: 'Nepal Rehabilitation Care',
      status: 'completed',
      keyTakeaways: [
        'Wheelchair mobilization and seated trunk balance established',
        'Contracture prevention protocols maintained daily',
        'Bowel and bladder neurogenic care routines standardized'
      ]
    },
    {
      id: 'tl_4',
      phase: 'Phase 4',
      date: '2025 – Present',
      title: 'Intensive Daily Neuro-Rehabilitation at Neurigo360',
      subtitle: 'Clinical Supervision under Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda',
      description: 'Structured daily neuro-physiotherapy sessions at Neurigo360 Advance Neuro Rehabilitation Centre, Greater Noida Paramount Golf Foreste: neuromuscular electrical stimulation (NMES/FES) for dormant peroneal nerves, isometric quadriceps activation, core stabilization, and targeted resistance training.',
      hospitalOrCenter: 'Neurigo360 Advance Neuro Rehabilitation Centre, Greater Noida Paramount Golf Foreste',
      physicianOrTherapist: 'Dr. Pratap Kunwar Singh (Founder/PT) & Dr. Shakal Dev Gonda (PT)',
      status: 'current',
      badgeText: 'Active Daily Treatment',
      keyTakeaways: [
        'Conquering foot drop through conscious mental intent and resistance drills',
        'Vastus medialis and rectus femoris isometric firing',
        'Daily therapy sessions required to stimulate axonal sprouting'
      ]
    },
    {
      id: 'tl_5',
      phase: 'Phase 5',
      date: 'Current Active Protocol',
      title: 'Supported Standing Frame & Overcoming Fear of Falling',
      subtitle: 'Weight-Bearing & Reflex Rewiring',
      description: 'Progressing from seated exercises to supported standing frame drills and parallel bars. Rewiring proprioceptive balance reflexes and eliminating postural anxiety.',
      hospitalOrCenter: 'Neurigo360 Rehabilitation Clinic',
      physicianOrTherapist: 'Dr. Pratap',
      status: 'current',
      badgeText: 'Critical Milestone',
      keyTakeaways: [
        'Supported standing frame weight-bearing tolerance increased',
        'Parallel bar assisted weight shifting',
        'Dynamic balance training to prevent falls'
      ]
    },
    {
      id: 'tl_6',
      phase: 'Phase 6 (Target)',
      date: '3.5-Year Clinical Target',
      title: 'Independent Functional Walking & Full Community Mobility',
      subtitle: 'Ultimate Clinical Goal of the Fund',
      description: 'Achieving safe, independent ambulation without external physical lifting, complete leg strength restoration, and returning to independent life and livelihood.',
      hospitalOrCenter: 'Target Ambulation Protocol',
      physicianOrTherapist: 'Dr. Pratap & Neurigo360 Medical Team',
      status: 'future_goal',
      badgeText: 'Community Mission Goal',
      keyTakeaways: [
        'Independent community ambulation with dynamic balance',
        'Long-term neuroplastic stability and joint flexibility',
        'Returning to productive community life'
      ]
    }
  ];

  // Document Upload Handler
  const handleDocFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 1600, 0.92);
      setDocImage(dataUrl);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      showToast('Loaded MRI scan copy! Please verify and save.');
    } catch (err) {
      console.error(err);
      showToast('Failed to load image file', 'error');
    }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docImage) {
      showToast('Please select or photograph an MRI scan copy or hospital report', 'error');
      return;
    }
    if (!docTitle.trim()) {
      showToast('Please enter a title for the document', 'error');
      return;
    }

    const newDoc: MedicalDocument = {
      id: `doc_${Date.now()}`,
      title: docTitle.trim(),
      category: docCategory,
      date: docDate.trim() || '2026',
      hospital: docHospital.trim(),
      doctorName: docDoctor.trim() || undefined,
      imageUrl: docImage,
      caption: docCaption.trim() || 'Verified diagnostic document added to Bibek Bhandari’s public transparency archive.',
      keyFindings: docCaption.trim() ? [docCaption.trim()] : undefined
    };

    updateCampaign({
      medicalDocuments: [newDoc, ...medicalDocs]
    });

    showToast(`Added medical report: "${newDoc.title}"!`);
    setIsUploadDocOpen(false);
    setDocTitle('');
    setDocCaption('');
    setDocImage('');
  };

  // Photo Upload Handler
  const handlePhotoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 1200, 0.9);
      setPhotoImage(dataUrl);
      if (!photoTitle) {
        setPhotoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      showToast('Loaded photo! Please add location/caption and save.');
    } catch (err) {
      console.error(err);
      showToast('Could not process photo file', 'error');
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoImage) {
      showToast('Please select or photograph a surgery or wheelchair recovery picture', 'error');
      return;
    }
    if (!photoTitle.trim()) {
      showToast('Please enter a photo title', 'error');
      return;
    }

    const newPhoto: RecoveryPhoto = {
      id: `photo_${Date.now()}`,
      title: photoTitle.trim(),
      stage: photoStage,
      date: photoDate.trim() || '2026',
      location: photoLocation.trim() || 'Nepal',
      imageUrl: photoImage,
      caption: photoCaption.trim() || 'Authentic recovery photo documenting Bibek’s rehabilitation progress.'
    };

    updateCampaign({
      recoveryPhotos: [newPhoto, ...recoveryPhotos]
    });

    showToast(`Added recovery photo: "${newPhoto.title}"!`);
    setIsUploadPhotoOpen(false);
    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoImage('');
  };

  const filteredPhotos = photoFilter === 'all'
    ? recoveryPhotos
    : recoveryPhotos.filter(p => p.stage === photoFilter);

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'surgery_time':
        return 'Surgery Time & Hospital Ward';
      case 'wheelchair_mobilization':
        return 'Wheelchair Mobilization';
      case 'neurigo360_therapy':
        return 'Neurigo360 Daily Therapy';
      case 'standing_balance':
        return 'Standing Balance & Frame';
      default:
        return stage;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Clinical Diagnostic Case Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-bold uppercase tracking-wider">
                Clinical Diagnostic Portfolio
              </span>
              <span aria-hidden="true">·</span>
              <span>Patient: Bibek Bhandari</span>
              <span aria-hidden="true">·</span>
              <span>Age: 27</span>
              <span aria-hidden="true">·</span>
              <span>Origin: Chandrapur, Rautahat, Nepal</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Medical Portfolio · MRI Scans, Surgery History &amp; Rehabilitation Timeline
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete clinical documentation for donor transparency: emergency <strong>open D1-D5 thoracic laminectomy</strong> performed at <strong>Vaishnavi Neuro Hospital in Allahabad</strong> by <strong>Neurosurgeon Dr. Prakash Khetan</strong> (Guinness Book of World Records holder), followed by daily neuro-rehabilitation at <strong>Neurigo360 Advance Neuro Rehabilitation Centre, Greater Noida Paramount Golf Foreste</strong> under <strong>Dr. Pratap Kunwar Singh (BPT., MPT.)</strong> and <strong>Dr. Shakal Dev Gonda (BPT., MPT.)</strong>.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsUploadDocOpen(true)}
              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload MRI / Report Copy</span>
            </button>

            <button
              onClick={() => setIsUploadPhotoOpen(true)}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Surgery / Wheelchair Photo</span>
            </button>
          </div>
        </div>

        {/* Clinical Summary Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Diagnosis</div>
            <div className="font-bold text-white text-xs sm:text-sm mt-0.5">D1-D5 Laminectomy</div>
            <div className="text-[11px] text-emerald-400">Incomplete SCI (Motor Sparing)</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Operating Neurosurgeon</div>
            <div className="font-bold text-white text-xs sm:text-sm mt-0.5">Dr. Prakash Khetan</div>
            <div className="text-[11px] text-amber-300 font-semibold">Guinness World Record Holder</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Lead Physiotherapist / Founder</div>
            <div className="font-bold text-white text-xs sm:text-sm mt-0.5">Dr. Pratap Kunwar Singh</div>
            <div className="text-[11px] text-emerald-400">BPT., MPT. · Neurigo360 Founder</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Physiotherapist (Neurigo360)</div>
            <div className="font-bold text-white text-xs sm:text-sm mt-0.5">Dr. Shakal Dev Gonda</div>
            <div className="text-[11px] text-slate-300">BPT., MPT. · Greater Noida</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Treatment Protocol</div>
            <div className="font-bold text-white text-xs sm:text-sm mt-0.5">3.5 Years Minimum</div>
            <div className="text-[11px] text-slate-300">Daily Intensive Protocol</div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setPortfolioTab('timeline')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            portfolioTab === 'timeline'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Structured Clinical Timeline</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 text-white">6 Phases</span>
        </button>

        <button
          onClick={() => setPortfolioTab('mri_scans')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            portfolioTab === 'mri_scans'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Verified MRI Scans &amp; Hospital Records</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
            {medicalDocs.length}
          </span>
        </button>

        <button
          onClick={() => setPortfolioTab('surgery_photos')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            portfolioTab === 'surgery_photos'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Surgery Time &amp; Wheelchair Recovery Photos</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
            {recoveryPhotos.length}
          </span>
        </button>

        <button
          onClick={() => setPortfolioTab('exercises')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            portfolioTab === 'exercises'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-purple-400" />
          <span>Prescribed Exercise Drills</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800">
            {exerciseVideos.length}
          </span>
        </button>

        <button
          onClick={() => setPortfolioTab('physician')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            portfolioTab === 'physician'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
          <span>Physiotherapist Verification &amp; 3.5-Yr Plan</span>
        </button>
      </div>

      {/* SECTION 1: STRUCTURED CLINICAL TIMELINE */}
      {portfolioTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Chronological Medical &amp; Rehabilitation Timeline
                </h3>
                <p className="text-xs text-slate-500">
                  Documenting the journey from sudden injury to surgical decompression in Allahabad and active daily recovery at Neurigo360.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Green: Active Milestone</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" />
                <span>Blue: Completed</span>
              </div>
            </div>

            {/* Vertical Interactive Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-4">
              {clinicalTimeline.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                    item.status === 'completed'
                      ? 'bg-blue-600 text-white'
                      : item.status === 'current'
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-slate-300 text-slate-700'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    ) : item.status === 'current' ? (
                      <Activity className="w-3 h-3 text-white" />
                    ) : (
                      <Target className="w-3 h-3 text-slate-700" />
                    )}
                  </div>

                  {/* Card Content */}
                  <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.status === 'current'
                      ? 'bg-emerald-50/70 border-emerald-200/90 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-slate-800">{item.phase}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-600">{item.date}</span>
                        {item.badgeText && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'current'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 text-white'
                          }`}>
                            {item.badgeText}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-700">{item.hospitalOrCenter}</span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <div className="text-xs font-semibold text-emerald-800 mb-2">
                      {item.subtitle}
                      {item.physicianOrTherapist && (
                        <span className="text-slate-600 font-normal"> · {item.physicianOrTherapist}</span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Key takeaways bullet points */}
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      {item.keyTakeaways.map((point, pIdx) => (
                        <div key={pIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VERIFIED MRI SCANS & HOSPITAL REPORTS */}
      {portfolioTab === 'mri_scans' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Spine MRI Diagnostic Films &amp; Hospital Operative Records
                </h3>
                <p className="text-xs text-slate-500">
                  High-definition copies of MRI scans from Vaishnavi Neuro Hospital in Allahabad and clinical letters from Neurigo360. Tap any document to inspect in high resolution.
                </p>
              </div>

              <button
                onClick={() => setIsUploadDocOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New MRI Scan Copy</span>
              </button>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicalDocs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="group bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Document Header Metadata */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-semibold text-blue-700 uppercase">
                            {doc.category === 'mri_scan' ? 'MRI Film' : doc.category.replace('_', ' ').toUpperCase()}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{doc.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                          {doc.title}
                        </h4>
                      </div>

                      <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover:text-blue-600 transition-colors shrink-0">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80">
                      <img
                        src={resolveImageUrl(doc.imageUrl)}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 p-3 flex flex-col justify-end text-white">
                        <div className="text-[11px] font-medium text-slate-200 truncate flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-300" />
                          <span>{doc.hospital}</span>
                        </div>
                        {doc.doctorName && (
                          <div className="text-[10px] text-blue-300">
                            Attending: {doc.doctorName}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.caption}
                    </p>

                    {/* Key Findings List */}
                    {doc.keyFindings && doc.keyFindings.length > 0 && (
                      <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 space-y-1 text-[11px]">
                        <div className="font-bold text-slate-800">Verified Impression:</div>
                        {doc.keyFindings.slice(0, 2).map((kf, i) => (
                          <div key={i} className="text-slate-600 flex items-start gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                            <span className="line-clamp-1">{kf}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-blue-600 font-semibold">
                    <span>Click to open high-res zoom</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SURGERY TIME & WHEELCHAIR RECOVERY PHOTOS */}
      {portfolioTab === 'surgery_photos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Surgery Time &amp; Wheelchair Recovery Photo Archive
                </h3>
                <p className="text-xs text-slate-500">
                  Authentic photos chronicling Bibek’s journey: from Allahabad hospital bed post-D1-D5 laminectomy, to early wheelchair mobilization, and daily recovery drills at Neurigo360.
                </p>
              </div>

              <button
                onClick={() => setIsUploadPhotoOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Surgery / Wheelchair Photo</span>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
              <button
                onClick={() => setPhotoFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  photoFilter === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Photos ({recoveryPhotos.length})
              </button>

              <button
                onClick={() => setPhotoFilter('surgery_time')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  photoFilter === 'surgery_time'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Surgery Time &amp; Hospital Bed
              </button>

              <button
                onClick={() => setPhotoFilter('wheelchair_mobilization')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  photoFilter === 'wheelchair_mobilization'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Wheelchair Mobilization
              </button>

              <button
                onClick={() => setPhotoFilter('neurigo360_therapy')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  photoFilter === 'neurigo360_therapy'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Neurigo360 Rehab Drills
              </button>

              <button
                onClick={() => setPhotoFilter('standing_balance')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  photoFilter === 'standing_balance'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Standing Frame
              </button>
            </div>

            {/* Photo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3 p-3">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={resolveImageUrl(photo.imageUrl)}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {getStageTitle(photo.stage)}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{photo.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{photo.location}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-2.5 bg-slate-100/60 border-t border-slate-200/60 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span>View photo details</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PRESCRIBED EXERCISE DRILLS & VIDEOS */}
      {portfolioTab === 'exercises' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Daily Prescribed Rehabilitation Protocols &amp; Videos
                </h3>
                <p className="text-xs text-slate-500">
                  Supervised by Lead Neuro-Physiotherapist Dr. Pratap at Neurigo360. Target drills to fire motor units, stimulate dormant nerves, and overcome foot drop.
                </p>
              </div>

              <button
                onClick={() => setIsAddExerciseOpen(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rehab Exercise Video</span>
              </button>
            </div>

            {/* Exercise List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exerciseVideos.map((ex, index) => (
                <div key={ex.id} className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] bg-slate-900">
                      <img
                        src={resolveImageUrl(ex.imageUrl)}
                        alt={ex.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Protocol #{index + 1}
                      </div>
                      {ex.videoUrl && (
                        <a
                          href={ex.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                            <Video className="w-5 h-5 fill-current" />
                          </div>
                        </a>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {ex.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ex.description}
                      </p>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-xs space-y-1">
                        <div className="font-semibold text-emerald-800">Prescription:</div>
                        <div className="text-slate-700">{ex.frequency}</div>
                        <div className="text-[11px] text-slate-500 italic mt-1 pt-1 border-t border-slate-100">
                          {ex.therapistNotes}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    {ex.videoUrl ? (
                      <a
                        href={ex.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Watch Demonstration Video</span>
                      </a>
                    ) : (
                      <div className="text-center text-xs text-slate-400 py-1 font-mono">
                        Logged by Clinic
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CLINICAL PHYSICIAN & 3.5-YEAR PLAN */}
      {portfolioTab === 'physician' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Dr. Prakash Khetan & Allahabad Hospital Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      Neurosurgeon Dr. Prakash Khetan
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Senior Neurosurgeon · Vaishnavi Neuro Hospital, Allahabad
                    </p>
                  </div>
                </div>

                {/* World Record Badge */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Guinness Book of World Records Holder</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    Holds the world record for removing <strong>296 cysts from brain successfully</strong>. Performed Bibek's open emergency D1-D5 dorsal laminectomy.
                  </p>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Open Surgery Record (May 30, 2022):</strong> Emergency <strong>D1-D5 dorsal laminectomy</strong> performed at Vaishnavi Neuro Hospital to decompress acute spinal cord impingement.
                  </p>
                  <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-950 space-y-0.5">
                    <div className="font-bold text-[11px] text-blue-900">Surgical Impression:</div>
                    <p className="text-[11px] leading-relaxed">
                      Motor-sparing incomplete spinal cord condition. Preserved pathways make functional recovery achievable through uninterrupted long-term physiotherapy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dr. Pratap Kunwar Singh & Neurigo360 Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      Dr. Pratap Kunwar Singh - BPT., MPT.
                    </h4>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Young Founder / Physiotherapist
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Neurigo360 Advance Neuro Rehab Centre
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 space-y-0.5">
                  <div className="font-bold text-xs text-emerald-900">
                    Founder of Neurigo360 Advance Neuro Rehabilitation Centre
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Greater Noida Paramount Golf Foreste
                  </p>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    <strong>3.5-Year Intensive Protocol:</strong> Daily 2-to-3 hour targeted neuro-rehabilitation: quad firing, tibialis anterior NMES stimulation, and supported gait balance.
                  </p>
                  <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-950 space-y-0.5">
                    <div className="font-bold text-[11px] text-emerald-900">Clinical Prognosis:</div>
                    <p className="text-[11px] leading-relaxed">
                      "Bibek has shown real, verified muscle firing potential. The 3.5-year protocol is the essential neuroplastic window to rewire independent walking."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dr. Shakal Dev Gonda Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      Dr. Shakal Dev Gonda - BPT., MPT.
                    </h4>
                    <p className="text-[11px] text-teal-700 font-semibold">
                      Physiotherapist
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Neurigo360 Advance Neuro Rehab Centre
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 space-y-0.5">
                  <div className="font-bold text-xs text-teal-900">
                    Active Neuro-Rehabilitation Team
                  </div>
                  <p className="text-[11px] text-teal-800">
                    Neurigo360, Greater Noida Paramount Golf Foreste
                  </p>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Daily Therapy Supervision:</strong> Managing passive-active leg articulation, lower-limb spasticity control, trunk stabilization drills, and foot drop neuromuscular exercises.
                  </p>
                  <div className="p-2.5 bg-teal-50/80 rounded-xl border border-teal-200 text-teal-950 space-y-0.5">
                    <div className="font-bold text-[11px] text-teal-900">Therapist Focus:</div>
                    <p className="text-[11px] leading-relaxed">
                      "Preventing muscle contractures while retraining the central nervous system to command lower extremity muscles daily."
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Budget Breakdown & Rationale */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base sm:text-lg font-bold text-white">
                Detailed 3.5-Year (NPR 75 Lakhs) Medical Fund Allocation
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Neuroplastic rewiring requires daily clinical intervention without breaks. Here is the exact clinical allocation of the required funds:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div className="text-emerald-400 font-bold">NPR 30,00,000 (40%)</div>
                <div className="font-semibold text-white">Neurigo360 Daily Therapy</div>
                <p className="text-[11px] text-slate-400">Supervised neuro-physiotherapy, FES stimulation equipment &amp; parallel bar drills.</p>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div className="text-emerald-400 font-bold">NPR 15,00,000 (20%)</div>
                <div className="font-semibold text-white">Wheelchair Accessible Rent</div>
                <p className="text-[11px] text-slate-400">Ground floor, ramp-enabled lodging near clinic in Kathmandu for 42 months.</p>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div className="text-emerald-400 font-bold">NPR 11,25,000 (15%)</div>
                <div className="font-semibold text-white">Medical Supplies &amp; Consumables</div>
                <p className="text-[11px] text-slate-400">Sterile catheterization supplies, bowel care kits, anti-spasticity care &amp; dressings.</p>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div className="text-emerald-400 font-bold">NPR 9,75,000 (13%)</div>
                <div className="font-semibold text-white">Accessible Clinic Transport</div>
                <p className="text-[11px] text-slate-400">Daily transport between lodging and Neurigo360 rehabilitation facility.</p>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div className="text-emerald-400 font-bold">NPR 9,00,000 (12%)</div>
                <div className="font-semibold text-white">Clinical Nutrition &amp; Utilities</div>
                <p className="text-[11px] text-slate-400">High-protein muscle recovery diet, vitamins, supplements &amp; medical equipment power.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL FOR MRI DOCUMENTS */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Top Bar with Zoom Controls */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 gap-2">
              <div>
                <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                  Diagnostic MRI Film Viewer
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {selectedDoc.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setDocZoom(z => Math.max(0.8, +(z - 0.2).toFixed(1)))}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-1 font-bold text-slate-300">
                    {Math.round(docZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setDocZoom(z => Math.min(2.5, +(z + 0.2).toFixed(1)))}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedDoc(null);
                    setDocZoom(1.0);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Image with Zoom Scaling */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/60 min-h-[350px]">
              <img
                src={resolveImageUrl(selectedDoc.imageUrl)}
                alt={selectedDoc.title}
                style={{ transform: `scale(${docZoom})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-[60vh] object-contain transition-transform duration-150 rounded-lg shadow-2xl"
              />
            </div>

            {/* Document Details Footer */}
            <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400">
                <div className="flex items-center gap-2">
                  <span>Hospital: <strong className="text-white">{selectedDoc.hospital}</strong></span>
                  {selectedDoc.doctorName && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Physician: <strong className="text-white">{selectedDoc.doctorName}</strong></span>
                    </>
                  )}
                </div>
                <div className="font-mono text-slate-400">{selectedDoc.date}</div>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {selectedDoc.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL FOR RECOVERY PHOTOS */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[92vh]">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 gap-2">
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                  {getStageTitle(selectedPhoto.stage)}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {selectedPhoto.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setPhotoZoom(z => Math.max(0.8, +(z - 0.2).toFixed(1)))}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-1 font-bold text-slate-300">
                    {Math.round(photoZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setPhotoZoom(z => Math.min(2.5, +(z + 0.2).toFixed(1)))}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    setPhotoZoom(1.0);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/60 min-h-[350px]">
              <img
                src={resolveImageUrl(selectedPhoto.imageUrl)}
                alt={selectedPhoto.title}
                style={{ transform: `scale(${photoZoom})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-[60vh] object-contain transition-transform duration-150 rounded-lg shadow-2xl"
              />
            </div>

            <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Location: <strong className="text-white">{selectedPhoto.location}</strong></span>
                <span className="font-mono text-slate-400">{selectedPhoto.date}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MRI SCAN MODAL */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Upload MRI Scan Copy or Clinical Record</h3>
                  <p className="text-xs text-slate-400">Add to public diagnostic transparency archive</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadDocOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Scan / Document Photo
                </label>
                <div
                  onClick={() => docInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/40"
                >
                  {docImage ? (
                    <div className="space-y-2">
                      <img src={docImage} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain shadow-xs" />
                      <div className="text-xs text-blue-600 font-semibold">Click to choose another photo</div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-4">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-800">Tap to browse or take photo of MRI / Report</div>
                      <div className="text-[11px] text-slate-400">Accepts JPG, PNG, WEBP scan copies</div>
                    </div>
                  )}
                  <input
                    ref={docInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDocFileSelect}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="mri_scan">Spine MRI Scan</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="physician_note">Surgeon / Doctor Note</option>
                    <option value="physio_assessment">Physiotherapy Letter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={docDate}
                    onChange={e => setDocDate(e.target.value)}
                    placeholder="e.g. May 2022"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  placeholder="e.g. Thoracic Spine MRI Scan Film D1-D5"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={docHospital}
                    onChange={e => setDocHospital(e.target.value)}
                    placeholder="e.g. Vaishnavi Neuro Hospital"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={docDoctor}
                    onChange={e => setDocDoctor(e.target.value)}
                    placeholder="e.g. Dr. Prakash Khetan"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Findings / Notes</label>
                <textarea
                  rows={2}
                  value={docCaption}
                  onChange={e => setDocCaption(e.target.value)}
                  placeholder="Summarize key MRI findings or clinical diagnosis..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDocOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD SURGERY / WHEELCHAIR PHOTO MODAL */}
      {isUploadPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-sm">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Upload Surgery Time or Wheelchair Photo</h3>
                  <p className="text-xs text-slate-400">Share verified recovery journey photos with donors</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadPhotoOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recovery Photo
                </label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/40"
                >
                  {photoImage ? (
                    <div className="space-y-2">
                      <img src={photoImage} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain shadow-xs" />
                      <div className="text-xs text-emerald-600 font-semibold">Click to choose another photo</div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-4">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-800">Tap to select surgery time or wheelchair picture</div>
                      <div className="text-[11px] text-slate-400">From hospital bed, wheelchair, or physiotherapy clinic</div>
                    </div>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoFileSelect}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recovery Stage</label>
                  <select
                    value={photoStage}
                    onChange={e => setPhotoStage(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="surgery_time">Surgery Time &amp; Hospital Ward</option>
                    <option value="wheelchair_mobilization">Wheelchair Mobilization</option>
                    <option value="neurigo360_therapy">Neurigo360 Therapy Session</option>
                    <option value="standing_balance">Standing Frame &amp; Balance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={photoDate}
                    onChange={e => setPhotoDate(e.target.value)}
                    placeholder="e.g. May 2022 / 2026"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Early Wheelchair Practice after Surgery"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={photoLocation}
                  onChange={e => setPhotoLocation(e.target.value)}
                  placeholder="e.g. Vaishnavi Neuro Hospital, Allahabad"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption &amp; Story</label>
                <textarea
                  rows={2}
                  value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  placeholder="Describe the moment and Bibek's recovery context..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadPhotoOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXERCISE VIDEO MODAL */}
      <AddExerciseVideoModal
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
      />

    </div>
  );
};
