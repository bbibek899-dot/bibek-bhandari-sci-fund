import { SocialScriptTemplate } from '../types/fundraising';

export interface SocialStrategyGuide {
  platform: 'instagram' | 'tiktok' | 'facebook';
  platformName: string;
  badgeColor: string;
  oneLiner: string;
  keyRule: string;
  steps: {
    stepNumber: string;
    title: string;
    action: string;
    details: string;
    proTip: string;
  }[];
}

export const socialStrategyGuides: SocialStrategyGuide[] = [
  {
    platform: 'instagram',
    platformName: 'Instagram',
    badgeColor: 'text-pink-600 bg-pink-50 border-pink-200',
    oneLiner: 'Use Story Link Stickers + DM keyword triggers + 1 pinned carousel post.',
    keyRule: 'Never just post a generic link sticker without a 3-slide storytelling build-up.',
    steps: [
      {
        stepNumber: '01',
        title: 'Optimize Your Bio Link & Value Hook',
        action: 'Put the campaign URL in your main profile link slot with clear emoji guidance.',
        details: 'Instagram gives you 1 clickable link in bio. Make the preceding line state the exact milestone (e.g., "🎬 Voice of the Foothills: 60% funded! Tap below to join our film lab").',
        proTip: 'Use a short, clean domain link or this toolkit’s direct bio-link view.'
      },
      {
        stepNumber: '02',
        title: 'The 3-Slide Story Arch (High Conversion)',
        action: 'Post a 3-part Instagram Story sequence instead of a single static image.',
        details: 'Slide 1: High emotion hook (behind-the-scenes video or quote). Slide 2: The exact roadblock and budget needed. Slide 3: The native "LINK" sticker paired with a bold text prompt like "Tap to fuel this project (eSewa / Bank)".',
        proTip: 'Always add the "LINK" sticker directly over a high-contrast sticker background with a finger pointing sticker.'
      },
      {
        stepNumber: '03',
        title: 'DM Keyword Automation ("Comment SUPPORT")',
        action: 'In your Reels and Feed captions, tell viewers to comment a keyword.',
        details: 'Instagram algorithms reward comment engagement. When people comment "SUPPORT", immediately DM them the custom thank-you greeting with your eSewa ID and campaign page link.',
        proTip: 'Creators report 3.8x higher donation follow-through from 1-on-1 DMs compared to bio clicks.'
      },
      {
        stepNumber: '04',
        title: 'Public Donor Story Shoutouts',
        action: 'Post every donation screenshot/shoutout card onto your Stories and save to a "Supporters" Highlight.',
        details: 'Social proof triggers FOMO and community validation. When other followers see genuine people sending Rs. 500 or Rs. 5,000, they realize it is authentic and easy to contribute.',
        proTip: 'Use our built-in Story Shoutout generator to export crisp 9:16 cards in 1 tap.'
      }
    ]
  },
  {
    platform: 'tiktok',
    platformName: 'TikTok',
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    oneLiner: 'Hook in the first 3 seconds, pin your eSewa/payment in comments, and document the raw journey.',
    keyRule: 'If you have under 1,000 followers and no bio link, write your eSewa ID directly in your bio text and on video text overlays.',
    steps: [
      {
        stepNumber: '01',
        title: 'Under 1,000 Followers Workaround',
        action: 'Overcome the missing clickable link restriction with visible on-screen handles.',
        details: 'TikTok restricts clickable profile links until 1k followers. Workaround: 1) Put your eSewa/Khalti phone number right in your bio bio description text: "Support our youth film: eSewa 9841239870". 2) Add a 2-second video overlay at the end of every TikTok with your payment QR or phone number.',
        proTip: 'You can also switch to a free TikTok Business Account to unlock profile link capabilities depending on regional availability.'
      },
      {
        stepNumber: '02',
        title: 'The 3-Part Raw Pitch Video Script',
        action: 'Film a 45–60 second direct-to-camera or voiceover video.',
        details: 'Seconds 0–3: Disruptive hook ("I quit waiting for movie grants, so we’re training 24 rural kids to shoot their own film"). Seconds 4–35: The real stakes, what you’ve already done with zero budget. Seconds 36–50: The specific ask ("We need Rs. 1,500 for student audio kits. Link in bio or eSewa pinned below").',
        proTip: 'Raw, unpolished footage (front-facing selfie camera, real workshop noise) performs 200% better on TikTok than overly glossy promotional ads.'
      },
      {
        stepNumber: '03',
        title: 'The Pinned Comment Tactic',
        action: 'Post the first comment on your own video and pin it to the top.',
        details: 'Write: "🙏 Thank you so much for the love! You can back our youth film lab via eSewa/Khalti at 9841239870 or tap the link in bio. Every Rs. 500 helps a student record sound!" and pin it.',
        proTip: 'Whenever someone comments saying they donated or asking how to help, reply with a quick video reply or copy-paste our thank-you comment script.'
      },
      {
        stepNumber: '04',
        title: 'Series Format: "Day X of Building This Without a Budget"',
        action: 'Turn your fundraiser into a bingeable episodic journey.',
        details: 'People don’t just donate to ideas; they invest in creator momentum. Post "Day 3 of testing student camera rigs", "Day 7: How we reached 50% funded on TikTok", etc.',
        proTip: 'Celebrate individual donor milestones by saying their name in the video intro!'
      }
    ]
  },
  {
    platform: 'facebook',
    platformName: 'Facebook',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    oneLiner: 'Master the "Link in First Comment" rule to preserve algorithmic reach, plus long-form emotional storytelling.',
    keyRule: 'Never put the external link in the main post text—Facebook down-ranks posts with outbound links.',
    steps: [
      {
        stepNumber: '01',
        title: 'The "Link in First Comment" Algorithm Rule',
        action: 'Publish your complete emotional story with photos, and write "🔗 Campaign link & Bank/eSewa QR in first comment!".',
        details: 'Facebook severely demotes post reach when outbound links are in the primary caption. Putting the link in the 1st comment gets up to 4x higher organic impressions.',
        proTip: 'Pin your first comment or edit the caption 1 hour later if you must include the link.'
      },
      {
        stepNumber: '02',
        title: 'Long-Form Story & Visual Photo Carousel',
        action: 'Write 4–6 structured paragraphs with generous line breaks and bullet points.',
        details: 'Facebook audiences read longer text if formatting is clean. Include: 1) Why you started this, 2) The exact community impact, 3) 100% itemized budget transparency, 4) Bank & eSewa payment breakdown.',
        proTip: 'Tag friends, mentors, and local collaborators in the photo tags so it surfaces on their mutual friends’ feeds.'
      },
      {
        stepNumber: '03',
        title: 'Community Groups Without Being Spammy',
        action: 'Share into relevant local groups (Alumni, Filmmakers, Regional Community).',
        details: 'Do not just dump links. Write: "Hey everyone, as a former Lamjung student, I wanted to share what we’re building with local youth..." Focus on community pride first, fundraising second.',
        proTip: 'Always ask group admins for permission or offer to host a free Q&A workshop for members.'
      },
      {
        stepNumber: '04',
        title: 'Messenger 1-on-1 Personal Outreach',
        action: 'Message your 20 closest supporters directly before launching publicly.',
        details: 'Having 5–10 donations on day 1 provides social proof before strangers see the page. Send a warm, personal note with your campaign page and eSewa ID.',
        proTip: 'Use our pre-written Messenger template so it feels deeply personal, not like a copy-pasted blast.'
      }
    ]
  }
];

