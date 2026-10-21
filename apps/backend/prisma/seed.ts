import { PrismaClient, ExamType } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

async function main() {
  console.log('🌱 Starting comprehensive Conceptly 7-track database seed...');

  // 1. Seed Demo Users
  const studentUser = await prisma.user.upsert({
    where: { id: 'usr_demo_student' },
    update: {},
    create: {
      id: 'usr_demo_student',
      email: 'student@example.com',
      displayName: 'Conceptly Learner',
      isGuest: false,
      examType: 'TECH',
      classLevel: null,
      language: 'en',
    },
  });

  const guestUser = await prisma.user.upsert({
    where: { id: 'usr_guest_default' },
    update: {},
    create: {
      id: 'usr_guest_default',
      displayName: 'Guest Learner',
      isGuest: true,
      examType: 'TECH',
      classLevel: null,
      language: 'en',
    },
  });

  console.log('✓ Users seeded:', studentUser.id, guestUser.id);

  // 2. Seed Subjects across all 7 tracks
  const subjectsData = [
    // TECH
    {
      id: 'tech-sysdesign',
      name: 'System Design & Architecture',
      labelEn: 'System Design & Architecture',
      labelHi: 'सिस्टम डिज़ाइन व आर्किटेक्चर',
      examType: 'TECH' as ExamType,
      iconName: 'server-outline',
    },
    {
      id: 'tech-backend',
      name: 'Backend & Distributed Systems',
      labelEn: 'Backend & Distributed Systems',
      labelHi: 'बैकएंड व डिस्ट्रीब्यूटेड सिस्टम',
      examType: 'TECH' as ExamType,
      iconName: 'hardware-chip-outline',
    },
    // PM
    {
      id: 'pm-product-sense',
      name: 'Product Sense & Strategy',
      labelEn: 'Product Sense & Strategy',
      labelHi: 'प्रोडक्ट डिज़ाइन व रणनीति',
      examType: 'PM' as ExamType,
      iconName: 'bulb-outline',
    },
    {
      id: 'pm-metrics',
      name: 'Metrics & Experimentation',
      labelEn: 'Metrics & Experimentation',
      labelHi: 'मैट्रिक्स और एनालिटिक्स',
      examType: 'PM' as ExamType,
      iconName: 'bar-chart-outline',
    },
    // FINANCE
    {
      id: 'fin-valuation',
      name: 'Corporate Valuation & DCF',
      labelEn: 'Corporate Valuation & DCF',
      labelHi: 'वित्तीय मूल्यांकन व डीसीएफ़',
      examType: 'FINANCE' as ExamType,
      iconName: 'cash-outline',
    },
    // UPSC
    {
      id: 'upsc-polity',
      name: 'Indian Polity & Constitution',
      labelEn: 'Indian Polity & Constitution',
      labelHi: 'भारतीय राजव्यवस्था व संविधान',
      examType: 'UPSC' as ExamType,
      iconName: 'shield-outline',
    },
    {
      id: 'upsc-economy',
      name: 'Indian Economy & Macroeconomics',
      labelEn: 'Indian Economy & Macroeconomics',
      labelHi: 'भारतीय अर्थव्यवस्था',
      examType: 'UPSC' as ExamType,
      iconName: 'trending-up-outline',
    },
    // IIT-JEE
    {
      id: 'jee-physics',
      name: 'Mechanics & Electrodynamics',
      labelEn: 'Mechanics & Electrodynamics',
      labelHi: 'यांत्रिकी व विद्युतगतिकी',
      examType: 'IIT_JEE' as ExamType,
      iconName: 'flash-outline',
    },
    {
      id: 'jee-mathematics',
      name: 'Calculus & Vectors',
      labelEn: 'Calculus & Vectors',
      labelHi: 'कलन और बीजगणित',
      examType: 'IIT_JEE' as ExamType,
      iconName: 'calculator-outline',
    },
    // NEET
    {
      id: 'neet-biology',
      name: 'Human Physiology & Genetics',
      labelEn: 'Human Physiology & Genetics',
      labelHi: 'मानव शरीर विज्ञान व आनुवंशिकी',
      examType: 'NEET' as ExamType,
      iconName: 'fitness-outline',
    },
    // SCHOOL Class 10
    {
      id: 'math-10',
      name: 'Class 10 Mathematics',
      labelEn: 'Mathematics (Class 10)',
      labelHi: 'गणित (कक्षा 10)',
      examType: 'SCHOOL' as ExamType,
      classLevel: 10,
      iconName: 'shapes-outline',
    },
    {
      id: 'science-10',
      name: 'Class 10 Science',
      labelEn: 'Science (Class 10)',
      labelHi: 'विज्ञान (कक्षा 10)',
      examType: 'SCHOOL' as ExamType,
      classLevel: 10,
      iconName: 'flask-outline',
    },
  ];

  for (const s of subjectsData) {
    await prisma.subject.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✓ Seeded ${subjectsData.length} subjects`);

  // 3. Seed Chapters for each track
  const chaptersData = [
    // Tech
    { id: 'chap-sysdesign-dist', subjectId: 'tech-sysdesign', titleEn: 'Distributed Consensus & Trade-offs', titleHi: 'डिस्ट्रीब्यूटेड कॉन्सेन्सस', order: 1 },
    { id: 'chap-sysdesign-cache', subjectId: 'tech-sysdesign', titleEn: 'High-Concurrency Caching & Storage', titleHi: 'हाई-कॉनकरेंसी कैशिंग', order: 2 },
    // PM
    { id: 'chap-pm-circles', subjectId: 'pm-product-sense', titleEn: 'CIRCLES Framework & Execution', titleHi: 'सर्कल्स फ्रेमवर्क', order: 1 },
    { id: 'chap-pm-metrics', subjectId: 'pm-metrics', titleEn: 'A/B Testing & North Star Metrics', titleHi: 'ए/बी टेस्टिंग व मैट्रिक्स', order: 1 },
    // Finance
    { id: 'chap-fin-dcf', subjectId: 'fin-valuation', titleEn: 'Discounted Cash Flow & Multiples', titleHi: 'डीसीएफ और वैल्यूएशन', order: 1 },
    { id: 'chap-fin-lbo', subjectId: 'fin-valuation', titleEn: 'LBO Modeling & Returns Decomposition', titleHi: 'एलपीओ और रिटर्न', order: 2 },
    // UPSC
    { id: 'chap-upsc-rights', subjectId: 'upsc-polity', titleEn: 'Fundamental Rights & Writs (Part III)', titleHi: 'मौलिक अधिकार', order: 1 },
    { id: 'chap-upsc-economy', subjectId: 'upsc-economy', titleEn: 'Fiscal & Monetary Policy Frameworks', titleHi: 'मौद्रिक व राजकोषीय नीति', order: 1 },
    // JEE
    { id: 'chap-jee-rot', subjectId: 'jee-physics', titleEn: 'Rotational Dynamics & Torque', titleHi: 'घूर्णन गति व बलाघूर्ण', order: 1 },
    { id: 'chap-jee-calc', subjectId: 'jee-mathematics', titleEn: 'Definite Integrals & Properties', titleHi: 'निश्चित समाकलन', order: 1 },
    // NEET
    { id: 'chap-neet-heart', subjectId: 'neet-biology', titleEn: 'Human Circulatory & Cardiac Cycle', titleHi: 'हृदय चक्र व परिसंचरण', order: 1 },
    { id: 'chap-neet-genetics', subjectId: 'neet-biology', titleEn: 'Mendelian Genetics & Inheritance', titleHi: 'मेंडेलियन आनुवंशिकी', order: 2 },
    // School
    { id: 'chap-math10-real', subjectId: 'math-10', titleEn: 'Real Numbers & Polynomials', titleHi: 'वास्तविक संख्याएँ', order: 1 },
    { id: 'chap-science10-light', subjectId: 'science-10', titleEn: 'Light: Reflection & Refraction', titleHi: 'प्रकाश का परावर्तन व अपवर्तन', order: 1 },
  ];

  for (const c of chaptersData) {
    await prisma.chapter.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log(`✓ Seeded ${chaptersData.length} chapters`);

  // 4. Seed Topics across all 7 tracks
  const topicsData = [
    // Tech Topics
    {
      id: 'topic-cap-theorem',
      chapterId: 'chap-sysdesign-dist',
      title: 'CAP Theorem & PACELC Trade-offs',
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        'In network partitions (P), you MUST choose Availability (A) or Consistency (C).',
        'PACELC: If Partition -> AP or CP; Else -> Latency (L) vs Consistency (C).',
        'AP systems: Cassandra, DynamoDB (eventual consistency).',
        'CP systems: Spanner, ZooKeeper, Raft leader-based.',
      ]),
    },
    {
      id: 'topic-cache-patterns',
      chapterId: 'chap-sysdesign-cache',
      title: 'Cache Invalidation & Stampede Defense',
      difficulty: 'medium',
      cheatSheetJson: JSON.stringify([
        'Cache-Aside: Read from cache, on miss read DB and write back.',
        'Write-Through: App writes to cache; cache writes to DB synchronously.',
        'Cache Stampede fix: Mutex lock or Probabilistic Early Expiration (XFetch).',
      ]),
    },
    // PM Topics
    {
      id: 'topic-pm-circles',
      chapterId: 'chap-pm-circles',
      title: 'The CIRCLES Framework for Product Sense',
      difficulty: 'medium',
      cheatSheetJson: JSON.stringify([
        'C: Comprehend situation (Goals, Constraints).',
        'I: Identify user personas & empathy map.',
        'R: Report user needs & pain points.',
        'C: Cut through & prioritize biggest pain point.',
        'L: List 3 bold innovative solutions.',
        'E: Evaluate trade-offs (Reach, Impact, Effort).',
        'S: Summarize recommendation & North Star metric.',
      ]),
    },
    {
      id: 'topic-pm-northstar',
      chapterId: 'chap-pm-metrics',
      title: 'North Star Metric & Experimentation',
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        'North Star Metric captures core product value delivered to users.',
        'Input metrics drive the North Star (breadth, depth, frequency).',
        'Guardrail metrics: latency, churn, battery drain, negative feedback.',
        'A/B test: minimum detectable effect, p-value < 0.05, sample power.',
      ]),
    },
    // Finance Topics
    {
      id: 'topic-fin-dcf',
      chapterId: 'chap-fin-dcf',
      title: 'DCF Valuation & WACC Fundamentals',
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        'Enterprise Value = PV of Unlevered Free Cash Flows + Terminal Value.',
        'WACC = (E/V * Re) + (D/V * Rd * (1 - T)).',
        'Unlevered FCF = EBIT * (1 - Tax) + D&A - CapEx - Change in NWC.',
      ]),
    },
    {
      id: 'topic-fin-lbo',
      chapterId: 'chap-fin-lbo',
      title: 'LBO Mechanics & Debt Paydown',
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        'LBO uses 60-80% debt to acquire a cash-generative business.',
        'Returns (IRR) driven by: EBITDA growth, multiple expansion, debt de-leveraging.',
        'Senior Bank Debt: lowest cost, first lien on assets.',
        'Subordinated/Mezzanine: higher yield, equity warrants.',
      ]),
    },
    // UPSC Topics
    {
      id: 'topic-upsc-writs',
      chapterId: 'chap-upsc-rights',
      title: 'Article 32 & Supreme Court Writs',
      difficulty: 'medium',
      cheatSheetJson: JSON.stringify([
        'Habeas Corpus: Produce the body (unlawful detention).',
        'Mandamus: We command (compel public duty).',
        'Prohibition: Lower court stays proceedings.',
        'Certiorari: Quash illegal lower order.',
        'Quo-Warranto: Challenge authority to hold public office.',
      ]),
    },
    {
      id: 'topic-upsc-fiscal',
      chapterId: 'chap-upsc-economy',
      title: 'Fiscal Deficit & Inflation Targeting',
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        'Fiscal Deficit = Total Expenditure - Total Receipts (excluding borrowings).',
        'FRBM Act targets 3% fiscal deficit for macroeconomic stability.',
        'RBI Monetary Policy Committee targets CPI 4% (+/- 2%).',
        'Twin Balance Sheet Challenge: Overleveraged corporates & NPA burden on banks.',
      ]),
    },
    // IIT-JEE Topics
    {
      id: 'topic-jee-rot',
      chapterId: 'chap-jee-rot',
      title: 'Moment of Inertia & Parallel Axis Theorem',
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        'I = Integral(r^2 dm).',
        'Parallel Axis Theorem: I = I_cm + M * d^2.',
        'Perpendicular Axis Theorem: I_z = I_x + I_y (planar bodies only).',
        'Rolling without slipping: v = omega * R; a = alpha * R.',
      ]),
    },
    {
      id: 'topic-jee-calc',
      chapterId: 'chap-jee-calc',
      title: "Definite Integrals & King's Rule",
      difficulty: 'hard',
      cheatSheetJson: JSON.stringify([
        "King's Property: Integral(a to b) f(x)dx = Integral(a to b) f(a + b - x)dx.",
        'Even/Odd property: If f(-x) = -f(x), integral from -a to a is ZERO.',
        'Leibniz Rule for differentiating under the integral sign.',
      ]),
    },
    // NEET Topics
    {
      id: 'topic-neet-cardiac',
      chapterId: 'chap-neet-heart',
      title: 'Cardiac Cycle & ECG Waveform Interpretation',
      difficulty: 'medium',
      cheatSheetJson: JSON.stringify([
        'Total Cardiac Cycle Duration: 0.8 seconds (at 72 bpm).',
        'P-wave: Atrial depolarisation (0.1s).',
        'QRS complex: Ventricular depolarisation / systole (0.3s).',
        'T-wave: Ventricular repolarisation / diastole (0.4s).',
        'Cardiac Output = Stroke Volume (70mL) * Heart Rate (72) = ~5 Litres/min.',
      ]),
    },
    {
      id: 'topic-neet-genetics',
      chapterId: 'chap-neet-genetics',
      title: 'Dihybrid Cross & Law of Independent Assortment',
      difficulty: 'medium',
      cheatSheetJson: JSON.stringify([
        'Mendel dihybrid phenotypic ratio: 9:3:3:1 in F2 generation.',
        'Law of Independent Assortment applies only to genes on different chromosomes (or far apart).',
        'Linkage (discovered by Morgan in Drosophila) deviates from 9:3:3:1.',
      ]),
    },
    // School Class 10 Topics
    {
      id: 'topic-math10-real',
      chapterId: 'chap-math10-real',
      title: 'Fundamental Theorem of Arithmetic & Proofs',
      difficulty: 'easy',
      cheatSheetJson: JSON.stringify([
        'Every composite number can be uniquely expressed as a product of primes.',
        'HCF(a, b) * LCM(a, b) = a * b (strictly for two positive integers).',
        'Proof of irrationality: assume p/q in simplest form, deduce both share a common factor.',
      ]),
    },
    {
      id: 'topic-science10-light',
      chapterId: 'chap-science10-light',
      title: 'Mirror Formula & Lens Refraction',
      difficulty: 'medium',
      cheatSheetJson: JSON.stringify([
        'Mirror Formula: 1/f = 1/v + 1/u (magnification m = -v/u).',
        'Lens Formula: 1/f = 1/v - 1/u (magnification m = +v/u).',
        'Power of a lens: P = 1/f (in meters), measured in Dioptres (D).',
      ]),
    },
  ];

  for (const t of topicsData) {
    await prisma.topic.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`✓ Seeded ${topicsData.length} topics`);

  // 5. Seed Reels with ASCII whiteboard schematics across all tracks
  const reelsData = [
    // Tech
    {
      id: 'reel-cap-1',
      topicId: 'topic-cap-theorem',
      title: 'CAP Theorem: Why You Never Have Both',
      videoUrl: SAMPLE_VIDEOS[0],
      durationSec: 42,
      keyTakeaway: 'In any distributed partition, you must trade write availability for linear consistency.',
      summaryNotesJson: JSON.stringify([
        'Network partitions are inevitable in real hardware networks.',
        'When partition occurs, node A cannot sync with node B.',
        'Accepting writes violates C; rejecting writes violates A.',
      ]),
      architectureDiagram: `┌────────────┐     Network Split     ┌────────────┐
│ Client A   │ ─────────► [Node 1] ⚡⚡ [Node 2] ◄──────── │ Client B   │
│ Write(x=2) │            (Leader) ⚡⚡ (Follower)│ Read(x)    │
└────────────┘                      ⚡⚡           └────────────┘
CP: Node 2 returns 500 / Error   │ AP: Node 2 returns stale x=1`,
      interviewPitch:
        "In an interview, never say 'I pick Consistency and Availability'. Explain that network partitions are unavoidable physics. The choice is how the system degrades: fail the write (CP) or serve stale data (AP).",
      pitfallsJson: JSON.stringify(['Trap: Claiming RDBMS gives CA in a distributed cluster.']),
    },
    {
      id: 'reel-cache-1',
      topicId: 'topic-cache-patterns',
      title: 'Cache Stampede & Dogpiling Defense',
      videoUrl: SAMPLE_VIDEOS[1],
      durationSec: 45,
      keyTakeaway: 'Prevent thousands of concurrent requests crushing DB upon hot cache TTL expiration.',
      summaryNotesJson: JSON.stringify([
        'Hot key expires -> 50,000 requests miss cache simultaneously.',
        'All 50,000 queries hit PostgreSQL directly -> connection pool exhausted.',
        'Solution: Mutex locking or Probabilistic Early Expiration (XFetch).',
      ]),
      architectureDiagram: `[10k Clients] ──► [Redis (Key Expired)]
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
 [Mutex Lock Acquired]      [Wait & Poll Cache]
       │
 [1 Query to PostgreSQL] ──► [Fill Redis & Release Lock]`,
      interviewPitch:
        'To prevent cache stampedes in high-throughput systems, use a distributed Redis mutex so only one worker recalculates the payload while others await, or apply probabilistic early background recomputation.',
      pitfallsJson: JSON.stringify(['Failing to set jitter on TTLs.']),
    },
    // PM
    {
      id: 'reel-pm-circles-1',
      topicId: 'topic-pm-circles',
      title: 'CIRCLES Framework in 45 Seconds',
      videoUrl: SAMPLE_VIDEOS[2],
      durationSec: 45,
      keyTakeaway: 'Structure product design answers by starting with user empathy before suggesting features.',
      summaryNotesJson: JSON.stringify([
        'Never jump directly to features.',
        'Anchor on the user segment and emotional pain point first.',
        'Define a measurable North Star metric.',
      ]),
      architectureDiagram: `Comprehend ──► Identify User ──► Report Needs ──► Cut & Prioritize
                                                              │
Recommend & North Star Metric ◄── Evaluate Trade-offs ◄── List Solutions`,
      interviewPitch:
        "When asked to design an app for blind passengers, I don't brainstorm UI buttons. I break down their journey: booking, boarding, and in-transit reassurance, then prioritize audio-haptic feedback.",
      pitfallsJson: JSON.stringify(['Listing solutions before identifying pain points.']),
    },
    {
      id: 'reel-pm-metrics-1',
      topicId: 'topic-pm-northstar',
      title: 'How to Pick a True North Star Metric',
      videoUrl: SAMPLE_VIDEOS[3],
      durationSec: 46,
      keyTakeaway: 'A North Star Metric aligns product value with business sustainability.',
      summaryNotesJson: JSON.stringify([
        'Good: Airbnb Nights Booked, Spotify Minutes Listened.',
        'Bad: Registered Users (vanity metric, no retention signal).',
      ]),
      architectureDiagram: `Input: User Acquisition ──┐
Input: Feature Depth ────┼──► [ NORTH STAR METRIC ] ──► Revenue / Enterprise Value
Input: Retention Rate ───┘`,
      interviewPitch:
        'A good North Star metric reflects the moment a user extracts genuine value. For a ride-sharing app, it is completed weekly trips, not registered accounts.',
      pitfallsJson: JSON.stringify(['Selecting vanity metrics like app downloads.']),
    },
    // Finance
    {
      id: 'reel-fin-dcf-1',
      topicId: 'topic-fin-dcf',
      title: 'Unlevered FCF & WACC Calculation',
      videoUrl: SAMPLE_VIDEOS[4],
      durationSec: 48,
      keyTakeaway: 'Discount cash flows available to all capital providers using WACC.',
      summaryNotesJson: JSON.stringify([
        'UFCF = EBIT * (1 - t) + D&A - CapEx - ΔNWC.',
        'WACC represents the blended expected rate of return for debt and equity.',
      ]),
      architectureDiagram: `Year 1 UFCF ──┐
Year 2 UFCF ──┼──► [Discount at WACC] ──► Present Value of Cash Flows
Year 3 UFCF ──┘                                      │
Terminal Value ──────────────────────────────────────┴──► ENTERPRISE VALUE`,
      interviewPitch:
        'A DCF values a business based on the present value of its future unlevered cash flows plus terminal value, discounted at WACC to reflect business and financing risk.',
      pitfallsJson: JSON.stringify(['Using Levered FCF with WACC.']),
    },
    {
      id: 'reel-fin-lbo-1',
      topicId: 'topic-fin-lbo',
      title: 'LBO Debt Paydown & Equity Returns',
      videoUrl: SAMPLE_VIDEOS[5],
      durationSec: 44,
      keyTakeaway: 'Debt acts as a financial lever that magnifies equity IRR upon exit.',
      summaryNotesJson: JSON.stringify([
        'Sponsor puts 30% equity, takes 70% debt.',
        'Target company cash flows pay off debt over 5 years.',
        'At exit, equity value expands dramatically even with zero EBITDA growth.',
      ]),
      architectureDiagram: `[Entry: $100M EV] ──► $70M Debt + $30M Equity
          │
[5 Years Operation] ──► Cash flows pay down debt from $70M to $20M
          │
[Exit: $100M EV]  ──► $20M Debt + $80M Equity (2.7x Return!)`,
      interviewPitch:
        'In an LBO, using debt allows the financial sponsor to fund the acquisition, using the target company free cash flows to pay down principal and maximize equity IRR.',
      pitfallsJson: JSON.stringify(['Over-leveraging cyclical businesses with fragile cash flows.']),
    },
    // UPSC
    {
      id: 'reel-upsc-writs-1',
      topicId: 'topic-upsc-writs',
      title: 'Article 32: The Heart & Soul of Constitution',
      videoUrl: SAMPLE_VIDEOS[6],
      durationSec: 40,
      keyTakeaway: 'Article 32 guarantees the right to constitutional remedies.',
      summaryNotesJson: JSON.stringify([
        'Article 32: Right to approach Supreme Court directly.',
        'Article 226: High Courts have wider jurisdiction.',
      ]),
      architectureDiagram: `Violation of Fundamental Right (Part III)
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
Article 32 (Supreme Court)  Article 226 (High Court)
[Strictly Fundamental]      [Fundamental + Legal Rights]`,
      interviewPitch:
        'Article 32 is self-enforcing: the right to move the Supreme Court for writ remedies is itself a guaranteed fundamental right, making fundamental rights justiciable.',
      pitfallsJson: JSON.stringify(['Confusing Mandamus with Quo-Warranto.']),
    },
    {
      id: 'reel-upsc-fiscal-1',
      topicId: 'topic-upsc-fiscal',
      title: 'Fiscal Deficit vs Inflation Targeting',
      videoUrl: SAMPLE_VIDEOS[7],
      durationSec: 45,
      keyTakeaway: 'Excessive fiscal deficits fuel demand-pull inflation and crowd out private investment.',
      summaryNotesJson: JSON.stringify([
        'Fiscal deficit financed by RBI monetization leads to currency depreciation.',
        'FRBM Act establishes fiscal discipline targets.',
      ]),
      architectureDiagram: `Government Borrowing ──► Higher Bond Yields ──► Crowding Out Private Credit
         │
Monetization by RBI ──► Excess Money Supply ──► CPI Inflation Spike`,
      interviewPitch:
        'Balancing growth with fiscal consolidation requires qualitative expenditure: increasing productive capital expenditure (CapEx) while trimming non-productive revenue subsidies.',
      pitfallsJson: JSON.stringify(['Assuming all government deficits are inherently harmful.']),
    },
    // IIT-JEE
    {
      id: 'reel-jee-rot-1',
      topicId: 'topic-jee-rot',
      title: 'Parallel Axis Theorem & Rolling Constraints',
      videoUrl: SAMPLE_VIDEOS[0],
      durationSec: 48,
      keyTakeaway: 'I = I_cm + M * d^2 is valid ONLY when passing through the center of mass.',
      summaryNotesJson: JSON.stringify([
        'Parallel Axis Theorem applies to 3D rigid bodies.',
        'Perpendicular Axis Theorem is strictly for 2D laminar planar objects.',
      ]),
      architectureDiagram: `      Axis through CM          Parallel Axis at distance d
             │                            │
             │           d                │
             ├───► ◄──────────────────────┤
        ( o CM ) ───────────────────────► I = I_cm + M * d^2`,
      interviewPitch:
        'In rotational mechanics, never apply the parallel axis theorem between two random axes. You must always pass through the center of mass axis first as the pivot.',
      pitfallsJson: JSON.stringify(['Applying perpendicular axis theorem to a sphere or cylinder.']),
    },
    {
      id: 'reel-jee-calc-1',
      topicId: 'topic-jee-calc',
      title: "King's Rule in Definite Integrals",
      videoUrl: SAMPLE_VIDEOS[1],
      durationSec: 42,
      keyTakeaway: "Replacing x with (a + b - x) transforms non-integrable fractions into solvable forms.",
      summaryNotesJson: JSON.stringify([
        'Add the original integral I to the transformed integral I.',
        'Numerator and denominator often simplify to 1, yielding (b - a)/2.',
      ]),
      architectureDiagram: `I = ∫[0 to π/2] (sin x) / (sin x + cos x) dx
King's: x ──► (π/2 - x)
I = ∫[0 to π/2] (cos x) / (cos x + sin x) dx
2I = ∫[0 to π/2] 1 dx = π/2  ──►  I = π/4`,
      interviewPitch:
        "Whenever you see an integral with symmetric trigonometric bounds like 0 to π/2 or a to b, test King's Property immediately: 2I often simplifies algebraically to 1.",
      pitfallsJson: JSON.stringify(['Forgetting to divide by 2 when solving for 2I.']),
    },
    // NEET
    {
      id: 'reel-neet-cardiac-1',
      topicId: 'topic-neet-cardiac',
      title: 'The 0.8s Cardiac Cycle & Heart Sounds',
      videoUrl: SAMPLE_VIDEOS[2],
      durationSec: 45,
      keyTakeaway: 'Lub sound is tricuspid/bicuspid closure; Dub sound is semilunar closure.',
      summaryNotesJson: JSON.stringify([
        'Atrial Systole: 0.1s.',
        'Ventricular Systole: 0.3s (LUB heart sound).',
        'Joint Diastole: 0.4s (DUB heart sound).',
      ]),
      architectureDiagram: `P-Wave (0.1s) ──► QRS Complex (0.3s) ──► T-Wave (0.4s)
 Atrial Depol.      Ventricular Systole     Ventricular Diastole
                         [ "LUB" ]                [ "DUB" ]`,
      interviewPitch:
        'Heart sounds are not caused by blood flow, but by the abrupt closure of valves under pressure: AV valves close at the start of ventricular systole (Lub), semilunar valves at ventricular diastole (Dub).',
      pitfallsJson: JSON.stringify(['Believing heart sounds are caused by contraction rather than valve closures.']),
    },
    {
      id: 'reel-neet-genetics-1',
      topicId: 'topic-neet-genetics',
      title: 'Mendel 9:3:3:1 Dihybrid Ratio Tricks',
      videoUrl: SAMPLE_VIDEOS[3],
      durationSec: 44,
      keyTakeaway: 'The 9:3:3:1 ratio is the product of two independent 3:1 monohybrid crosses.',
      summaryNotesJson: JSON.stringify([
        '(3:1) * (3:1) = 9 (dominant both) : 3 (dom A, rec B) : 3 (rec A, dom B) : 1 (recessive both).',
        'Gene linkage breaks independent assortment.',
      ]),
      architectureDiagram: `Round/Yellow (9)  :  Round/Green (3)  :  Wrinkled/Yellow (3)  :  Wrinkled/Green (1)
[ 3/4 * 3/4 = 9/16 ]                   [ 1/4 * 1/4 = 1/16 ]`,
      interviewPitch:
        'To solve complex multi-hybrid genetics problems rapidly in NEET, never draw a 16-square Punnett square. Calculate individual monohybrid probabilities and multiply them.',
      pitfallsJson: JSON.stringify(['Drawing 16-box Punnett grids under time pressure.']),
    },
    // School Class 10
    {
      id: 'reel-math10-real-1',
      topicId: 'topic-math10-real',
      title: 'Fundamental Theorem of Arithmetic',
      videoUrl: SAMPLE_VIDEOS[4],
      durationSec: 40,
      keyTakeaway: 'Prime factorization is unique except for the order in which factors occur.',
      summaryNotesJson: JSON.stringify([
        'HCF * LCM = Product of two numbers.',
        'Crucial for proving irrationality of √2, √3, √5.',
      ]),
      architectureDiagram: `Composite Number: 120
           │
     ┌─────┴─────┐
     2          60
                 │
           ┌─────┴─────┐
           2          30
                       │
                 ┌─────┴─────┐
                 2          15
                             │
                       ┌─────┴─────┐
                       3           5
Unique Prime Factorization: 2³ × 3¹ × 5¹`,
      interviewPitch:
        'The Fundamental Theorem guarantees that primes are the elementary atoms of integers: every composite number can be broken down uniquely into prime powers.',
      pitfallsJson: JSON.stringify(['Attempting HCF * LCM = a * b * c for three numbers (formula invalid for 3 numbers).']),
    },
    {
      id: 'reel-science10-light-1',
      topicId: 'topic-science10-light',
      title: 'Sign Convention & Lens Formula',
      videoUrl: SAMPLE_VIDEOS[5],
      durationSec: 44,
      keyTakeaway: 'Distances against the direction of incident light are negative; with incident light are positive.',
      summaryNotesJson: JSON.stringify([
        'Object distance u is ALWAYS negative in Cartesian sign convention.',
        'Focal length of convex lens is POSITIVE; concave lens is NEGATIVE.',
      ]),
      architectureDiagram: `                    Convex Lens (+)
                           │
  Incident Light ──►       │       Light Continues ──►
                           │
  [ Object u (-) ] ────────┼───────► [ Real Image v (+) ]
                           │`,
      interviewPitch:
        'In optics, 90% of mistakes come from wrong sign conventions. Always align the optic center with the Cartesian origin: object distance u is always negative.',
      pitfallsJson: JSON.stringify(['Using positive sign for object distance u.']),
    },
  ];

  for (const r of reelsData) {
    await prisma.reel.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log(`✓ Seeded ${reelsData.length} reels with whiteboard schematics`);

  // 6. Seed Quiz Questions with explanations across all tracks
  const quizData = [
    // Tech
    {
      id: 'quiz-cap-1',
      topicId: 'topic-cap-theorem',
      reelId: 'reel-cap-1',
      text: 'During a network partition in a distributed cluster, what must an AP system guarantee?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'All nodes immediately return identical linearizable data' },
        { id: 'opt-2', text: 'Every non-failing node returns a response, even if potentially stale' },
        { id: 'opt-3', text: 'Writes are paused until the network partition heals' },
        { id: 'opt-4', text: 'Consensus is reached via two-phase commit' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'Availability in CAP theorem requires that every non-failing node must return a non-error response, even if network disconnect prevents syncing the latest write.',
      order: 1,
    },
    {
      id: 'quiz-cache-1',
      topicId: 'topic-cache-patterns',
      reelId: 'reel-cache-1',
      text: 'What is the primary cause of a Cache Stampede (dogpiling)?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'A slow network cable between app and Redis' },
        { id: 'opt-2', text: 'A hot cached key expires, and thousands of concurrent requests simultaneously query DB' },
        { id: 'opt-3', text: 'Redis memory reaches maximum allocation' },
        { id: 'opt-4', text: 'Database indexes are missing' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'Cache stampede occurs when a very popular key expires, causing thousands of waiting client threads to experience a cache miss and swamp the backing database at the exact same moment.',
      order: 1,
    },
    // PM
    {
      id: 'quiz-pm-1',
      topicId: 'topic-pm-circles',
      reelId: 'reel-pm-circles-1',
      text: 'In the CIRCLES Framework for product design, what does the first "C" stand for?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'Create features' },
        { id: 'opt-2', text: 'Comprehend the situation (Goals & Constraints)' },
        { id: 'opt-3', text: 'Calculate revenue metrics' },
        { id: 'opt-4', text: 'Cut unnecessary features' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'The first step of CIRCLES is Comprehend the Situation: clarify the goal, target audience, and business constraints before proposing any solution.',
      order: 1,
    },
    {
      id: 'quiz-pm-2',
      topicId: 'topic-pm-northstar',
      reelId: 'reel-pm-metrics-1',
      text: 'Why are "Total Registered Users" considered a poor North Star Metric?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'It is too difficult to calculate' },
        { id: 'opt-2', text: 'It is a cumulative vanity metric that fails to reflect recurring active engagement or value' },
        { id: 'opt-3', text: 'It decreases over time' },
        { id: 'opt-4', text: 'It cannot be shown to investors' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'Registered users can never decrease and tell you nothing about whether users are returning or finding value. A North Star must reflect repeated value exchange.',
      order: 1,
    },
    // Finance
    {
      id: 'quiz-fin-1',
      topicId: 'topic-fin-dcf',
      reelId: 'reel-fin-dcf-1',
      text: 'Which discount rate must be used when discounting Unlevered Free Cash Flows (UFCF)?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'Cost of Equity (Re)' },
        { id: 'opt-2', text: 'Weighted Average Cost of Capital (WACC)' },
        { id: 'opt-3', text: 'Pre-tax Cost of Debt' },
        { id: 'opt-4', text: 'Risk-free Rate' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'Because UFCF belongs to both debt and equity investors, it must be discounted using the blended rate of both capital providers: WACC.',
      order: 1,
    },
    {
      id: 'quiz-fin-2',
      topicId: 'topic-fin-lbo',
      reelId: 'reel-fin-lbo-1',
      text: 'Which factor is a primary driver of private equity returns in a leveraged buyout?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'Using company cash flows to pay down third-party debt, increasing equity value' },
        { id: 'opt-2', text: 'Issuing more shares to the public' },
        { id: 'opt-3', text: 'Avoiding tax returns' },
        { id: 'opt-4', text: 'Eliminating employee salaries' },
      ]),
      correctOptionId: 'opt-1',
      explanation:
        'Debt de-leveraging is a pillar of LBO returns: as debt principal is paid off by operating cash flows, the equity value expands even without revenue growth.',
      order: 1,
    },
    // UPSC
    {
      id: 'quiz-upsc-1',
      topicId: 'topic-upsc-writs',
      reelId: 'reel-upsc-writs-1',
      text: 'Which writ is issued by the judiciary to inquire into the legality of claim of a person to a public office?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'Habeas Corpus' },
        { id: 'opt-2', text: 'Mandamus' },
        { id: 'opt-3', text: 'Quo-Warranto' },
        { id: 'opt-4', text: 'Certiorari' },
      ]),
      correctOptionId: 'opt-3',
      explanation:
        'Quo-Warranto literally means "by what authority" and prevents illegal usurpation of a public office by a person.',
      order: 1,
    },
    // JEE
    {
      id: 'quiz-jee-1',
      topicId: 'topic-jee-rot',
      reelId: 'reel-jee-rot-1',
      text: 'Under what constraint is the Perpendicular Axis Theorem (Iz = Ix + Iy) valid?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'Only for 2D laminar planar objects' },
        { id: 'opt-2', text: 'For all 3D spherical bodies' },
        { id: 'opt-3', text: 'Only when rolling without slipping' },
        { id: 'opt-4', text: 'Only when torque is zero' },
      ]),
      correctOptionId: 'opt-1',
      explanation:
        'The Perpendicular Axis Theorem is strictly applicable to two-dimensional planar laminas (like thin plates, rings, and discs), never for 3D bodies.',
      order: 1,
    },
    // NEET
    {
      id: 'quiz-neet-1',
      topicId: 'topic-neet-cardiac',
      reelId: 'reel-neet-cardiac-1',
      text: 'What mechanical event in the heart produces the first heart sound ("LUB")?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: 'Closure of semilunar valves at ventricular diastole' },
        { id: 'opt-2', text: 'Closure of atrioventricular (bicuspid and tricuspid) valves during ventricular systole' },
        { id: 'opt-3', text: 'Contraction of the aorta' },
        { id: 'opt-4', text: 'Opening of the vena cava' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'The Lub sound marks the beginning of ventricular systole caused by the sudden closure of the AV valves (mitral and tricuspid).',
      order: 1,
    },
    // School
    {
      id: 'quiz-school-1',
      topicId: 'topic-math10-real',
      reelId: 'reel-math10-real-1',
      text: 'If HCF(a, b) = 12 and a × b = 1800, what is LCM(a, b)?',
      optionsJson: JSON.stringify([
        { id: 'opt-1', text: '120' },
        { id: 'opt-2', text: '150' },
        { id: 'opt-3', text: '180' },
        { id: 'opt-4', text: '200' },
      ]),
      correctOptionId: 'opt-2',
      explanation:
        'LCM(a, b) = (a × b) / HCF(a, b) = 1800 / 12 = 150.',
      order: 1,
    },
  ];

  for (const q of quizData) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    });
  }
  console.log(`✓ Seeded ${quizData.length} quiz questions`);

  // 7. Seed Flashcards across all tracks
  const flashcardData = [
    {
      id: 'fc-cap-1',
      topicId: 'topic-cap-theorem',
      frontQuestion: 'What does the P in CAP Theorem stand for, and can it be omitted?',
      backAnswer: 'Partition Tolerance. In real networks, delays and dropped packets are physical realities, so P cannot be negotiated away.',
      bulletsJson: JSON.stringify([
        'P is non-negotiable in distributed networks.',
        'Systems choose between C (reject writes) or A (allow stale writes).',
      ]),
    },
    {
      id: 'fc-pm-1',
      topicId: 'topic-pm-circles',
      frontQuestion: 'What are the 7 stages of the CIRCLES framework for product design?',
      backAnswer: 'Comprehend situation, Identify personas, Report user needs, Cut & prioritize, List solutions, Evaluate trade-offs, Summarize.',
      bulletsJson: JSON.stringify([
        'Never jump directly to feature solutions.',
        'Always anchor on user empathy first.',
      ]),
    },
    {
      id: 'fc-fin-1',
      topicId: 'topic-fin-dcf',
      frontQuestion: 'What is the formula for Unlevered Free Cash Flow (UFCF)?',
      backAnswer: 'UFCF = EBIT × (1 - Tax Rate) + D&A - CapEx - ΔNWC.',
      bulletsJson: JSON.stringify([
        'Represents cash available to both equity and debt capital providers.',
        'Must be discounted using WACC, not Cost of Equity.',
      ]),
    },
    {
      id: 'fc-upsc-1',
      topicId: 'topic-upsc-writs',
      frontQuestion: 'What is the difference in writ jurisdiction between Article 32 and Article 226?',
      backAnswer: 'Article 32 (Supreme Court) is strictly for Fundamental Rights. Article 226 (High Courts) covers Fundamental Rights + ordinary legal rights.',
      bulletsJson: JSON.stringify([
        'Article 226 has wider constitutional scope than Article 32.',
        'Article 32 itself is a guaranteed Fundamental Right.',
      ]),
    },
    {
      id: 'fc-jee-1',
      topicId: 'topic-jee-rot',
      frontQuestion: 'What is the Parallel Axis Theorem formula?',
      backAnswer: 'I = I_cm + M × d², where I_cm is the moment of inertia about a parallel axis passing through the Center of Mass.',
      bulletsJson: JSON.stringify([
        'One of the two parallel axes MUST pass through the Center of Mass.',
        'Applies to any rigid 3D object.',
      ]),
    },
    {
      id: 'fc-neet-1',
      topicId: 'topic-neet-cardiac',
      frontQuestion: 'What does the QRS complex in a standard ECG represent?',
      backAnswer: 'Ventricular depolarisation, which initiates ventricular contraction (systole).',
      bulletsJson: JSON.stringify([
        'Masks atrial repolarisation.',
        'Followed immediately by the first heart sound (Lub).',
      ]),
    },
    {
      id: 'fc-school-1',
      topicId: 'topic-math10-real',
      frontQuestion: 'What is the relationship between HCF and LCM for two positive integers?',
      backAnswer: 'HCF(a, b) × LCM(a, b) = a × b.',
      bulletsJson: JSON.stringify([
        'Strictly valid only for two numbers.',
        'Does NOT hold for three numbers a, b, c.',
      ]),
    },
  ];

  for (const fc of flashcardData) {
    await prisma.flashcard.upsert({
      where: { id: fc.id },
      update: fc,
      create: fc,
    });
  }
  console.log(`✓ Seeded ${flashcardData.length} flashcards`);

  // 8. Seed Pre-populated Progress & Bookmarks for Demo Student
  await prisma.topicProgress.upsert({
    where: {
      userId_topicId: {
        userId: 'usr_demo_student',
        topicId: 'topic-cap-theorem',
      },
    },
    update: { completionPercent: 100, quizScore: 100 },
    create: {
      userId: 'usr_demo_student',
      topicId: 'topic-cap-theorem',
      completionPercent: 100,
      quizScore: 100,
    },
  });

  await prisma.topicProgress.upsert({
    where: {
      userId_topicId: {
        userId: 'usr_demo_student',
        topicId: 'topic-cache-patterns',
      },
    },
    update: { completionPercent: 60, quizScore: 50 },
    create: {
      userId: 'usr_demo_student',
      topicId: 'topic-cache-patterns',
      completionPercent: 60,
      quizScore: 50,
    },
  });

  await prisma.bookmark.upsert({
    where: {
      userId_topicId_reelId: {
        userId: 'usr_demo_student',
        topicId: 'topic-cap-theorem',
        reelId: 'reel-cap-1',
      },
    },
    update: {},
    create: {
      userId: 'usr_demo_student',
      topicId: 'topic-cap-theorem',
      reelId: 'reel-cap-1',
    },
  });

  console.log('✅ Conceptly comprehensive 7-track database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
