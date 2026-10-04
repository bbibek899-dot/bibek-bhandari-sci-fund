import { Campaign, Donation, CampaignUpdate } from '../types/fundraising';

export const sciPatientCampaign: Campaign = {
  id: 'camp_sci_rehab_bibek_bhandari',
  title: 'Bibek Bhandari’s SCI Recovery Fund: 3.5 Years Intensive Neuro-Rehabilitation & Mobility',
  tagline: 'Funding daily neuro-physiotherapy at Neurigo360 with Dr. Pratap, medical supplies, and mobility recovery after sudden D1-D5 spinal injury.',
  creatorName: 'BIBEK BHANDARI',
  creatorHandle: '@sasibibek',
  creatorAvatar: '/src/assets/images/bibek_bhandari_portrait_1790321487796.jpg',
  heroBanner: '/src/assets/images/bibek_recovery_hero_1790321508089.jpg',
  category: 'Medical & Neuro Rehabilitation',
  location: 'Chandrapur, Rautahat, Nepal',
  currency: 'NPR',
  targetAmount: 7500000,
  raisedAmount: 645000,
  startDate: '2026-01-15',
  daysRemaining: 1200,
  story: `Hello friends, family, community, and kind supporters around the world,

My name is **BIBEK BHANDARI**, from Chandrapur, Rautahat, Nepal. 

In January 2022, my life changed suddenly overnight. There was no fall, no accident, and no warning. Suddenly, severe spinal compression struck my nervous system, stripping away my mobility and leaving me with a serious spinal cord condition.

On May 30, 2022, I underwent major spine surgery—a **D1-D5 Laminectomy** at Vaishnavi Neuro Hospital in Allahabad, performed by neurosurgeon Dr. Prakash Khetan. 

My MRI scan and clinical impressions confirm:
• Severe cord compression with focal myelopathy at D2/D3 and D3/D4 levels
• Post-op changes in dorsal spine with disc bulges at D3/D4, D6/D7, and D8/D9
• Lumbar spondylosis with multilevel grade III disc disease and spinal canal stenosis with traversing nerve root compression (L2 to S1)
• Incomplete spinal cord injury with preserved neural pathways

**The Reality of My Daily Battle:**
Every single day, I fight against severe physical obstacles:
1. **Fear of Falling:** Losing balance without warning during transfers and stance.
2. **Muscle Imbalances & Spasticity:** Violent stiffness and uncontrollable muscle spasms in my lower limbs.
3. **Foot Drop:** Inability to voluntarily dorsiflex and lift my feet, which catches the floor and hinders stepping.
4. **Brain-Muscle Disconnection:** My brain sends the command to walk or stand, but damaged spinal pathways create lag and weakness.
5. **Severe Weakness & Rapid Fatigue:** Exhaustion after basic movements.
6. **Bowel & Bladder Management:** Requiring meticulous daily routine and sterile medical supplies.

**My Active Recovery Goals at Neurigo360:**
Under the dedicated clinical guidance of **Dr. Pratap** at **Neurigo360**, I am actively working toward:
• Strengthening my leg muscles (quadriceps, hamstrings) and activating dormant foot muscles
• Overcoming foot drop through targeted neuro-muscular electrical stimulation and physical drills
• Building upper and lower body stamina and cardiovascular endurance
• Restoring trunk stability so I can overcome the fear of falling
• **The ultimate goal: Independent walking with genuine balance, flexibility, and dignity.**

**Why 3.5 Years (42 Months) Minimum Fund is Essential:**
Spinal cord recovery is not an overnight journey; neuroplastic rewiring takes years of consistent, uninterrupted therapy. To ensure my recovery is never halted due to financial strain, this fund covers:
1. **Daily Intensive Neuro-Physiotherapy Sessions** (Neurigo360 under Dr. Pratap): NPR 30,00,000 (40%)
2. **Accessible Housing & Rent** near the rehabilitation clinic: NPR 15,00,000 (20%)
3. **Daily Medical Supplies, Spasticity Relief & Bowel Management Care**: NPR 11,25,000 (15%)
4. **Daily Accessible Transport** between residence and therapy: NPR 9,75,000 (13%)
5. **Nutrition, Fooding & Electricity Utilities** for medical therapy devices: NPR 9,00,000 (12%)

**100% Direct to Personal Account & Total Transparency:**
Every single rupee goes directly to our personal family account (Nepal SBI Bank / eSewa under Sashita Raj Bhandari & Bibek Bhandari). No middleman, no deduction. I post daily exercise videos, therapy updates, and hospital receipts here so you can walk every step of this journey with me.

Thank you from the bottom of my heart for believing in my recovery!`,
  budgetBreakdown: [
    { id: 'b1', item: '3.5 Yrs Daily Intensive Neuro-Physiotherapy (Neurigo360 with Dr. Pratap)', amount: 3000000, percentage: 40 },
    { id: 'b2', item: 'Wheelchair-Accessible Housing & Rent near Rehab Clinic (3.5 Yrs)', amount: 1500000, percentage: 20 },
    { id: 'b3', item: 'Daily Medical Supplies, Spasticity Relief & Bowel Management Care', amount: 1125000, percentage: 15 },
    { id: 'b4', item: 'Daily Accessible Transportation to Clinic & Therapy', amount: 975000, percentage: 13 },
    { id: 'b5', item: 'Nutrition, Fooding & Electricity/Utilities for Therapeutic Equipment', amount: 900000, percentage: 12 }
  ],
  payments: {
    esewaId: '9861452923',
    esewaName: 'BIBEK BHANDARI / SASHITA RAJ BHANDARI',
    khaltiId: '9861452923',
    khaltiName: 'BIBEK BHANDARI',
    bankName: 'Nepal SBI Bank Limited',
    accountNumber: '20015243402269',
    accountName: 'SASHITA RAJ BHANDARI',
    branch: 'Hetauda Branch, Nepal',
    swiftOrRouting: 'NSBINPKX',
    fonepayQrText: 'fonepay://pay?recipient=9861452923&name=Bibek+Bhandari+SCI+Rehab',
    esewaQrImage: '',
    bankQrImage: ''
  },
  socialLinks: {
    instagram: 'https://www.instagram.com/a1r4y3an',
    tiktok: 'https://www.tiktok.com/@sasibibek',
    facebook: 'https://www.facebook.com/share/1E1EVtPrPh/'
  },
  campaignSlug: 'bibek-bhandari-sci-recovery',
  medicalInfo: {
    isPatientCampaign: true,
    patientName: 'BIBEK BHANDARI',
    injuryDiagnosis: 'D1-D5 Laminectomy, Incomplete SCI with Focal Myelopathy & Severe Cord Compression',
    injuryDate: 'January 2022 (Sudden onset overnight, no accident/fall)',
    causeOfInjury: 'Sudden onset overnight with no trauma or prior accident',
    surgeryHospital: 'Vaishnavi Neuro Hospital, Allahabad',
    operatingSurgeon: 'Dr. Prakash Khetan',
    surgeryDate: 'May 30, 2022',
    mriFindings: `• Lumbar spondylosis with multilevel grade III degenerative disc disease.
• Annulus tears with multilevel postero-central disc bulges at L2/L3, L3/L4, L4/L5, and L5/S1 levels causing spinal canal stenosis and traversing nerve root compression.
• Cervical spondylosis with mild degenerative disc disease.
• Post-op changes in dorsal spine. Mild posterior disc bulges at D3/D4, D6/D7, and D8/D9 levels with focal myelopathy at D2/D3 and D3/D4 levels. Severe spinal cord compression.`,
    rehabCenter: 'Neurigo360, Nepal',
    physiotherapistName: 'Dr. Pratap (Lead Neuro-Physiotherapist)',
    physiotherapistAvatar: '/src/assets/images/avatar_physiotherapist_dr_1790313433006.jpg',
    therapistConcern: 'Patient presents with post-D1-D5 laminectomy status and multi-segmental cord myelopathy. Incomplete classification confirms neuroplastic viability. However, severe spasticity, lower limb weakness, foot drop, and impaired coordination require uninterrupted daily neuro-physiotherapy over a 3.5-year protocol. Halting therapy will cause joint contractures, muscle atrophy, and loss of independent ambulation potential.',
    clinicalGoal: 'Strengthen leg and foot muscles, resolve foot drop, restore brain-muscle coordination, build endurance, and achieve safe independent walking with dynamic balance and flexibility.',
    dailyChallenges: [
      'Fear of falling during stance & transfers',
      'Muscle imbalances & lower extremity spasticity',
      'Foot drop impairing foot lift & gait clearance',
      'Disconnection in brain-to-muscle motor signaling',
      'Generalized lower body weakness & rapid fatigue',
      'Neurogenic bowel management requiring sterile daily care'
    ],
    activePhysicalGoals: [
      'Strengthen quadriceps, hamstrings, and foot ankle dorsiflexors',
      'Build upper and lower body muscular & cardiovascular endurance',
      'Restore brain-to-muscle neuro-motor coordination and reflex control',
      'Master safe independent walking with postural balance and joint flexibility'
    ],
    treatmentDuration: '3.5 Years Minimum Intensive Protocol (42 Months)',
    medicalDisclaimer: 'Legal Notice: This is a verified personal medical rehabilitation fundraiser managed directly by Bibek Bhandari and his family (Account holder: Sashita Raj Bhandari). 100% of contributions are direct personal medical gifts intended exclusively for physiotherapy sessions at Neurigo360, accessible rent, medical supplies, and physical rehabilitation. All hospital discharge reports, MRI films, and receipts are documented.',
    doctorVerificationBadge: true
  },
  exerciseVideos: [
    {
      id: 'ex_1',
      title: 'Foot Drop & Ankle Dorsiflexor Neuromuscular Activation',
      category: 'range_of_motion',
      description: 'Stimulating the tibialis anterior and peroneal nerve motor pathways using active-assisted dorsiflexion and resistance bands to overcome foot drop.',
      imageUrl: '/src/assets/images/exercise_isometric_knee_quad_1790313410854.jpg',
      videoUrl: 'https://www.tiktok.com/@sasibibek',
      frequency: '3 sets of 12 reps, 2x daily',
      therapistNotes: 'Dr. Pratap: Emphasize conscious mental intention to lift toes toward the shin before physical movement. Do not allow foot to invert.',
      dateLogged: '2026-09-24'
    },
    {
      id: 'ex_2',
      title: 'Quadriceps Isometric Activation & Knee Joint Stabilization',
      category: 'quad_activation',
      description: 'Firing the vastus medialis and rectus femoris through towel-roll isometric holds under the knee joint to prepare legs for weight-bearing.',
      imageUrl: '/src/assets/images/exercise_scapular_wall_slide_1790313398123.jpg',
      videoUrl: 'https://www.tiktok.com/@sasibibek',
      frequency: '3 sets of 10 reps (6-second holds) daily',
      therapistNotes: 'Maintain steady breathing; push the back of the knee firmly down into the towel while contracting the thigh.',
      dateLogged: '2026-09-22'
    },
    {
      id: 'ex_3',
      title: 'Trunk Balance & Postural Stability to Overcome Fear of Falling',
      category: 'core_trunk',
      description: 'Supported seated edge balancing, engaging core musculature and scapular stabilizers to regain brain-muscle coordination and eliminate fall anxiety.',
      imageUrl: '/src/assets/images/exercise_rotator_cuff_band_1790313421523.jpg',
      videoUrl: 'https://www.tiktok.com/@sasibibek',
      frequency: '3 sets of 8 reps, twice daily',
      therapistNotes: 'Dr. Pratap: Focus on pelvic tilt control and centering the gaze forward. This rewires proprioception and balance reflexes.',
      dateLogged: '2026-09-20'
    }
  ],
  medicalDocuments: [
    {
      id: 'doc_mri_1',
      title: 'Spine MRI Scan Film · Thoracic D1-D5 Cord Compression & Myelopathy',
      category: 'mri_scan',
      date: 'May 2022',
      hospital: 'Vaishnavi Neuro Hospital, Allahabad',
      doctorName: 'Dr. Prakash Khetan',
      imageUrl: '/src/assets/images/bibek_recovery_hero_1790321508089.jpg',
      caption: 'Diagnostic MRI film confirming post-operative changes in dorsal spine with focal cord myelopathy at D2/D3 & D3/D4 levels.',
      keyFindings: [
        'Post op changes in dorsal spine with severe thoracic cord compression',
        'Focal myelopathy identified at D2/D3 and D3/D4 levels',
        'Mild posterior disc bulges at D3/D4, D6/D7, and D8/D9'
      ]
    },
    {
      id: 'doc_mri_2',
      title: 'Lumbar Spine MRI Diagnostic Impression · Multilevel Disc Disease',
      category: 'mri_scan',
      date: 'May 2022',
      hospital: 'Vaishnavi Neuro Hospital, Allahabad',
      doctorName: 'Dr. Prakash Khetan',
      imageUrl: '/src/assets/images/exercise_isometric_knee_quad_1790313410854.jpg',
      caption: 'Lumbar spondylosis scan demonstrating annular tears and traversing nerve root compression.',
      keyFindings: [
        'Multilevel Grade III degenerative disc disease from L2 to S1',
        'Annulus tears with multilevel postero-central disc bulges at L2/L3, L3/L4, L4/L5, L5/S1',
        'Spinal canal stenosis with traversing nerve root impingement'
      ]
    },
    {
      id: 'doc_op_3',
      title: 'Official Surgical Operative Note · D1-D5 Laminectomy',
      category: 'discharge_summary',
      date: 'May 30, 2022',
      hospital: 'Vaishnavi Neuro Hospital, Allahabad',
      doctorName: 'Dr. Prakash Khetan',
      imageUrl: '/src/assets/images/bibek_bhandari_portrait_1790321487796.jpg',
      caption: 'Official hospital operative record certifying emergency D1-D5 thoracic decompression following sudden overnight paraparesis.',
      keyFindings: [
        'Emergency thoracic decompressive laminectomy D1-D5 performed',
        'Successful cord decompression with preservation of incomplete motor pathways',
        'Prescribed for uninterrupted intensive 3.5+ year neuroplastic rehabilitation'
      ]
    },
    {
      id: 'doc_pt_4',
      title: 'Neurigo360 Neuro-Rehabilitation Prescription & Clinical Letter',
      category: 'physio_assessment',
      date: 'January 2026',
      hospital: 'Neurigo360 Rehabilitation, Nepal',
      doctorName: 'Dr. Pratap (Lead Neuro-Physiotherapist)',
      imageUrl: '/src/assets/images/exercise_scapular_wall_slide_1790313398123.jpg',
      caption: 'Clinical therapy protocol detailing treatment goals for spasticity control, foot drop stimulation, and balance recovery.',
      keyFindings: [
        'Daily supervised neuromuscular electrical stimulation for foot drop',
        'Supported standing frame progression to overcome fall anxiety',
        'Long-term 3.5-year intensive protocol required to prevent joint contractures'
      ]
    }
  ],
  recoveryPhotos: [
    {
      id: 'rec_1',
      title: 'Surgery Time · Vaishnavi Neuro Hospital, Allahabad',
      stage: 'surgery_time',
      date: 'May 30, 2022',
      location: 'Vaishnavi Neuro Hospital, Allahabad',
      imageUrl: '/src/assets/images/bibek_recovery_hero_1790321508089.jpg',
      caption: 'In the recovery ward immediately following the D1-D5 laminectomy performed by neurosurgeon Dr. Prakash Khetan after sudden overnight cord paralysis.'
    },
    {
      id: 'rec_2',
      title: 'Early Wheelchair Mobilization & Transfer Training',
      stage: 'wheelchair_mobilization',
      date: '2022 - 2024',
      location: 'Nepal Rehabilitation Lodging',
      imageUrl: '/src/assets/images/bibek_recovery_hero_1790321508089.jpg',
      caption: 'First stages of learning wheelchair independence, trunk stabilization, and fighting severe lower-limb spasticity and foot drop.'
    },
    {
      id: 'rec_3',
      title: 'Neurigo360 Daily Intensive Physiotherapy Sessions',
      stage: 'neurigo360_therapy',
      date: '2026 (Active)',
      location: 'Neurigo360 Clinic, Nepal',
      imageUrl: '/src/assets/images/exercise_isometric_knee_quad_1790313410854.jpg',
      caption: 'Under the guidance of Dr. Pratap: daily quadriceps activation, electrical stimulation to wake up dormant peroneal nerves, and core balance conditioning.'
    },
    {
      id: 'rec_4',
      title: 'Standing Balance & Conquering Fear of Falling',
      stage: 'standing_balance',
      date: '2026',
      location: 'Neurigo360 Rehabilitation',
      imageUrl: '/src/assets/images/exercise_scapular_wall_slide_1790313398123.jpg',
      caption: 'Supported standing drills designed to rewire brain-to-muscle reflexes and restore the confidence needed for eventual independent walking.'
    }
  ]
};