export const socialScriptTemplates: SocialScriptTemplate[] = [
  {
    id: 'sci_tt_recovery_1',
    platform: 'tiktok',
    type: 'video_script',
    title: 'TikTok: "Day in My Spinal Cord Injury Recovery" (60s)',
    description: 'Raw, gritty documentary style showing your exercise drill and clinical progress at Neurigo360.',
    content: `[0:00 - 0:04 HOOK]
(Camera pointed at legs on exercise mat or parallel bars)
"In 2022, sudden paralysis hit me overnight. Neurosurgeon Dr. Prakash Khetan (Guinness World Record Holder) performed my emergency D1-D5 open laminectomy. Today I am fighting to rewire my nervous system."

[0:05 - 0:25 SHOW THE WORK]
(B-roll of foot drop stimulation, towel knee press, or balance drill)
"At Neurigo360 Advance Neuro Rehabilitation Centre in Greater Noida, Dr. Pratap Kunwar Singh (Founder/PT) and Dr. Shakal Dev Gonda designed an intensive 3.5-year protocol to conquer foot drop, spasticity, and the fear of falling."

[0:26 - 0:45 THE DIRECT ASK]
"Intensive daily therapy, accessible transport, and medical supplies cost NPR 75 Lakhs for 3.5 years. We're already {PROGRESS_PERCENT}% funded by our community!
If you can contribute Rs. 500 or Rs. 1,000 towards my Neurigo360 therapy sessions:
📱 eSewa/Khalti: {ESEWA_ID} ({CREATOR_NAME})
🏦 Nepal SBI Bank: {BANK_ACC} (Sashita Raj Bhandari)
Link with full MRI scans & hospital discharge papers is in my bio! Thank you for standing with me."`,
    proTip: 'Show genuine effort and sweat. Audiences root for resilience and discipline.'
  },
  {
    id: 'sci_ig_milestone',
    platform: 'instagram',
    type: 'story',
    title: 'Instagram 3-Part Story: Therapy Milestone',
    description: 'Perfect for sharing after a therapy session with Dr. Pratap at Neurigo360.',
    content: `[SLIDE 1 - PHOTO OF CLINICAL THERAPY MAT AT NEURIGO360]
Text: "Huge milestone in neuro-rehab today! Reconnected motor intent in my foot and held edge balance against the fear of falling! 😭🙏"

[SLIDE 2 - MRI & SURGERY REPORT PHOTO]
Text: "Post D1-D5 Laminectomy & cord compression. Dr. Pratap says continuous daily therapy is the only way to avoid joint contractures and rebuild gait clearance."

[SLIDE 3 - CALL TO ACTION WITH NATIVE LINK STICKER]
Text: "Every Rs. 500 or Rs. 1,000 directly funds my therapy sessions and medical supplies.
👉 [LINK STICKER: 'SUPPORT BIBEK'S SCI REHAB']
(Accepts eSewa {ESEWA_ID}, Khalti, and Nepal SBI Bank A/C: {BANK_ACC})
DM me if you need the direct QR or bank details!"`,
    proTip: 'Place your Instagram link sticker right over the designated box of our Story Studio export.'
  },
  {
    id: 'sci_fb_family_appeal',
    platform: 'facebook',
    type: 'caption',
    title: 'Facebook Long-Form: Medical Appeal & Hospital Verification',
    description: 'Structured long-form post for community, alumni, and relatives.',
    content: `Dear friends, family, and kind community members,

My name is BIBEK BHANDARI from Chandrapur, Rautahat, Nepal. In January 2022, my life changed suddenly overnight—no accident, no fall. Severe spinal cord compression struck, and on May 30, 2022, I underwent emergency open spine surgery (D1-D5 Laminectomy) at Vaishnavi Neuro Hospital, Allahabad, operated by Neurosurgeon Dr. Prakash Khetan (who holds the Guinness Book of World Records for removing 296 cysts from brain successfully).

My MRI scan confirms severe cord compression with focal myelopathy at D2/D3 and D3/D4, alongside multilevel lumbar canal stenosis. However, because my injury is INCOMPLETE, the neural pathways are still alive.

WHY UNINTERRUPTED 3.5-YEAR THERAPY IS CRITICAL:
Under the supervision of Dr. Pratap Kunwar Singh (BPT., MPT. - Young Founder / Physiotherapist) and Dr. Shakal Dev Gonda (BPT., MPT.) at Neurigo360 Advance Neuro Rehabilitation Centre, Greater Noida Paramount Golf Foreste, I undergo intensive daily neuro-physiotherapy to fight severe spasticity, foot drop, muscle weakness, and the fear of falling. Halting therapy risks irreversible muscle shortening and losing the chance to walk again.

ITEMIZED 3.5-YEAR (42 MONTHS) RECOVERY BUDGET:
🎯 3.5-Year Target: NPR {TARGET_AMOUNT} (75 Lakhs)
🔥 Raised to date: {TOTAL_RAISED}
✅ Daily Neuro-Physiotherapy (Neurigo360 with Dr. Pratap Kunwar Singh & Dr. Shakal Dev Gonda): NPR 30,00,000 (40%)
✅ Wheelchair-Accessible Housing & Rent near Clinic: NPR 15,00,000 (20%)
✅ Daily Medical Supplies & Bowel Management Care: NPR 11,25,000 (15%)
✅ Daily Accessible Transport: NPR 9,75,000 (13%)
✅ Fooding, Nutrition & Utilities for Equipment: NPR 9,00,000 (12%)

HOW YOU CAN HELP DIRECTLY:
📱 eSewa / Khalti ID: {ESEWA_ID} (Bibek Bhandari / Sashita Raj Bhandari)
🏦 Bank: {BANK_NAME}
Account No: {BANK_ACC}
Account Holder: {BANK_ACC_NAME}
Branch: {BANK_BRANCH}
Remarks: "SCI Rehab + Your Name"

🔗 Full medical story, MRI scan impression, and hospital receipts:
CHECK THE VERY FIRST COMMENT BELOW FOR THE DIRECT PORTAL! 👇

Every share and every prayer gives me strength to keep fighting. Thank you from the bottom of my heart. ❤️`,
    proTip: 'Remember Facebook demotes outbound links in post bodies—paste your campaign link in the FIRST COMMENT!'
  },
  {
    id: 'ig_bio_1',
    platform: 'instagram',
    type: 'bio',
    title: 'Instagram Bio for SCI Recovery',
    description: 'High-converting medical bio hook for profile visits.',
    content: `♿️ Bibek Bhandari · SCI Recovery (D1-D5 Incomplete)
📍 Chandrapur, Rautahat | Neurigo360 Rehab (Dr. Pratap)
✨ Fighting foot drop & rewiring pathways | {PROGRESS_PERCENT}% funded
👇 Back my daily neuro-therapy (eSewa/Bank/QR):
{CAMPAIGN_URL}`,
    proTip: 'Keep under 150 characters so your link sits above the fold.'
  },
  {
    id: 'ig_dm_auto',
    platform: 'instagram',
    type: 'dm_auto_reply',
    title: 'Instagram DM "Comment HEAL / SUPPORT" Reply',
    description: 'Send this when someone comments on your Reel or TikTok video.',
    content: `Namaste {NAME}! 🙏 Thank you so much for reaching out to support my SCI rehabilitation journey. Your kindness gives me immense energy to keep pushing through my daily therapy sessions at Neurigo360.

Here is my direct rehabilitation portal with my MRI impressions & clinical notes:
🔗 {CAMPAIGN_URL}

Or if it is easier, you can send directly via eSewa / Bank:
📱 eSewa / Khalti ID: {ESEWA_ID} ({CREATOR_NAME})
🏦 {BANK_NAME}: {BANK_ACC} (Account Name: {BANK_ACC_NAME}, Branch: {BANK_BRANCH})

Once sent, send me a screenshot or reference number so I can record your name on our verified donor ledger and send you my next exercise video update! Thank you so much! ❤️`,
    proTip: 'Set this up in Instagram Saved Replies (Settings > Creator Tools > Saved Replies) shortcut: "rehab".'
  },
  {
    id: 'tt_pin_comment',
    platform: 'tiktok',
    type: 'first_comment',
    title: 'TikTok Pinned Comment Blueprint',
    description: 'The comment you must pin at the top of every exercise video.',
    content: `🙏 Thank you so much for the love & prayers! You can support my daily neuro-rehab at Neurigo360 via eSewa/Khalti: {ESEWA_ID} or Nepal SBI Bank: {BANK_ACC} ({BANK_ACC_NAME})! Tap the link in my bio to see my full MRI scan reports & therapist clinical letter! Every Rs. 500 helps a therapy session! ❤️✨`,
    proTip: 'Pin this comment so it is the first thing anyone sees.'
  }
];

