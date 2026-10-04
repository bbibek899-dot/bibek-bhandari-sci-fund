export type PaymentMethodType = 'esewa' | 'khalti' | 'bank' | 'fonepay' | 'cash';

export interface PaymentCredentials {
  esewaId: string;
  esewaName: string;
  khaltiId: string;
  khaltiName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  swiftOrRouting?: string;
  fonepayQrText?: string;
  esewaQrImage?: string;
  bankQrImage?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  isAnonymous: boolean;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  referenceId: string;
  message?: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'flagged';
  donorSocialHandle?: string; // e.g. @anita_creates or IG username
  donorSocialPlatform?: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'other';
  screenshotProofUrl?: string;
  sharedOnFacebook?: boolean; // Track if publicly shared on Bibek's Facebook page
  facebookPostTimestamp?: string;
  thankYouSent?: boolean;
  ticketNumber?: string;
}

export interface ClinicalTimelineEvent {
  id: string;
  phase: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  hospitalOrCenter: string;
  physicianOrTherapist?: string;
  status: 'completed' | 'current' | 'future_goal';
  keyTakeaways: string[];
  photoUrl?: string;
  badgeText?: string;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  milestonePercent?: number;
  category: 'milestone' | 'receipt' | 'behind_the_scenes' | 'gratitude' | 'medical_report';
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
}

export interface BudgetBreakdownItem {
  id: string;
  item: string;
  amount: number;
  percentage: number;
  iconName?: string;
}

export interface MedicalDocument {
  id: string;
  title: string;
  category: 'mri_scan' | 'discharge_summary' | 'physician_note' | 'physio_assessment';
  date: string;
  hospital: string;
  doctorName?: string;
  imageUrl: string;
  caption: string;
  keyFindings?: string[];
}

export interface RecoveryPhoto {
  id: string;
  title: string;
  stage: 'surgery_time' | 'wheelchair_mobilization' | 'neurigo360_therapy' | 'standing_balance';
  date: string;
  location: string;
  imageUrl: string;
  caption: string;
}

export interface RehabExerciseVideo {
  id: string;
  title: string;
  category: 'quad_activation' | 'core_trunk' | 'rotator_cuff' | 'gait_standing' | 'range_of_motion';
  description: string;
  imageUrl: string;
  videoUrl?: string;
  frequency: string;
  therapistNotes: string;
  dateLogged: string;
}

export interface PatientMedicalInfo {
  isPatientCampaign: boolean;
  patientName: string;
  injuryDiagnosis: string; // e.g. D1-D5 Laminectomy, Incomplete Spinal Cord Injury
  injuryDate: string;
  causeOfInjury?: string;
  surgeryHospital?: string; // e.g. Vaishnavi Neuro Hospital, Allahabad
  operatingSurgeon?: string; // e.g. Dr. Prakash Khetan
  surgeryDate?: string; // e.g. May 30, 2022
  mriFindings?: string; // Verified MRI Impression
  rehabCenter: string; // e.g. Neurigo360
  physiotherapistName: string; // e.g. Dr. Pratap
  physiotherapistAvatar?: string;
  therapistConcern: string; // Clinical concern & urgency
  clinicalGoal: string; // Primary clinical objective
  dailyChallenges?: string[]; // e.g. Spasticity, Foot Drop, Fear of Falling, etc.
  activePhysicalGoals?: string[]; // e.g. Strengthening leg & foot muscles, independent walking
  treatmentDuration?: string; // e.g. 3.5 Years Minimum Intensive Protocol
  medicalDisclaimer: string;
  doctorVerificationBadge: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  heroBanner: string;
  category: string;
  location: string;
  currency: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  daysRemaining: number;
  story: string;
  budgetBreakdown: BudgetBreakdownItem[];
  payments: PaymentCredentials;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
  campaignSlug: string;
  medicalInfo?: PatientMedicalInfo;
  exerciseVideos?: RehabExerciseVideo[];
  medicalDocuments?: MedicalDocument[];
  recoveryPhotos?: RecoveryPhoto[];
}

export interface SocialScriptTemplate {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook';
  type: 'bio' | 'story' | 'video_script' | 'caption' | 'dm_auto_reply' | 'first_comment';
  title: string;
  description: string;
  content: string;
  proTip: string;
}