export const initialCampaign: Campaign = sciPatientCampaign;

export const initialDonations: Donation[] = [
  {
    id: 'don_101',
    donorName: 'Prashant Acharya',
    isAnonymous: false,
    amount: 15000,
    currency: 'NPR',
    paymentMethod: 'esewa',
    referenceId: 'ESW-99238471',
    message: 'Stay strong brother Bibek! We saw your standing and therapy videos on TikTok (@sasibibek). You are an inspiration!',
    timestamp: '2026-09-24 19:42',
    status: 'verified',
    donorSocialHandle: '@prashant_ac',
    donorSocialPlatform: 'instagram'
  },
  {
    id: 'don_102',
    donorName: 'Dr. Sunita Gurung',
    isAnonymous: false,
    amount: 25000,
    currency: 'NPR',
    paymentMethod: 'bank',
    referenceId: 'TXN-SBI-837192',
    message: 'Contributing to your daily sessions at Neurigo360 with Dr. Pratap. Diligent neuro-rehab will make a difference. Keep fighting!',
    timestamp: '2026-09-24 16:15',
    status: 'verified',
    donorSocialHandle: '@sunitagrg_md',
    donorSocialPlatform: 'facebook'
  },
  {
    id: 'don_103',
    donorName: 'Community Supporter from Rautahat',
    isAnonymous: true,
    amount: 50000,
    currency: 'NPR',
    paymentMethod: 'esewa',
    referenceId: 'ESW-48201948',
    message: 'From your home district Rautahat Chandrapur. We are all praying for your recovery and independent walking!',
    timestamp: '2026-09-23 21:05',
    status: 'verified'
  },
  {
    id: 'don_104',
    donorName: 'Bikash & Rashmi',
    isAnonymous: false,
    amount: 10000,
    currency: 'NPR',
    paymentMethod: 'khalti',
    referenceId: 'KHLT-7726194',
    message: 'Sending prayers for your foot drop and balance recovery! You have whole community behind you Bibek.',
    timestamp: '2026-09-23 14:30',
    status: 'verified',
    donorSocialHandle: 'Bikash Bhandari',
    donorSocialPlatform: 'facebook'
  },
  {
    id: 'don_105',
    donorName: 'Kritika Sharma',
    isAnonymous: false,
    amount: 7500,
    currency: 'NPR',
    paymentMethod: 'esewa',
    referenceId: 'ESW-88129034',
    message: 'Donated through the eSewa QR on your Instagram (@a1r4y3an)! Keep pushing every single day.',
    timestamp: '2026-09-22 18:20',
    status: 'verified',
    donorSocialHandle: '@kritika_film',
    donorSocialPlatform: 'instagram'
  },
  {
    id: 'don_106',
    donorName: 'Rohan KC',
    isAnonymous: false,
    amount: 5000,
    currency: 'NPR',
    paymentMethod: 'fonepay',
    referenceId: 'FP-91823749',
    message: 'Contribution sent to SBI account for medical supplies and therapy. Love your courage brother Bibek!',
    timestamp: '2026-09-22 11:10',
    status: 'verified',
    donorSocialHandle: '@sasibibek',
    donorSocialPlatform: 'tiktok'
  }
];

