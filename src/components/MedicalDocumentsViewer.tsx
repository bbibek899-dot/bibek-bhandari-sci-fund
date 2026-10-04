import React, { useState, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { MedicalDocument } from '../types/fundraising';
import { processImageFile } from '../utils/imageUtils';
import {
  FileText,
  Upload,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download,
  ShieldCheck,
  Calendar,
  Building,
  User,
  Plus,
  X,
  Eye,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const MedicalDocumentsViewer: React.FC = () => {
  const { campaign, updateCampaign, showToast } = useCampaign();
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload modal form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'mri_scan' | 'discharge_summary' | 'physician_note' | 'physio_assessment'>('mri_scan');
  const [uploadHospital, setUploadHospital] = useState('Vaishnavi Neuro Hospital, Allahabad');
  const [uploadDoctor, setUploadDoctor] = useState('Dr. Prakash Khetan');
  const [uploadDate, setUploadDate] = useState('May 2022');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadImageData, setUploadImageData] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const documents = campaign.medicalDocuments || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 1600, 0.92);
      setUploadImageData(dataUrl);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      showToast('Loaded scan image! Complete the details and save.');
    } catch (err) {
      console.error(err);
      showToast('Failed to process scan image file', 'error');
    }
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadImageData) {
      showToast('Please select or upload an MRI scan copy or document photo', 'error');
      return;
    }
    if (!uploadTitle.trim()) {
      showToast('Please enter a title for the document', 'error');
      return;
    }

    const newDoc: MedicalDocument = {
      id: `doc_${Date.now()}`,
      title: uploadTitle.trim(),
      category: uploadCategory,
      date: uploadDate.trim() || '2026',
      hospital: uploadHospital.trim(),
      doctorName: uploadDoctor.trim() || undefined,
      imageUrl: uploadImageData,
      caption: uploadCaption.trim() || 'Verified clinical document uploaded for donor transparency.',
      keyFindings: uploadCaption.trim() ? [uploadCaption.trim()] : undefined
    };

    updateCampaign({
      medicalDocuments: [newDoc, ...documents]
    });

    showToast(`Added medical report: "${newDoc.title}"!`);
    setIsUploadOpen(false);
    // Reset form
    setUploadTitle('');
    setUploadCaption('');
    setUploadImageData('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Upload Trigger */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider border border-blue-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Verified Diagnostic Archive
            </span>
            <span className="text-xs text-slate-400">Total Scans &amp; Records: {documents.length}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Official Spine MRI Scan Films &amp; Hospital Records
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Donor transparency records from <strong>Vaishnavi Neuro Hospital, Allahabad (Neurosurgeon Dr. Prakash Khetan - Guinness World Record Holder)</strong> and <strong>Neurigo360 Advance Neuro Rehab Centre, Greater Noida (Dr. Pratap Kunwar Singh &amp; Dr. Shakal Dev Gonda)</strong>. Tap any scan copy to view in high resolution.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Upload MRI Scan / Report Copy</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Thumbnail with Zoom Prompt */}
            <div
              className="relative aspect-[16/10] bg-slate-950 cursor-pointer group overflow-hidden border-b border-slate-100"
              onClick={() => {
                setSelectedDoc(doc);
                setZoomScale(1.0);
              }}
            >
              <img
                src={doc.imageUrl}
                alt={doc.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                <Maximize2 className="w-4 h-4 mr-1.5" />
                Tap to Inspect High-Res Scan
              </div>

              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-blue-300 backdrop-blur-md border border-white/10">
                  {doc.category === 'mri_scan' ? 'Spine MRI Film' : doc.category === 'discharge_summary' ? 'Hospital Record' : 'Therapy Prescription'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {doc.title}
                </h4>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Building className="w-3 h-3 text-slate-400" />
                    {doc.hospital}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {doc.date}
                  </span>
                </div>

                {doc.caption && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {doc.caption}
                  </p>
                )}

                {doc.keyFindings && doc.keyFindings.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Key Scan Findings:</div>
                    <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc pl-4">
                      {doc.keyFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedDoc(doc);
                    setZoomScale(1.0);
                  }}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Resolution</span>
                </button>

                <a
                  href={doc.imageUrl}
                  download={`${doc.title.replace(/\s+/g, '_')}.jpg`}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Download scan image"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox High-Resolution Inspector Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-slate-950 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md border border-blue-400/30">
                    {selectedDoc.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">{selectedDoc.hospital} · {selectedDoc.date}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {selectedDoc.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-800 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setZoomScale((z) => Math.max(0.8, +(z - 0.2).toFixed(2)))}
                    className="p-1 text-slate-300 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs px-1 text-slate-300">{Math.round(zoomScale * 100)}%</span>
                  <button
                    onClick={() => setZoomScale((z) => Math.min(3.0, +(z + 0.2).toFixed(2)))}
                    className="p-1 text-slate-300 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomScale(1.0)}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
                  >
                    Reset
                  </button>
                </div>

                <a
                  href={selectedDoc.imageUrl}
                  download={`${selectedDoc.title}.jpg`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                  title="Download scan image"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scan Image Display Area */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60 min-h-[350px]">
              <div
                className="transition-transform duration-150 ease-out"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <img
                  src={selectedDoc.imageUrl}
                  alt={selectedDoc.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Modal Footer with Clinical Findings */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white">Supervising / Operating Specialist:</span>{' '}
                {selectedDoc.doctorName || 'Senior Neurosurgeon Dr. Prakash Khetan'}
              </div>
              <div className="text-slate-400 text-[11px]">
                Preserved as an official public record for campaign donor accountability.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Medical Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Upload MRI Scan Copy or Report</h3>
                  <p className="text-xs text-slate-400">Add authentic medical paperwork to build donor trust</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="p-6 space-y-4">
              {/* File input preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Scan Film / Report Photo <span className="text-red-500">*</span>
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
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-800">
                      Tap to Choose MRI Film or Discharge Paper
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Supports JPG, PNG, phone camera screenshots (Max 15MB)
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
                  Document / Scan Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Dorsal Spine MRI Scan Film (Vaishnavi Neuro)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    <option value="mri_scan">Spine MRI Scan</option>
                    <option value="discharge_summary">Hospital Discharge Summary</option>
                    <option value="physician_note">Surgeon / Doctor Operative Note</option>
                    <option value="physio_assessment">Physiotherapy Evaluation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date on Document</label>
                  <input
                    type="text"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    placeholder="e.g. May 30, 2022"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Hospital & Doctor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={uploadHospital}
                    onChange={(e) => setUploadHospital(e.target.value)}
                    placeholder="e.g. Vaishnavi Neuro Hospital"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Doctor / Surgeon</label>
                  <input
                    type="text"
                    value={uploadDoctor}
                    onChange={(e) => setUploadDoctor(e.target.value)}
                    placeholder="e.g. Dr. Prakash Khetan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Caption / Impression */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Doctor's Impression / Notes
                </label>
                <textarea
                  rows={2}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g. Confirmed severe cord myelopathy at D2/D3 levels post-laminectomy."
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Save &amp; Publish Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