export const automaticThankYouTemplates = [
  {
    id: 'ty_ig',
    channel: 'Instagram DM',
    subject: 'Warm Personal Recovery Thank You',
    format: `Namaste {DONOR_NAME}! ❤️

I just received your contribution of {AMOUNT} {CURRENCY} via {METHOD} (Ref: {REF_ID}) for my Spinal Cord Injury rehabilitation fund!

I cannot describe how much this means to me and my family. Your support directly funds my upcoming physiotherapy sessions with Dr. Anita at the rehab center.

I have officially verified your donation on our patient ledger! I will be sharing my progress on my next standing frame session with you.

Thank you for fighting this recovery journey beside me! ♿️✨
— {CREATOR_NAME}`
  },
  {
    id: 'ty_tiktok',
    channel: 'TikTok Comment / Video Reply',
    subject: 'TikTok Recovery Gratitude & Share Request',
    format: `@{DONOR_HANDLE} THANK YOU SO MUCH!! 😭❤️ Just verified your NPR {AMOUNT} contribution on our transparent patient ledger! You just helped fund my neuro-physiotherapy at Neurigo360 this week! Please repost and share this video with your friends so I can reach my recovery goal! Sending you so much love and prayers! ✨🙏 Link in bio!`
  },
  {
    id: 'ty_whatsapp',
    channel: 'WhatsApp / SMS',
    subject: 'Personal Gratitude Receipt & Share Request (Bilingual)',
    format: `नमस्ते {DONOR_NAME} जी! 🙏

म विवेक भण्डारी (चन्द्रपुर, रौतहट)। मेरो D1-D5 ढाडको न्युरो-पुनःस्थापना (Spinal Cord Injury Recovery) को लागि तपाईंले प्रदान गर्नुभएको NPR {AMOUNT} को सहयोग हाम्रो पारिवारिक खातामा प्राप्त भएको छ। हजुरको यो गुन म कहिल्यै बिर्सने छैन।

📊 हाम्रो पारदर्शिता विवरण:
• प्राप्त रकम: NPR {AMOUNT} ({METHOD} - Ref: {REF_ID})
• हालसम्मको कुल संकलन: NPR {TOTAL_RAISED} / NPR {TARGET_AMOUNT}
• उपचार केन्द्र: Neurigo360, Nepal (Dr. Pratap)

🙏 मेरो विनम्र अनुरोध:
कृपया यो अभियानलाई आफ्नो फेसबुक, ह्वाट्सएप र साथीभाइहरूमा सेयर गरिदिनुहोला ताकि म छिट्टै आफ्नै खुट्टामा हिँड्न सफल हुन सकूँ। 
🔗 अभियान लिङ्क: {CAMPAIGN_URL}

हृदयदेखि धेरै धेरै धन्यवाद!
— विवेक भण्डारी (Bibek Bhandari)
📱 eSewa: 9861452923`
  },
  {
    id: 'ty_fb',
    channel: 'Facebook Messenger / Post Tag',
    subject: 'Facebook Gratitude & Community Share Request',
    format: `A heartfelt, deep gratitude to {DONOR_NAME} for contributing NPR {AMOUNT} via {METHOD} to my D1-D5 spinal injury recovery fund! 🌟

Every single rupee is publicly accounted for on our Facebook transparency ledger and fuels my daily neuro-rehabilitation at Neurigo360 with Dr. Pratap. 

🙏 Please share our campaign link ({CAMPAIGN_URL}) on your Facebook timeline or with your friends to help me stand and walk again! Thank you so much! ❤️♿️✨`
  }
];