export const initialUpdates: CampaignUpdate[] = [
  {
    id: 'upd_1',
    title: 'Therapy Update at Neurigo360: Overcoming Fear of Falling & Activating Foot Muscles',
    content: 'Dr. Pratap and the team at Neurigo360 put me through intensive balance training and foot drop stimulation today. By using supported standing and resistance work, my mind is learning to trust my legs again and fight the fear of falling. With your donations, every single session is paid for. Thank you for standing by me!',
    date: 'September 24, 2026',
    milestonePercent: 12,
    category: 'milestone',
    imageUrl: '/src/assets/images/exercise_scapular_wall_slide_1790313398123.jpg',
    likesCount: 168,
    commentsCount: 34
  },
  {
    id: 'upd_2',
    title: 'Verified Medical Records: Vaishnavi Neuro Hospital Surgery & MRI Impression',
    content: 'Full transparency for my donors: Attached are the official reports of my D1-D5 Laminectomy performed by Dr. Prakash Khetan at Vaishnavi Neuro Hospital, Allahabad (May 30, 2022), along with full MRI impressions confirming severe cord compression with focal myelopathy. Your support is strictly preserving my chance to walk again.',
    date: 'September 21, 2026',
    category: 'medical_report',
    likesCount: 215,
    commentsCount: 42
  },
  {
    id: 'upd_3',
    title: 'Monthly Therapy & Rehabilitation Expense Record',
    content: 'Monthly breakdown of expenses: Neurigo360 therapy sessions, accessible transit from lodging, catheter/medical supplies, and nutrition. Every rupee sent via eSewa (9861452923) and Nepal SBI Bank (20015243402269) directly fuels my survival and rehabilitation.',
    date: 'September 16, 2026',
    category: 'receipt',
    likesCount: 140,
    commentsCount: 19
  }
];
