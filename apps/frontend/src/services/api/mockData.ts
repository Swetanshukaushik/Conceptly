import type {
  ChapterDto,
  ClassLevelDto,
  SubjectDto,
  TopicDto,
  TopicDetailDto,
  ReelDto,
  QuizDto,
  TopicProgressDto,
  BookmarkDto,
  HomeFeedDto,
  FlashcardDto,
  TrendingReelDto,
  TrendingBadgeType,
  TrendingReelSortBy,
  TrendingTimeWindow,
  CommunityReelFeedResponseDto,
} from './types';

// ==========================================
// 1. CLASS LEVELS
// ==========================================
export const mockClasses: ClassLevelDto[] = [
  { id: 6, label: { en: 'Class 6', hi: 'कक्षा 6' } },
  { id: 7, label: { en: 'Class 7', hi: 'कक्षा 7' } },
  { id: 8, label: { en: 'Class 8', hi: 'कक्षा 8' } },
  { id: 9, label: { en: 'Class 9', hi: 'कक्षा 9' } },
  { id: 10, label: { en: 'Class 10', hi: 'कक्षा 10' } },
];

export const mockSubjectsByClass: Record<number, SubjectDto[]> = {
  10: [
    { id: 'math-10', label: { en: 'Mathematics', hi: 'गणित' } },
    { id: 'science-10', label: { en: 'Science', hi: 'विज्ञान' } },
    { id: 'history-10', label: { en: 'Social Science', hi: 'सामाजिक विज्ञान' } },
    { id: 'english-10', label: { en: 'English', hi: 'अंग्रेज़ी' } },
  ],
  6: [
    { id: 'math-6', label: { en: 'Mathematics', hi: 'गणित' } },
    { id: 'science-6', label: { en: 'Science', hi: 'विज्ञान' } },
  ],
};

// ==========================================
// 2. TARGET DOMAINS & SUBJECTS
// ==========================================
export const mockSubjectsByExamType: Record<string, SubjectDto[]> = {
  TECH_INTERVIEW: [
    { id: 'tech-sysdesign', label: { en: 'System Design & Arch', hi: 'सिस्टम डिज़ाइन' } },
    { id: 'tech-dsa', label: { en: 'DSA & Coding Patterns', hi: 'डेटा स्ट्रक्चर व एल्गोरिद्म' } },
    { id: 'tech-frontend', label: { en: 'Frontend & React Internals', hi: 'फ़्रंटएंड और रिएक्ट' } },
    { id: 'tech-backend', label: { en: 'Backend & Databases', hi: 'बैकएंड व डेटाबेस' } },
  ],
  PM_INTERVIEW: [
    { id: 'pm-product-sense', label: { en: 'Product Sense & CIRCLES', hi: 'प्रोडक्ट डिज़ाइन' } },
    { id: 'pm-metrics', label: { en: 'Execution & Metrics (A/B Test)', hi: 'मैट्रिक्स और एनालिटिक्स' } },
    { id: 'pm-behavioral', label: { en: 'Leadership & Behavioral', hi: 'बिहेवियरल व लीडरशिप' } },
  ],
  FINANCE_CONSULTING: [
    { id: 'fin-consulting', label: { en: 'Case Interview Frameworks', hi: 'केस इंटरव्यू फ़्रेमवर्क' } },
    { id: 'fin-valuation', label: { en: 'DCF & Financial Valuation', hi: 'वित्तीय मूल्यांकन' } },
  ],
  UPSC: [
    { id: 'upsc-polity', label: { en: 'Indian Polity & Constitution', hi: 'भारतीय राजव्यवस्था' } },
    { id: 'upsc-history', label: { en: 'Modern Indian History', hi: 'आधुनिक भारत का इतिहास' } },
    { id: 'upsc-economy', label: { en: 'Indian Economy & Macro Policy', hi: 'भारतीय अर्थव्यवस्था' } },
  ],
  IIT_JEE: [
    { id: 'jee-physics', label: { en: 'Physics (Mechanics & Electro)', hi: 'भौतिकी' } },
    { id: 'jee-chemistry', label: { en: 'Chemistry (Organic & Physical)', hi: 'रसायन विज्ञान' } },
    { id: 'jee-mathematics', label: { en: 'Mathematics (Calculus & Vectors)', hi: 'गणित' } },
  ],
  NEET: [
    { id: 'neet-biology', label: { en: 'Biology (Physiology & Genetics)', hi: 'जीव विज्ञान' } },
    { id: 'neet-physics', label: { en: 'Physics for Medical (Optics)', hi: 'भौतिकी' } },
  ],
  SCHOOL: [
    { id: 'math-10', label: { en: 'Class 10 Mathematics', hi: 'कक्षा 10 गणित' } },
    { id: 'science-10', label: { en: 'Class 10 Science', hi: 'कक्षा 10 विज्ञान' } },
  ],
};

// ==========================================
// 3. CHAPTERS BY SUBJECT
// ==========================================
export const mockChaptersBySubject: Record<string, ChapterDto[]> = {
  // Tech: System Design
  'tech-sysdesign': [
    { id: 'ch-sd-distributed', subjectId: 'tech-sysdesign', title: { en: 'Distributed Core Concepts', hi: 'डिस्ट्रिब्यूटेड सिस्टम' } },
    { id: 'ch-sd-caching', subjectId: 'tech-sysdesign', title: { en: 'Caching & Rate Limiting', hi: 'कैशिंग व रेट लिमिटिंग' } },
    { id: 'ch-sd-scaling', subjectId: 'tech-sysdesign', title: { en: 'Scaling & Message Queues', hi: 'मैसेज क्यू एवं स्केलिंग' } },
  ],
  // Tech: DSA
  'tech-dsa': [
    { id: 'ch-dsa-two-pointers', subjectId: 'tech-dsa', title: { en: 'Two Pointers & Sliding Window', hi: 'टू पॉइंटर्स एवं स्लाइडिंग विंडो' } },
    { id: 'ch-dsa-trees-graphs', subjectId: 'tech-dsa', title: { en: 'Trees, BFS & Graph Patterns', hi: 'ट्री एवं ग्राफ़' } },
    { id: 'ch-dsa-dp', subjectId: 'tech-dsa', title: { en: 'Dynamic Programming Patterns', hi: 'डायनामिक प्रोग्रामिंग' } },
  ],
  // Tech: Frontend
  'tech-frontend': [
    { id: 'ch-fe-react-internals', subjectId: 'tech-frontend', title: { en: 'React 19 & Fiber Architecture', hi: 'रिएक्ट आर्किटेक्चर' } },
    { id: 'ch-fe-performance', subjectId: 'tech-frontend', title: { en: 'Web Vitals & Performance', hi: 'वेब परफ़ॉर्मेंस' } },
  ],
  // Tech: Backend & DB
  'tech-backend': [
    { id: 'ch-be-indexing', subjectId: 'tech-backend', title: { en: 'Database Indexing & B-Trees', hi: 'डेटाबेस इंडेक्सिंग' } },
    { id: 'ch-be-concurrency', subjectId: 'tech-backend', title: { en: 'ACID & Isolation Levels', hi: 'ट्रांज़ैक्शन व आइसोलेशन' } },
  ],

  // PM: Product Sense
  'pm-product-sense': [
    { id: 'ch-pm-circles', subjectId: 'pm-product-sense', title: { en: 'CIRCLES Framework for Product Design', hi: 'सर्कल्स फ्रेमवर्क' } },
    { id: 'ch-pm-rca', subjectId: 'pm-product-sense', title: { en: 'Root Cause & Metric Drop Analysis', hi: 'रूट कॉज़ एनालिसिस' } },
  ],
  // PM: Metrics
  'pm-metrics': [
    { id: 'ch-pm-ab-testing', subjectId: 'pm-metrics', title: { en: 'A/B Testing & Statistical Significance', hi: 'ए/बी टेस्टिंग' } },
  ],
  // PM: Leadership
  'pm-behavioral': [
    { id: 'ch-pm-stakeholder', subjectId: 'pm-behavioral', title: { en: 'Influence Without Authority', hi: 'स्टेकहोल्डर मैनेजमेंट' } },
  ],

  // Finance & Consulting
  'fin-consulting': [
    { id: 'ch-fin-profitability', subjectId: 'fin-consulting', title: { en: 'Profitability & Market Entry Trees', hi: 'प्रॉफ़िटेबिलिटी फ़्रेमवर्क' } },
  ],
  'fin-valuation': [
    { id: 'ch-fin-dcf', subjectId: 'fin-valuation', title: { en: 'DCF & Multiples Valuation', hi: 'वित्तीय मूल्यांकन' } },
  ],

  // UPSC
  'upsc-polity': [
    { id: 'ch-preamble', subjectId: 'upsc-polity', title: { en: 'Preamble & Basic Structure', hi: 'प्रस्तावना एवं संविधान' } },
    { id: 'ch-fundamental-rights', subjectId: 'upsc-polity', title: { en: 'Fundamental Rights & Writs', hi: 'मौलिक अधिकार' } },
  ],
  'upsc-history': [
    { id: 'ch-freedom-struggle', subjectId: 'upsc-history', title: { en: 'Indian National Movement', hi: 'भारतीय स्वतंत्रता संग्राम' } },
  ],
  'upsc-economy': [
    { id: 'ch-monetary-policy', subjectId: 'upsc-economy', title: { en: 'RBI & Monetary Policy Framework', hi: 'मौद्रिक नीति' } },
  ],

  // IIT-JEE
  'jee-physics': [
    { id: 'ch-jee-rotational', subjectId: 'jee-physics', title: { en: 'Rotational Motion & Dynamics', hi: 'घूर्णन गति' } },
    { id: 'ch-jee-electrostatics', subjectId: 'jee-physics', title: { en: 'Electrostatics & Gauss Law', hi: 'स्थिरवैद्युतिकी' } },
  ],
  'jee-chemistry': [
    { id: 'ch-jee-organic', subjectId: 'jee-chemistry', title: { en: 'SN1 vs SN2 Reaction Mechanisms', hi: 'अभिक्रिया क्रियाविधि' } },
    { id: 'ch-jee-thermo', subjectId: 'jee-chemistry', title: { en: 'Thermodynamics & Spontaneity', hi: 'ऊष्मागतिकी' } },
  ],
  'jee-mathematics': [
    { id: 'ch-jee-calculus', subjectId: 'jee-mathematics', title: { en: 'Definite Integration & Leibniz Rule', hi: 'निश्चित समाकलन' } },
  ],

  // NEET
  'neet-biology': [
    { id: 'ch-neet-circulatory', subjectId: 'neet-biology', title: { en: 'Human Circulatory System & ECG', hi: 'परिसंचरण तंत्र' } },
    { id: 'ch-neet-genetics', subjectId: 'neet-biology', title: { en: 'Mendelian Genetics & Crosses', hi: 'आनुवंशिकी' } },
  ],
  'neet-physics': [
    { id: 'ch-neet-optics', subjectId: 'neet-physics', title: { en: 'Ray Optics & Total Internal Reflection', hi: 'प्रकाशिकी' } },
  ],

  // School Class 10
  'math-10': [
    { id: 'ch-real-numbers', subjectId: 'math-10', title: { en: 'Real Numbers & Division Lemma', hi: 'वास्तविक संख्याएँ' } },
    { id: 'ch-trigonometry', subjectId: 'math-10', title: { en: 'Trigonometric Identities & Heights', hi: 'त्रिकोणमिति' } },
  ],
  'science-10': [
    { id: 'ch-chemical-reactions', subjectId: 'science-10', title: { en: 'Chemical Reactions & Redox', hi: 'रासायनिक अभिक्रियाएं' } },
    { id: 'ch-electricity', subjectId: 'science-10', title: { en: 'Electricity & Ohms Law', hi: 'विद्युत' } },
  ],
};

// ==========================================
// 4. TOPICS LIST
// ==========================================
export const mockTopics: TopicDto[] = [
  // Tech: System Design
  { id: 'topic-cap-theorem', title: 'CAP Theorem & PACELC Trade-offs', difficulty: 'Medium', chapterId: 'ch-sd-distributed', reelCount: 3 },
  { id: 'topic-consistent-hashing', title: 'Consistent Hashing & Ring Rebalancing', difficulty: 'Hard', chapterId: 'ch-sd-distributed', reelCount: 2 },
  { id: 'topic-rate-limiting', title: 'Token Bucket vs Leaky Bucket Rate Limiting', difficulty: 'Medium', chapterId: 'ch-sd-caching', reelCount: 2 },
  { id: 'topic-cdn-caching', title: 'Cache Invalidation Strategies (Write-Through vs Behind)', difficulty: 'Medium', chapterId: 'ch-sd-caching', reelCount: 2 },
  { id: 'topic-kafka-queues', title: 'Kafka Partitions, Consumer Groups & Offsets', difficulty: 'Hard', chapterId: 'ch-sd-scaling', reelCount: 2 },

  // Tech: DSA
  { id: 'topic-two-sum-twopointers', title: 'Two Pointers Pattern for Sorted Arrays', difficulty: 'Easy', chapterId: 'ch-dsa-two-pointers', reelCount: 2 },
  { id: 'topic-sliding-window-max', title: 'Sliding Window: Fixed vs Dynamic Window', difficulty: 'Medium', chapterId: 'ch-dsa-two-pointers', reelCount: 2 },
  { id: 'topic-tree-diameter', title: 'Diameter of Binary Tree & Postorder DFS', difficulty: 'Medium', chapterId: 'ch-dsa-trees-graphs', reelCount: 2 },
  { id: 'topic-graph-cycle', title: 'Cycle Detection in Directed Graphs with Kahns BFS', difficulty: 'Hard', chapterId: 'ch-dsa-trees-graphs', reelCount: 2 },
  { id: 'topic-dp-knapsack', title: '0/1 Knapsack Pattern & Space Optimization', difficulty: 'Hard', chapterId: 'ch-dsa-dp', reelCount: 2 },

  // Tech: Frontend
  { id: 'topic-react-fiber', title: 'React Fiber: WorkLoop, Reconciliation & Concurrency', difficulty: 'Hard', chapterId: 'ch-fe-react-internals', reelCount: 3 },
  { id: 'topic-core-web-vitals', title: 'LCP, INP & CLS Optimization in Modern Apps', difficulty: 'Medium', chapterId: 'ch-fe-performance', reelCount: 2 },

  // Tech: Backend & DB
  { id: 'topic-btree-indexes', title: 'B+ Tree Indexes vs Hash Indexes in PostgreSQL', difficulty: 'Hard', chapterId: 'ch-be-indexing', reelCount: 2 },
  { id: 'topic-acid-isolation', title: 'Read Committed vs Repeatable Read & MVCC', difficulty: 'Hard', chapterId: 'ch-be-concurrency', reelCount: 2 },

  // PM
  { id: 'topic-circles-method', title: 'Mastering the CIRCLES Framework for Interviews', difficulty: 'Medium', chapterId: 'ch-pm-circles', reelCount: 2 },
  { id: 'topic-metric-drop', title: 'Diagnosing a 15% Drop in Ride Bookings', difficulty: 'Hard', chapterId: 'ch-pm-rca', reelCount: 2 },
  { id: 'topic-ab-significance', title: 'A/B Test Significance: P-Value & Sample Size', difficulty: 'Medium', chapterId: 'ch-pm-ab-testing', reelCount: 2 },
  { id: 'topic-pushback-eng', title: 'Handling Engineering Pushback on Scope', difficulty: 'Medium', chapterId: 'ch-pm-stakeholder', reelCount: 2 },

  // Finance & Consulting
  { id: 'topic-profitability-tree', title: 'Profitability Tree: Deconstructing Margins', difficulty: 'Medium', chapterId: 'ch-fin-profitability', reelCount: 2 },
  { id: 'topic-dcf-wacc', title: 'DCF Valuation & Calculating WACC Step-by-Step', difficulty: 'Hard', chapterId: 'ch-fin-dcf', reelCount: 2 },

  // UPSC
  { id: 'topic-preamble-ideals', title: 'Sovereign, Socialist, Secular & Republic Ideals', difficulty: 'Medium', chapterId: 'ch-preamble', reelCount: 2 },
  { id: 'topic-basic-structure', title: 'Basic Structure Doctrine & Judicial Review', difficulty: 'Hard', chapterId: 'ch-preamble', reelCount: 2 },
  { id: 'topic-article-21', title: 'Article 21: Right to Life & Privacy Jurisprudence', difficulty: 'Medium', chapterId: 'ch-fundamental-rights', reelCount: 2 },
  { id: 'topic-1857-revolt', title: 'Revolt of 1857: Causes & Crown Proclamation', difficulty: 'Medium', chapterId: 'ch-freedom-struggle', reelCount: 2 },
  { id: 'topic-repo-inflation', title: 'Repo Rate, Reverse Repo & Inflation Targeting', difficulty: 'Medium', chapterId: 'ch-monetary-policy', reelCount: 2 },

  // IIT-JEE
  { id: 'topic-moment-inertia', title: 'Parallel & Perpendicular Axis Theorems', difficulty: 'Hard', chapterId: 'ch-jee-rotational', reelCount: 2 },
  { id: 'topic-gauss-flux', title: 'Electric Flux & Gauss Law for Continuous Charge', difficulty: 'Hard', chapterId: 'ch-jee-electrostatics', reelCount: 2 },
  { id: 'topic-sn1-sn2', title: 'SN1 vs SN2 Mechanisms & Stereochemistry', difficulty: 'Medium', chapterId: 'ch-jee-organic', reelCount: 2 },
  { id: 'topic-thermo-gibbs', title: 'Gibbs Free Energy & Spontaneity (ΔG = ΔH - TΔS)', difficulty: 'Hard', chapterId: 'ch-jee-thermo', reelCount: 2 },
  { id: 'topic-leibniz-integral', title: 'Leibniz Rule for Differentiation under Integral', difficulty: 'Hard', chapterId: 'ch-jee-calculus', reelCount: 2 },

  // NEET
  { id: 'topic-cardiac-cycle', title: 'Cardiac Cycle, ECG Waves & Double Circulation', difficulty: 'Medium', chapterId: 'ch-neet-circulatory', reelCount: 2 },
  { id: 'topic-mendelian-genetics', title: 'Mendels Laws & Dihybrid Cross Ratios (9:3:3:1)', difficulty: 'Medium', chapterId: 'ch-neet-genetics', reelCount: 2 },
  { id: 'topic-total-internal-reflection', title: 'Total Internal Reflection & Critical Angle', difficulty: 'Easy', chapterId: 'ch-neet-optics', reelCount: 2 },

  // School Class 10
  { id: 'topic-euclid', title: "Euclid's Division Lemma & Fundamental Theorem", difficulty: 'Easy', chapterId: 'ch-real-numbers', reelCount: 2 },
  { id: 'topic-trig-identities', title: 'Trigonometric Ratios & Pythagorean Identities', difficulty: 'Medium', chapterId: 'ch-trigonometry', reelCount: 2 },
  { id: 'topic-redox-reactions', title: 'Oxidation, Reduction & Balancing Redox Equations', difficulty: 'Medium', chapterId: 'ch-chemical-reactions', reelCount: 2 },
  { id: 'topic-ohms-law', title: 'Ohms Law, Resistance in Series and Parallel', difficulty: 'Easy', chapterId: 'ch-electricity', reelCount: 2 },
];

// Helper to construct TopicDetailDto
function buildTopicDetail(
  id: string,
  title: string,
  difficulty: string,
  chapterId: string,
  chapterTitle: string,
  subjectId: string,
  subjectName: string,
  reelCount: number,
  notes: string[]
): TopicDetailDto {
  return {
    id,
    title,
    difficulty,
    chapterId,
    reelCount,
    chapter: { id: chapterId, title: chapterTitle },
    subject: { id: subjectId, name: subjectName, classLevel: 0 },
    cheatSheetSummary: notes,
  };
}

// ==========================================
// 5. TOPIC DETAILS
// ==========================================
export const mockTopicDetails: TopicDetailDto[] = [
  buildTopicDetail('topic-cap-theorem', 'CAP Theorem & PACELC Trade-offs', 'Medium', 'ch-sd-distributed', 'Distributed Core Concepts', 'tech-sysdesign', 'System Design & Arch', 3, [
    'Consistency (C): Every read gets the most recent write or error.',
    'Availability (A): Every non-failing node returns a response, but may not be most recent.',
    'Partition Tolerance (P): System continues operating despite network message drops.',
    'PACELC: If Partition (P), choose A or C; Else (E), choose Latency (L) or Consistency (C).',
  ]),
  buildTopicDetail('topic-consistent-hashing', 'Consistent Hashing & Ring Rebalancing', 'Hard', 'ch-sd-distributed', 'Distributed Core Concepts', 'tech-sysdesign', 'System Design & Arch', 2, [
    'Maps both cache servers and keys onto a 2^32 circular ring.',
    'Adding/removing a server only reassigns k / N keys.',
    'Virtual nodes prevent memory hotspots and balance ring distribution.',
  ]),
  buildTopicDetail('topic-rate-limiting', 'Token Bucket vs Leaky Bucket Rate Limiting', 'Medium', 'ch-sd-caching', 'Caching & Rate Limiting', 'tech-sysdesign', 'System Design & Arch', 2, [
    'Token bucket allows bursts up to bucket capacity B.',
    'Leaky bucket forces strict constant outflow rate.',
    'Sliding window in Redis uses Sorted Set (ZSET) with millisecond timestamps.',
  ]),
  buildTopicDetail('topic-cdn-caching', 'Cache Invalidation Strategies (Write-Through vs Behind)', 'Medium', 'ch-sd-caching', 'Caching & Rate Limiting', 'tech-sysdesign', 'System Design & Arch', 2, [
    'Write-Through: Data written to cache and DB simultaneously (higher write latency).',
    'Write-Behind (Write-Back): Data written to cache immediately, flushed to DB asynchronously.',
    'Cache-Aside: Application reads from cache; on miss, queries DB and populates cache.',
  ]),
  buildTopicDetail('topic-kafka-queues', 'Kafka Partitions, Consumer Groups & Offsets', 'Hard', 'ch-sd-scaling', 'Scaling & Message Queues', 'tech-sysdesign', 'System Design & Arch', 2, [
    'Topics split into ordered partitions for horizontal throughput.',
    'Consumer groups guarantee each partition is read by exactly one active consumer.',
    'Offset commits maintain position without locking queues.',
  ]),
  buildTopicDetail('topic-two-sum-twopointers', 'Two Pointers Pattern for Sorted Arrays', 'Easy', 'ch-dsa-two-pointers', 'Two Pointers & Sliding Window', 'tech-dsa', 'DSA & Coding Patterns', 2, [
    'Left at 0, Right at N - 1 on sorted input.',
    'If sum < target: increment left; if sum > target: decrement right.',
    'Runs in O(N) time with O(1) space.',
  ]),
  buildTopicDetail('topic-sliding-window-max', 'Sliding Window: Fixed vs Dynamic Window', 'Medium', 'ch-dsa-two-pointers', 'Two Pointers & Sliding Window', 'tech-dsa', 'DSA & Coding Patterns', 2, [
    'Maintain running window state without recomputing from scratch.',
    'Fixed size K: slide both left and right simultaneously.',
    'Dynamic size: expand right to satisfy condition, contract left to optimize.',
  ]),
  buildTopicDetail('topic-tree-diameter', 'Diameter of Binary Tree & Postorder DFS', 'Medium', 'ch-dsa-trees-graphs', 'Trees, BFS & Graph Patterns', 'tech-dsa', 'DSA & Coding Patterns', 2, [
    'Diameter = maximum distance between any two leaf nodes.',
    'Calculate left depth and right depth at each node; update max diameter.',
    'Runs in O(N) postorder recursion.',
  ]),
  buildTopicDetail('topic-graph-cycle', 'Cycle Detection in Directed Graphs with Kahns BFS', 'Hard', 'ch-dsa-trees-graphs', 'Trees, BFS & Graph Patterns', 'tech-dsa', 'DSA & Coding Patterns', 2, [
    'Compute in-degree for all vertices.',
    'Push in-degree 0 nodes to queue; if topological sort count < V, a cycle exists.',
  ]),
  buildTopicDetail('topic-dp-knapsack', '0/1 Knapsack Pattern & Space Optimization', 'Hard', 'ch-dsa-dp', 'Dynamic Programming Patterns', 'tech-dsa', 'DSA & Coding Patterns', 2, [
    'Choice at each item: Include or Exclude.',
    '2D DP: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]).',
    'Space optimizes from O(N*W) to 1D O(W) iterating backwards.',
  ]),
  buildTopicDetail('topic-react-fiber', 'React Fiber: WorkLoop, Reconciliation & Concurrency', 'Hard', 'ch-fe-react-internals', 'React 19 & Fiber Architecture', 'tech-frontend', 'Frontend & React Internals', 3, [
    'Linked-list Fiber data structure replaces recursive stack reconciler.',
    'Work can be paused, prioritized, and resumed across animation frames.',
    'Double buffering maintains current tree and work-in-progress (wip) tree.',
  ]),
  buildTopicDetail('topic-core-web-vitals', 'LCP, INP & CLS Optimization in Modern Apps', 'Medium', 'ch-fe-performance', 'Web Vitals & Performance', 'tech-frontend', 'Frontend & React Internals', 2, [
    'Largest Contentful Paint (LCP) < 2.5s: Optimize hero images & preconnect.',
    'Interaction to Next Paint (INP) < 200ms: Yield main thread with startTransition.',
    'Cumulative Layout Shift (CLS) < 0.1: Reserve width/height aspect ratios.',
  ]),
  buildTopicDetail('topic-btree-indexes', 'B+ Tree Indexes vs Hash Indexes in PostgreSQL', 'Hard', 'ch-be-indexing', 'Database Indexing & B-Trees', 'tech-backend', 'Backend & Databases', 2, [
    'B+ Tree stores data in sorted leaves connected by doubly linked list (range queries).',
    'Hash indexes only support exact equality (=) lookups.',
    'Covering index with INCLUDE avoids table heap access entirely.',
  ]),
  buildTopicDetail('topic-acid-isolation', 'Read Committed vs Repeatable Read & MVCC', 'Hard', 'ch-be-concurrency', 'ACID & Isolation Levels', 'tech-backend', 'Backend & Databases', 2, [
    'Read Committed sees latest committed transaction snapshots.',
    'Repeatable Read freezes snapshot from start of transaction.',
    'Postgres MVCC uses xmin and xmax transaction IDs on tuple headers.',
  ]),
  buildTopicDetail('topic-circles-method', 'Mastering the CIRCLES Framework for Interviews', 'Medium', 'ch-pm-circles', 'CIRCLES Framework for Product Design', 'pm-product-sense', 'Product Sense & CIRCLES', 2, [
    'Comprehend situation, Identify customer, Report customer needs.',
    'Cut, prioritized needs, List solutions, Evaluate trade-offs, Summarize.',
  ]),
  buildTopicDetail('topic-metric-drop', 'Diagnosing a 15% Drop in Ride Bookings', 'Hard', 'ch-pm-rca', 'Root Cause & Metric Drop Analysis', 'pm-product-sense', 'Product Sense & CIRCLES', 2, [
    'Clarify metric definition & timeframe.',
    'Segment by geography, platform (iOS/Android), and user cohorts.',
    'Check internal changes (app release, pricing bug) vs external (weather, holiday, competitor).',
  ]),
  buildTopicDetail('topic-ab-significance', 'A/B Test Significance: P-Value & Sample Size', 'Medium', 'ch-pm-ab-testing', 'A/B Testing & Statistical Significance', 'pm-metrics', 'Execution & Metrics (A/B Test)', 2, [
    'Null Hypothesis H0 vs Alternative Hypothesis H1.',
    'p < 0.05 indicates less than 5% probability observed difference is random noise.',
    'Avoid peeking problem (false positives) using fixed-horizon or sequential testing.',
  ]),
  buildTopicDetail('topic-pushback-eng', 'Handling Engineering Pushback on Scope', 'Medium', 'ch-pm-stakeholder', 'Influence Without Authority', 'pm-behavioral', 'Leadership & Behavioral', 2, [
    'Listen and validate technical debt or architectural constraints.',
    'Deconstruct feature into MVP slices: Must-have vs Fast-follow.',
    'Align engineering incentives with user impact data.',
  ]),
  buildTopicDetail('topic-profitability-tree', 'Profitability Tree: Deconstructing Margins', 'Medium', 'ch-fin-profitability', 'Profitability & Market Entry Trees', 'fin-consulting', 'Case Interview Frameworks', 2, [
    'Profit = Revenue - Total Cost.',
    'Revenue = Price * Volume (segment by customer, channel, product).',
    'Costs = Fixed Costs + Variable Costs (cost per unit * volume).',
  ]),
  buildTopicDetail('topic-dcf-wacc', 'DCF Valuation & Calculating WACC Step-by-Step', 'Hard', 'ch-fin-dcf', 'DCF & Multiples Valuation', 'fin-valuation', 'DCF & Financial Valuation', 2, [
    'Enterprise Value = Present Value of Projected FCF + Terminal Value.',
    'WACC = (E/V * Re) + (D/V * Rd * (1 - T)).',
    'Cost of Equity via CAPM: Re = Rf + Beta * (Rm - Rf).',
  ]),
  buildTopicDetail('topic-preamble-ideals', 'Sovereign, Socialist, Secular & Republic Ideals', 'Medium', 'ch-preamble', 'Preamble & Basic Structure', 'upsc-polity', 'Indian Polity & Constitution', 2, [
    'Preamble serves as preface and philosophical key to the Constitution.',
    '42nd Constitutional Amendment Act (1976) added Socialist, Secular, and Integrity.',
  ]),
  buildTopicDetail('topic-basic-structure', 'Basic Structure Doctrine & Judicial Review', 'Hard', 'ch-preamble', 'Preamble & Basic Structure', 'upsc-polity', 'Indian Polity & Constitution', 2, [
    'Origin: Kesavananda Bharati case (1973).',
    'Parliament has wide amending power under Article 368, but cannot alter the basic framework.',
  ]),
  buildTopicDetail('topic-article-21', 'Article 21: Right to Life & Privacy Jurisprudence', 'Medium', 'ch-fundamental-rights', 'Fundamental Rights & Writs', 'upsc-polity', 'Indian Polity & Constitution', 2, [
    'Maneka Gandhi case (1978): Procedure established by law must be just, fair, and reasonable.',
    'K.S. Puttaswamy case (2017) declared Right to Privacy an intrinsic part of Article 21.',
  ]),
  buildTopicDetail('topic-1857-revolt', 'Revolt of 1857: Causes & Crown Proclamation', 'Medium', 'ch-freedom-struggle', 'Indian National Movement', 'upsc-history', 'Modern Indian History', 2, [
    'Immediate trigger: Enfield rifle greased cartridges.',
    'Government of India Act 1858 transferred East India Company power to British Crown.',
  ]),
  buildTopicDetail('topic-repo-inflation', 'Repo Rate, Reverse Repo & Inflation Targeting', 'Medium', 'ch-monetary-policy', 'RBI & Monetary Policy Framework', 'upsc-economy', 'Indian Economy & Macro Policy', 2, [
    'Repo rate: Interest rate at which RBI lends short-term liquidity to commercial banks.',
    'Flexible Inflation Target: 4% (+/- 2%) under the RBI Act.',
  ]),
  buildTopicDetail('topic-moment-inertia', 'Parallel & Perpendicular Axis Theorems', 'Hard', 'ch-jee-rotational', 'Rotational Motion & Dynamics', 'jee-physics', 'Physics (Mechanics & Electro)', 2, [
    'Parallel Axis Theorem: I = I_cm + M * d^2.',
    'Perpendicular Axis Theorem (for planar laminae): I_z = I_x + I_y.',
  ]),
  buildTopicDetail('topic-gauss-flux', 'Electric Flux & Gauss Law for Continuous Charge', 'Hard', 'ch-jee-electrostatics', 'Electrostatics & Gauss Law', 'jee-physics', 'Physics (Mechanics & Electro)', 2, [
    'Closed surface flux = Total Enclosed Charge / Epsilon_0.',
    'Symmetry enables analytical calculation for line charge, infinite sheet, and sphere.',
  ]),
  buildTopicDetail('topic-sn1-sn2', 'SN1 vs SN2 Mechanisms & Stereochemistry', 'Medium', 'ch-jee-organic', 'SN1 vs SN2 Reaction Mechanisms', 'jee-chemistry', 'Chemistry (Organic & Physical)', 2, [
    'SN2: Bimolecular, single-step backside attack with Walden inversion (favored by methyl/primary).',
    'SN1: Unimolecular, two-step via carbocation intermediate with racemization (favored by tertiary).',
  ]),
  buildTopicDetail('topic-thermo-gibbs', 'Gibbs Free Energy & Spontaneity (ΔG = ΔH - TΔS)', 'Hard', 'ch-jee-thermo', 'Thermodynamics & Spontaneity', 'jee-chemistry', 'Chemistry (Organic & Physical)', 2, [
    'ΔG = ΔH - TΔS determines spontaneity at constant temperature and pressure.',
    'ΔG < 0: Process is spontaneous (exergonic). ΔG = 0: Equilibrium state. ΔG > 0: Non-spontaneous.',
    'Exothermic reaction with entropy increase is spontaneous at all temperatures.',
  ]),
  buildTopicDetail('topic-leibniz-integral', 'Leibniz Rule for Differentiation under Integral', 'Hard', 'ch-jee-calculus', 'Definite Integration & Leibniz Rule', 'jee-mathematics', 'Mathematics (Calculus & Vectors)', 2, [
    'Differentiating an integral with variable limits.',
    'd/dx ∫[u(x) to v(x)] f(t) dt = f(v(x)) * v(x) - f(u(x)) * u(x).',
  ]),
  buildTopicDetail('topic-cardiac-cycle', 'Cardiac Cycle, ECG Waves & Double Circulation', 'Medium', 'ch-neet-circulatory', 'Human Circulatory System & ECG', 'neet-biology', 'Biology (Physiology & Genetics)', 2, [
    'P wave: Atrial depolarisation. QRS complex: Ventricular depolarisation. T wave: Ventricular repolarisation.',
    'Duration of complete cardiac cycle is 0.8 seconds (72 beats/min).',
  ]),
  buildTopicDetail('topic-mendelian-genetics', 'Mendels Laws & Dihybrid Cross Ratios (9:3:3:1)', 'Medium', 'ch-neet-genetics', 'Mendelian Genetics & Crosses', 'neet-biology', 'Biology (Physiology & Genetics)', 2, [
    'Law of Segregation: Alleles separate during gamete formation.',
    'Law of Independent Assortment: Genes for different traits sort independently.',
  ]),
  buildTopicDetail('topic-total-internal-reflection', 'Total Internal Reflection & Critical Angle', 'Easy', 'ch-neet-optics', 'Ray Optics & Total Internal Reflection', 'neet-physics', 'Physics for Medical (Optics)', 2, [
    'Light moves from denser to rarer medium with angle of incidence > critical angle.',
    'sin(theta_c) = n2 / n1. Foundational principle of optical fiber communication.',
  ]),
  buildTopicDetail('topic-euclid', 'Euclids Division Lemma & Fundamental Theorem', 'Easy', 'ch-real-numbers', 'Real Numbers & Division Lemma', 'math-10', 'Class 10 Mathematics', 2, [
    'For given positive integers a and b, there exist unique integers q and r such that a = bq + r (0 <= r < b).',
    'Every composite number can be uniquely expressed as a product of primes.',
  ]),
  buildTopicDetail('topic-trig-identities', 'Trigonometric Ratios & Pythagorean Identities', 'Medium', 'ch-trigonometry', 'Trigonometric Identities & Heights', 'math-10', 'Class 10 Mathematics', 2, [
    'sin^2(theta) + cos^2(theta) = 1.',
    '1 + tan^2(theta) = sec^2(theta).',
    '1 + cot^2(theta) = cosec^2(theta).',
  ]),
  buildTopicDetail('topic-redox-reactions', 'Oxidation, Reduction & Balancing Redox Equations', 'Medium', 'ch-chemical-reactions', 'Chemical Reactions & Redox', 'science-10', 'Class 10 Science', 2, [
    'Oxidation is gain of oxygen / loss of electrons (OIL RIG).',
    'Reduction is loss of oxygen / gain of electrons.',
    'Corrosion of iron and rancidity of fats are oxidation reactions in daily life.',
  ]),
  buildTopicDetail('topic-ohms-law', 'Ohms Law, Resistance in Series and Parallel', 'Easy', 'ch-electricity', 'Electricity & Ohms Law', 'science-10', 'Class 10 Science', 2, [
    'V = I * R at constant temperature.',
    'Series: R_total = R1 + R2 + R3. Current remains identical.',
    'Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3. Voltage remains identical.',
  ]),
];

// Sample video URLs from Google CDN
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

function findTopic(id: string): TopicDetailDto {
  const found = mockTopicDetails.find((t) => t.id === id);
  if (!found) {
    throw new Error(`Topic not found in mockTopicDetails: ${id}`);
  }
  return found;
}

// Helper to create ReelDto
function makeReel(
  id: string,
  title: string,
  videoIndexOrUrl: number | string,
  durationSec: number,
  topicOrId: TopicDetailDto | string,
  keyTakeaway: string,
  notes: string[],
  diagram: string,
  pitch: string,
  pitfalls: string[]
): ReelDto {
  const topicDetail = typeof topicOrId === 'string' ? findTopic(topicOrId) : topicOrId;
  const videoUrl =
    typeof videoIndexOrUrl === 'string'
      ? videoIndexOrUrl
      : SAMPLE_VIDEOS[videoIndexOrUrl % SAMPLE_VIDEOS.length];
  return {
    id,
    title,
    videoUrl,
    durationSec,
    topicId: topicDetail.id,
    topic: { id: topicDetail.id, title: topicDetail.title, difficulty: topicDetail.difficulty },
    chapter: { id: topicDetail.chapterId, title: topicDetail.chapter.title },
    subject: { id: topicDetail.subject.id, name: topicDetail.subject.name, classLevel: 0 },
    keyTakeaway,
    summaryNotes: notes,
    architectureDiagram: diagram,
    interviewPitch: pitch,
    pitfalls,
  };
}

// ==========================================
// 6. ENRICHED MOCK REELS FOR EVERY TOPIC
// ==========================================
export const mockReels: ReelDto[] = [
  // --- TECH: SYSTEM DESIGN (CAP THEOREM) ---
  makeReel(
    'reel-cap-1',
    'CAP Theorem in 45 Seconds: Why You Cannot Have All Three',
    0,
    45,
    mockTopicDetails[0],
    'You cannot avoid network partitions in distributed systems; you must pick CP or AP.',
    [
      'Partition (P) = Network cable cut, packet drops, or cross-rack timeout.',
      'CP choice: Fail or block writes/reads until network heals (Banking, Ledgers).',
      'AP choice: Serve stale data but guarantee zero errors (Social feeds, DNS, Metrics).',
    ],
    ` [ CLIENT WRITE: X=2 ]
          │
          ▼
   [ Node A (Leader) ] ──⚡ NETWORK SPLIT ⚡── [ Node B (Replica) ]
    (Updated: X=2)                                (Stale: X=1)
          │                                             │
    ┌─────┴──────────────┐                       ┌──────┴──────────────┐
    │   CP Architecture  │                       │   AP Architecture   │
    │ • Reject write/wait│                       │ • Return stale X=1  │
    │ • Guaranteed Sync  │                       │ • 100% Availability │
    └────────────────────┘                       └─────────────────────┘`,
    'In any distributed data store, network partitions are an inevitable physical reality. Thus, our fundamental architectural trade-off is choosing whether to guarantee consistency at the cost of availability (CP, like banking ledgers), or prioritize 100% uptime with eventual consistency (AP, like social feeds).',
    [
      "DON'T say you can choose 'CA' in a distributed network. Network partitions are physics and cannot be opted out of.",
      "DON'T confuse Consistency in CAP (linearizability / single-copy) with ACID Consistency (data integrity rules).",
    ]
  ),
  makeReel(
    'reel-cap-2',
    'CP vs AP Real World Examples (MongoDB, Cassandra, Spanner)',
    1,
    54,
    mockTopicDetails[0],
    'Cassandra favors AP (Eventual Consistency), while ZooKeeper/Raft favor CP.',
    [
      'Cassandra: Ring topology with tuneable consistency (QUORUM = R + W > N).',
      'Google Spanner: TrueTime API with GPS clocks to achieve external consistency.',
    ],
    `  [ QUORUM FORMULA: R + W > N ]
    • N = Total Replicas (e.g. 3)
    • W = 2 (Write acknowledged by 2 nodes)
    • R = 2 (Read checks 2 nodes)
    ──► Overlap guarantees reading the latest write!`,
    'CP systems like ZooKeeper or etcd use consensus algorithms (Raft/Paxos) to strictly prevent split-brain at the expense of write latency. In contrast, AP systems like Cassandra use masterless peer gossip with tunable quorum (R + W > N) for extreme high-throughput availability.',
    [
      "DON'T say 'MongoDB is always CP'. In MongoDB, write concern can make it behave as AP or CP.",
    ]
  ),
  makeReel(
    'reel-cap-3',
    'The PACELC Extension: What Happens When There is NO Partition?',
    2,
    50,
    mockTopicDetails[0],
    'PACELC: Even without partitions, you still trade off Latency vs Consistency!',
    [
      'If Partition: A or C.',
      'Else (normal): Latency (L) vs Consistency (C).',
      'Example: DynamoDB is PA/EL (Partition Available, Else Latency).',
    ],
    `                     ┌─── [ PARTITION (P) ] ───► Choose Availability (A) OR Consistency (C)
  PACELC LOGIC ──────┤
                     └─── [ ELSE (E) ] ────────► Choose Latency (L) OR Consistency (C)`,
    'CAP theorem is incomplete because network partitions are rare. PACELC expands CAP by stating that during normal partition-free operations (Else), you still face a fundamental trade-off between Latency (L) and Consistency (C).',
    [
      "DON'T assume distributed databases only make trade-offs during outages; 99.9% of normal operations are governed by Latency vs Consistency.",
    ]
  ),

  // --- TECH: CONSISTENT HASHING ---
  makeReel(
    'reel-hashing-1',
    'Why Modulo Hashing Fails in Distributed Caching',
    3,
    42,
    mockTopicDetails[1],
    'hash(key) % N causes almost 100% cache misses when N changes by 1.',
    [
      'When 1 server dies, N becomes N - 1, completely changing hash mappings.',
      'Consistent Hashing maps servers and keys onto a 2^32 circular ring.',
    ],
    `                     [ Node A (hash: 45) ]
                         ↗           ↘
  (Key: user:102) ──────►             ──────► [ Node B (hash: 180) ]
                        │   HASH RING  │             │
                        │   [0 - 2^32] │             ▼
                         ↖           ↙        (Key: order:88)
                     [ Node C (hash: 290) ]`,
    'Naive modulo hashing hash(key)%N causes a massive cache invalidation catastrophe whenever the server count changes. Consistent hashing maps both servers and keys onto a circular 2^32 integer ring, guaranteeing that adding or removing a node only migrates an average of K/N keys.',
    [
      "DON'T forget to mention Virtual Nodes. Without virtual nodes, key distribution across the ring is highly skewed.",
    ]
  ),
  makeReel(
    'reel-hashing-2',
    'Virtual Nodes: The Secret to Even Load Distribution',
    4,
    48,
    mockTopicDetails[1],
    'Assign each server multiple virtual points on the ring to avoid hot spots.',
    [
      'Server A -> A#1, A#2, A#100 across the circle.',
      'Standard deviation of assigned keys drops dramatically.',
    ],
    `  [ PHYSICAL SERVER 1 ] ──► [ A-1 (pos: 12) ], [ A-2 (pos: 140) ], [ A-3 (pos: 275) ]
  [ PHYSICAL SERVER 2 ] ──► [ B-1 (pos: 48) ], [ B-2 (pos: 195) ], [ B-3 (pos: 330) ]`,
    'To prevent non-uniform distribution on the ring, consistent hashing introduces Virtual Nodes. Each physical machine is mapped to 100 to 200 distinct hash positions on the ring, balancing memory load to within a 5% variance.',
    [
      "DON'T set virtual node count arbitrarily high (e.g., 10,000) as ring lookup overhead and metadata memory will balloon.",
    ]
  ),

  // --- TECH: RATE LIMITING ---
  makeReel(
    'reel-ratelimit-1',
    'Token Bucket vs Leaky Bucket Visualized',
    5,
    46,
    mockTopicDetails[2],
    'Token bucket allows short bursts; Leaky bucket smooths out traffic strictly.',
    [
      'Token Bucket: Refill at rate r. Request takes 1 token. If empty, drop/delay.',
      'Leaky Bucket: FIFO queue leaking at constant rate. If queue full, drop.',
    ],
    `  [ TOKEN BUCKET ]                           [ LEAKY BUCKET ]
  Tokens drop in at rate R                  Requests queue up in buffer
  ┌───────────────┐                          ┌───────────────┐
  │ ● ● ● ● ●     │ Capacity: B              │ ■ ■ ■ ■ ■     │ Buffer Size: B
  └───────┬───────┘                          └───────┬───────┘
          │ (Takes 1 token)                          │ (Leaks at constant rate)
          ▼                                          ▼
     Allow Burst!                               Smooth Stream`,
    'Token Bucket allows traffic bursts up to bucket capacity B while enforcing an average rate R, making it ideal for user-facing APIs. Leaky Bucket buffers incoming requests in a FIFO queue and dispatches them at a strict rate, ideal for downstream DB protection.',
    [
      "DON'T suggest Leaky Bucket for interactive web UIs where sudden bursts (like page reloads) shouldn't be penalized with fixed queue lag.",
    ]
  ),
  makeReel(
    'reel-ratelimit-2',
    'Implementing Sliding Window Rate Limiter with Redis',
    6,
    52,
    mockTopicDetails[2],
    'Use Redis Sorted Set (ZSET) with timestamps as score for millisecond precision.',
    [
      'ZREMRANGEBYSCORE to clear timestamps older than window.',
      'ZCARD to count remaining requests in window.',
      'ZADD to record current timestamp if under limit.',
    ],
    `  [ REDIS SORTED SET (ZSET) ]
  Key: "rate:user_42"
  Score = Timestamp (ms) | Member = Unique Request ID

  1. ZREMRANGEBYSCORE key 0 (now - 60s)  ──► Remove expired requests
  2. ZCARD key                           ──► Check count < Limit
  3. ZADD key now request_id             ──► Add if allowed (in Lua script)`,
    'To implement an exact sliding window rate limiter without boundary spikes, we store each request timestamp in a Redis Sorted Set (ZSET). Using a Redis Lua script, we atomically purge timestamps older than the window, count current elements with ZCARD, and conditionally record the new timestamp.',
    [
      "DON'T run ZREMRANGEBYSCORE, ZCARD, and ZADD as separate network round-trips. Always wrap them in a Redis Lua script to guarantee atomicity.",
    ]
  ),

  // --- TECH: CDN & CACHING ---
  makeReel(
    'reel-cdn-1',
    'Write-Through vs Write-Behind Caching Explained',
    7,
    44,
    mockTopicDetails[3],
    'Write-Through prioritizes data consistency; Write-Behind prioritizes write performance.',
    [
      'Write-Through: App -> Cache -> DB (synchronous write to both).',
      'Write-Behind: App -> Cache (returns immediately), async batch flush to DB.',
    ],
    `  [ WRITE-THROUGH ]                        [ WRITE-BEHIND ]
  App ──► Cache ──► Database                App ──► Cache (Ack immediately!)
  (High write latency, 100% sync)                    │
                                                     ▼ (Async batch job)
                                                  Database`,
    'In Write-Through caching, the cache coordinates a synchronous write to both the cache and persistent storage, ensuring zero data loss at the cost of higher write latency. In Write-Behind caching, the write returns immediately after hitting the in-memory cache, providing extreme write throughput but risking data loss if the cache node crashes before flushing.',
    [
      "DON'T use Write-Behind for mission-critical financial transactions where uncommitted in-memory writes could be lost on node crash.",
    ]
  ),
  makeReel(
    'reel-cdn-2',
    'Thundering Herd & Cache Stampede Solutions',
    0,
    49,
    mockTopicDetails[3],
    'Use mutex locks (singleflight) or probabilistic early expiration (XFetch).',
    [
      'Cache Stampede: Hot key expires, 10,000 concurrent requests hammer the DB at once.',
      'Solution 1: Distributed mutex lock so only 1 request queries DB while others wait.',
      'Solution 2: Background pre-warming before TTL expires.',
    ],
    `  HOT KEY EXPIRES (t=0)
       │
       ├──► Request 1 ──► [ Acquire Mutex Lock ] ──► Query DB & Update Cache
       ├──► Request 2 ──► [ Wait on Mutex / Return stale ]
       └──► Request 3 ──► [ Wait on Mutex / Return stale ]`,
    'A cache stampede occurs when a high-traffic key expires, causing thousands of parallel threads to miss the cache simultaneously and overwhelm the database. We prevent this using Singleflight mutex locking so only a single worker refreshes the cache while other requests await the result.',
    [
      "DON'T set identical TTLs for all keys; always add random jitter (e.g. 300s +/- 30s) to prevent bulk simultaneous expirations.",
    ]
  ),

  // --- TECH: KAFKA ---
  makeReel(
    'reel-kafka-1',
    'Kafka Partitions: How Scale and Ordering Coexist',
    1,
    51,
    mockTopicDetails[4],
    'Ordering is only guaranteed WITHIN a partition, never across partitions.',
    [
      'Partition key hash determines which partition a message goes to.',
      'Each partition is consumed by exactly one consumer in a consumer group.',
    ],
    `  [ PRODUCER ] (key: "user_42") ──► hash(key) % 3 ──► Partition 1
  ┌────────────────────────────────────────────────────────┐
  │ Partition 0: [msg 0][msg 1][msg 2] ──► Consumer A       │
  │ Partition 1: [msg 0][msg 1]        ──► Consumer B       │
  │ Partition 2: [msg 0][msg 1][msg 2] ──► Consumer C       │
  └────────────────────────────────────────────────────────┘`,
    'Kafka achieves massive linear horizontal scaling by partitioning topics. While messages are strictly sequential within any single partition, there is no global ordering across different partitions. To preserve order for a specific entity (like an order or user), you must use that entity ID as the message partition key.',
    [
      "DON'T promise global message ordering across an entire Kafka topic; emphasize that ordering guarantees strictly apply per-partition.",
    ]
  ),

  // --- TECH: DSA TWO POINTERS ---
  makeReel(
    'reel-dsa-1',
    'Two Pointers Visualized: Reducing O(N^2) to O(N)',
    2,
    47,
    mockTopicDetails[5],
    'Sorted arrays allow monotonic pointer movement without nested loops.',
    [
      'Left pointer starts at 0, Right pointer starts at N - 1.',
      'If sum < target: move left pointer forward to increase sum.',
      'If sum > target: move right pointer backward to decrease sum.',
    ],
    `  Array: [ 1,  3,  4,  7,  11,  15 ]    Target = 15
           ▲                       ▲
           L                       R   --> 1 + 15 = 16 > 15 (move R left)
           ▲                   ▲
           L                   R       --> 1 + 11 = 12 < 15 (move L right)
               ▲               ▲
               L               R       --> 4 + 11 = 15 FOUND!`,
    'The Two Pointers technique leverages the monotonicity of sorted sequences. Because moving the left pointer strictly increases the sum and moving the right pointer strictly decreases it, we can eliminate nested loops and search the entire space in a single O(N) pass with O(1) auxiliary memory.',
    [
      "DON'T attempt two-pointer directional movement on unsorted arrays; sorting requires O(N log N) first.",
    ]
  ),

  // --- TECH: FRONTEND REACT FIBER ---
  makeReel(
    'reel-fiber-1',
    'How React Fiber Enables Concurrency in 60 Seconds',
    3,
    58,
    mockTopicDetails[10],
    'Fiber turns the call stack into a singly linked list that can pause and resume.',
    [
      'Old React: Synchronous recursion over the Virtual DOM that blocked the main thread.',
      'Fiber: Linked list with child, sibling, and return pointers.',
      'WorkLoop breaks computation into 5ms slices via requestIdleCallback/scheduler.',
    ],
    `  [ FIBER NODE STRUCTURE ]
      child ──► First child component
      sibling ─► Next sibling component
      return ──► Parent component

  WorkLoop: while (workInProgress !== null && !shouldYield()) { ... }`,
    'Before React 16, reconciliation was an uninterrupted synchronous stack walk that caused jank during heavy renders. Fiber transformed the component tree into a cooperative linked list, enabling React to slice work into prioritized units, yield execution back to the browser for user interactions, and resume render work later.',
    [
      "DON'T confuse the render phase (asynchronous, interruptible) with the commit phase (synchronous DOM mutations).",
    ]
  ),

  // --- PM: CIRCLES FRAMEWORK ---
  makeReel(
    'reel-pm-circles-1',
    'How to Crack Any Product Design Interview with CIRCLES',
    4,
    55,
    mockTopicDetails[14],
    'Never jump to solutions; spend 60% of time on Comprehend & User Needs.',
    [
      'C: Comprehend situation (Goals, Constraints, Metrics).',
      'I: Identify user personas (Extreme users, mainstream).',
      'R: Report user pain points.',
      'C: Cut and prioritize 1 major problem.',
      'L: List 3 creative solutions (Moonshot, Practical, Low-tech).',
      'E: Evaluate trade-offs (Impact vs Effort matrix).',
      'S: Summarize with recommendation & North Star metric.',
    ],
    `  [ CIRCLES WORKFLOW ]
  1. Comprehend ──► 2. Persona ──► 3. Pain Points
                                        │
  6. Summarize  ◄── 5. Evaluate ◄── 4. Prioritize & Solve`,
    'In product design interviews, the CIRCLES framework enforces structured discovery before solutioning. I always spend the first half narrowing down the business objective, defining extreme user personas, and evaluating root pain points before brainstorming 10x solutions.',
    [
      "DON'T design for the generic average user; always pick a clear, well-defined target persona with high-friction unmet needs.",
    ]
  ),

  // --- FINANCE: PROFITABILITY ---
  makeReel(
    'reel-fin-profit-1',
    'The Profitability Framework: Revenue vs Cost Breakdown',
    5,
    49,
    mockTopicDetails[18],
    'Profit drops stem from either Price/Volume decline or Fixed/Variable cost inflation.',
    [
      'Step 1: Clarify if industry-wide or company-specific.',
      'Step 2: Split into Revenue = Price * Volume, and Cost = Fixed + Variable.',
      'Step 3: Benchmark unit economics against nearest competitors.',
    ],
    `                    [ PROFIT ]
                   ↗          ↘
          [ REVENUE ]        [ COST ]
          ↗         ↘        ↗      ↘
      [ PRICE ]  [ VOLUME ] [ FIXED ] [ VARIABLE ]`,
    'When tackling profitability decline in case interviews, I first benchmark the issue against macro industry trends. If company-specific, I bifurcate into Revenue (Price x Volume by segment) and Cost (Fixed overhead vs Variable production), identifying which specific unit metric is deviating from historical baselines.',
    [
      "DON'T immediately propose cutting marketing or staff without diagnosing whether the issue is top-line erosion or cost structure bloat.",
    ]
  ),

  // --- UPSC: PREAMBLE ---
  makeReel(
    'reel-upsc-preamble-1',
    'Preamble to the Indian Constitution: Key Terms & Significance',
    6,
    52,
    mockTopicDetails[20],
    'The Preamble is an integral part of the Constitution and can be amended under Art 368.',
    [
      'Drafted based on the Objectives Resolution introduced by Jawaharlal Nehru.',
      '42nd Amendment (1976) inserted: Socialist, Secular, and Integrity.',
      'Kesavananda Bharati (1973): Preamble is part of Constitution, but non-justiciable.',
    ],
    `  [ PREAMBLE FOUNDATION ]
  • Sovereign  ──► Supreme authority, free from external control
  • Socialist  ──► Democratic socialism aiming to end poverty & inequality
  • Secular    ──► All religions have equal status and support from the State
  • Democratic ──► Government derives authority from will of the people
  • Republic   ──► Head of state is elected, not hereditary`,
    'The Preamble embodies the foundational philosophy and objective spectrum of the Indian Constitution. As established in the Kesavananda Bharati judgment, while the Preamble is non-justiciable in courts of law, it is an integral constitutional limb that can be amended under Article 368 without violating the Basic Structure.',
    [
      "DON'T state that the Preamble is directly enforceable in courts of law; it is non-justiciable and cannot be used as an independent cause of action.",
    ]
  ),

  // --- IIT-JEE: ROTATIONAL MOTION ---
  makeReel(
    'reel-jee-rotational-1',
    'Parallel Axis Theorem (I = I_cm + Md²): The Center-of-Mass Reference Trap',
    '/physics_reels/reel-jee-rotational-1.mp4',
    45,
    'topic-moment-inertia',
    'Parallel Axis shift d must ALWAYS be measured from the Center of Mass (COM) axis, never between two non-COM axes!',
    [
      'Parallel Axis Theorem: I = I_cm + M * d² (valid for ANY 2D or 3D rigid body).',
      'Example (Solid Sphere): I_cm = 2/5 MR² ──► I_tangent = 2/5 MR² + MR² = 7/5 MR².',
      'To shift between two non-COM axes A and B: first shift A ──► COM, then COM ──► B.',
    ],
    `  [ SOLID SPHERE INERTIA SHIFT ]
       COM Axis (I_cm = 2/5 MR²)
          │
          ├──── d = R ────► Tangent Axis
          │
   I_tangent = I_cm + M·R² = 2/5 MR² + MR² = 7/5 MR²`,
    'In JEE rotational mechanics, the Parallel Axis Theorem (I = I_cm + Md²) works for any 3D rigid body, provided d is measured strictly from the Center of Mass axis. If a question gives moment of inertia about one non-COM axis and asks for another, always route back to I_cm first before shifting to the target axis.',
    [
      "DON'T shift directly between two arbitrary parallel axes using I₂ = I₁ + Md²; the base term MUST be I_cm.",
    ]
  ),
  makeReel(
    'reel-jee-rotational-2',
    'Perpendicular Axis Theorem (Iz = Ix + Iy): Why It Fails on 3D Bodies',
    '/physics_reels/reel-jee-rotational-2.mp4',
    45,
    'topic-moment-inertia',
    'Perpendicular Axis Theorem (Iz = Ix + Iy) applies ONLY to flat 2D planar laminas (z = 0), never 3D spheres or cylinders!',
    [
      'Perpendicular Axis Theorem: I_z = I_x + I_y where X and Y lie in the flat plane of the lamina and Z is perpendicular.',
      'For a thin uniform disc: I_z = 1/2 MR², so by symmetry I_x = I_y = 1/4 MR².',
      'Fails on 3D bodies because mass elements have non-zero z-coordinates (r² ≠ x² + y²).',
    ],
    `  [ 2D PLANAR LAMINA (z = 0) ]          [ 3D SPHERE (z ≠ 0) ]
        Z (Perpendicular)                    ❌ Iz = Ix + Iy FAILS!
        │                                    Use 3D Symmetry instead:
        └───► Y                              Ix = Iy = Iz = 2/5 MR²
       ╱
      X   ──► Iz = Ix + Iy (VALID)`,
    'The Perpendicular Axis Theorem (Iz = Ix + Iy) is exclusively valid for flat two-dimensional planar laminas like rings, discs, and thin plates where z equals zero everywhere. Never apply it to a 3D sphere, cone, or cylinder—that is the single most common negative-marking trap in JEE rotational dynamics.',
    [
      "DON'T apply Perpendicular Axis Theorem to a solid sphere or cylinder; for 3D bodies, z ≠ 0 so Iz ≠ Ix + Iy.",
    ]
  ),

  // --- NEET: CARDIAC CYCLE ---
  makeReel(
    'reel-neet-cardiac-1',
    'The 0.8 Second Cardiac Cycle & ECG Waves Decoded',
    0,
    51,
    mockTopicDetails[29],
    'P wave = Atrial depolarisation; QRS = Ventricular depolarisation; T wave = Repolarisation.',
    [
      'Joint Diastole: 0.4 seconds (all 4 chambers relaxed, AV valves open).',
      'Atrial Systole: 0.1 seconds (atria contract, pump remaining 30% blood).',
      'Ventricular Systole: 0.3 seconds (ventricles contract, semilunar valves open).',
    ],
    `  [ ECG WAVE INTERPRETATION ]
  P wave     ──► Atrial Depolarisation (contraction)
  QRS Complex──► Ventricular Depolarisation (strong contraction)
  T wave     ──► Ventricular Repolarisation (recovery/relaxation)`,
    'The human cardiac cycle completes in 0.8 seconds at a standard heart rate of 72 bpm. On the electrocardiogram, the P-wave reflects atrial depolarisation, the large QRS complex represents ventricular depolarisation, and the T-wave indicates ventricular repolarisation.',
    [
      "DON'T confuse the duration of ventricular systole (0.3s) with joint diastole (0.4s).",
    ]
  ),

  // --- SCHOOL CLASS 10: REAL NUMBERS ---
  makeReel(
    'reel-school-euclid-1',
    'Euclids Division Lemma & Finding HCF Made Simple',
    1,
    43,
    mockTopicDetails[32],
    'Given positive integers a and b: a = bq + r, where 0 <= r < b.',
    [
      'Dividend = (Divisor * Quotient) + Remainder.',
      'To find HCF of two numbers, apply lemma successively until remainder r = 0.',
      'The divisor at the final zero-remainder stage is the HCF.',
    ],
    `  Example: HCF of 455 and 42
  455 = 42 * 10 + 35
   42 = 35 * 1  + 7
   35 =  7 * 5  + 0   ──► Remainder is 0! HCF = 7`,
    'Euclids Division Algorithm states that any positive integer a can be divided by b with a unique quotient q and remainder r strictly less than b. We repeatedly apply this reduction step until the remainder reaches zero; the divisor at this final stage is the Highest Common Factor.',
    [
      "DON'T forget the condition that remainder r must be non-negative and strictly smaller than divisor b: 0 <= r < b.",
    ]
  ),
  makeReel(
    'reel-school-ohm-1',
    "Ohm's Law (V = IR) & Resistivity (R = ρL/A): The Wire-Stretching Trap",
    '/physics_reels/reel-school-ohm-1.mp4',
    45,
    'topic-ohms-law',
    'Stretching a wire to 2x length increases its resistance by 4x (R ∝ L² at constant volume), while resistivity ρ stays unchanged!',
    [
      'Ohm Law: V = I * R at constant temperature.',
      'Resistance R = ρ * (L / A); when stretched n times, L becomes nL and A becomes A/n, so R_new = n²R.',
      'Resistivity (ρ) is an intrinsic material property—it depends only on material and temperature, NEVER on length or area.',
    ],
    `  [ WIRE STRETCHED TO 2x LENGTH (Constant Volume V = A·L) ]
  • Length:  L ──► 2L
  • Area:    A ──► A / 2
  • R_new = ρ (2L) / (A/2) = 4 · (ρL/A) = 4R!`,
    'Under Ohm Law (V = IR), resistance equals ρL/A. In board exams, watch out for the wire-stretching trap: when a wire is stretched to double its length, its volume remains constant so its cross-sectional area halves, quadrupling the resistance to 4R while resistivity ρ remains completely unchanged.',
    [
      "DON'T say resistivity ρ increases when a wire is stretched; ρ only changes if the material or temperature changes.",
    ]
  ),
  makeReel(
    'reel-school-ohm-2',
    'Series vs Parallel Circuits: Why Home Appliances Are Wired in Parallel',
    '/physics_reels/reel-school-ohm-2.mp4',
    45,
    'topic-ohms-law',
    'Home circuits are wired in Parallel so every appliance gets full 220V and works independently if another appliance turns off.',
    [
      'Series: R_eq = R₁ + R₂ + R₃ (Current I is constant, Voltage V divides).',
      'Parallel: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ (Voltage V is constant, Current I divides).',
      'In parallel, equivalent resistance is always smaller than the smallest individual resistor.',
    ],
    `  [ SERIES CIRCUIT ]                  [ PARALLEL HOME CIRCUIT ]
  • Same Current (I)                  • Same Voltage (220V across each)
  • R_eq = R₁ + R₂                    • 1/R_eq = 1/R₁ + 1/R₂
  • 1 Fused Bulb = All OFF ❌         • Independent Switches = All Work ✅`,
    'In series circuits, current remains identical across resistors and resistances add directly (R_eq = R1 + R2), meaning one broken component breaks the entire loop. Domestic wiring always uses parallel connections so every appliance receives a constant 220V supply and operates on its own independent switch.',
    [
      "DON'T forget to take the reciprocal at the end when calculating parallel resistance from 1/R_eq = 1/R₁ + 1/R₂.",
    ]
  ),

  // --- TECH: DSA SLIDING WINDOW ---
  makeReel(
    'reel-sliding-window-1',
    'Sliding Window Maximum using Monotonic Deque',
    3,
    50,
    'topic-sliding-window-max',
    'A monotonic decreasing deque allows finding the max in every window of size k in O(N) total time.',
    [
      'Monotonic Deque keeps elements in strictly decreasing order of value.',
      'Remove indices from back that are smaller than the incoming element.',
      'Remove index from front if it falls outside window [i - k + 1].',
    ],
    `  [ MONOTONIC DEQUE (Descending) ]
  Incoming X pushes out smaller elements from back!
  Front always holds max element for current window [L...R].
  Window: [ 1, 3, -1, -3, 5, 3, 6, 7 ]  k=3
  Deque front: 3 ──► 3 ──► 5 ──► 5 ──► 6 ──► 7`,
    'Instead of re-scanning each window in O(k) or using a max-heap in O(N log k), a monotonic deque amortizes push and pop operations to O(1) per element, providing an optimal O(N) linear time solution with O(k) auxiliary space.',
    [
      "DON'T forget to pop elements from the front of the deque once their index falls outside the window bounds (index <= R - k).",
    ]
  ),

  // --- TECH: DSA BINARY TREE DIAMETER ---
  makeReel(
    'reel-tree-diameter-1',
    'Binary Tree Diameter: Why Postorder DFS Beats O(N^2)',
    4,
    46,
    'topic-tree-diameter',
    'Compute depths bottom-up; at each node, candidate diameter is left_depth + right_depth.',
    [
      'A naive approach computes heights repeatedly, taking O(N^2) time on skewed trees.',
      'Bottom-up postorder DFS computes height and updates diameter in a single pass O(N).',
      'The longest path may or may not pass through the root node!',
    ],
    `         (A)  ──► left_depth = 2, right_depth = 3
        /   \\      Max path = 2 + 3 = 5 edges!
      (B)   (C)
     /        \\
   (D)        (E)
                \\
                (F)`,
    'To calculate the diameter of a binary tree in optimal O(N) time, we perform a single postorder traversal. Each recursive frame computes and returns its max subtree depth, while globally updating the maximum path length encountered by summing the left and right child depths.',
    [
      "DON'T assume the longest path always passes through the root; in unbalanced trees, the diameter might be entirely confined within a single subtree.",
    ]
  ),

  // --- TECH: DSA GRAPH CYCLES ---
  makeReel(
    'reel-graph-cycle-1',
    'Cycle Detection in Directed Graphs with Kahns Algorithm',
    5,
    52,
    'topic-graph-cycle',
    'If Kahn BFS queue finishes and total processed vertices < V, a directed cycle exists.',
    [
      'Compute in-degree for all vertices in the directed graph.',
      'Enqueue all vertices with in-degree 0.',
      'Dequeue node, decrement adjacent in-degrees, push new 0 in-degree nodes.',
    ],
    `  [ KAHN'S ALGORITHM (BFS) ]
  1. In-degrees: [A:0, B:1, C:2]
  2. Push 0-in-degree (A) to queue
  3. Pop A, decrement B: [B:0] ──► Push B
  4. If processed count < Total Vertices ──► CYCLE DETECTED!`,
    'We can detect cycles in directed graphs using Kahns topological sort algorithm by tracking in-degrees. We seed a queue with zero in-degree vertices; if the total count of vertices dequeued is less than the graph vertex count V, circular dependencies prevented in-degrees from reaching zero.',
    [
      "DON'T use standard undirected DFS (visited boolean array) on directed graphs without tracking nodes currently on the recursion stack.",
    ]
  ),

  // --- TECH: DSA DP KNAPSACK ---
  makeReel(
    'reel-dp-knapsack-1',
    '0/1 Knapsack Pattern: 2D Matrix to 1D Array Space Optimization',
    6,
    54,
    'topic-dp-knapsack',
    'When compressing from 2D DP to 1D, iterate the capacity loop backwards to avoid reusing items.',
    [
      'Choice at each item: skip item OR take item (if capacity allows).',
      'dp[w] = max(dp[w], value + dp[w - weight]).',
      'Iterating backwards guarantees dp[w - weight] reflects the PREVIOUS state.',
    ],
    `  [ 1D DP SPACE OPTIMIZATION ]
  Capacity:  W ◄────────── 0 (Iterate BACKWARDS!)
  dp[w] = max(dp[w], val + dp[w - wt])
  Iterating backwards guarantees dp[w - wt] comes from the PREVIOUS item!`,
    'In the 0/1 Knapsack problem, because state transitions only depend on the previous item row, we can compress memory from O(N*W) to 1D O(W). The critical detail is traversing the inner weight loop backwards from W down to wt[i], preventing an item from being counted multiple times.',
    [
      "DON'T iterate capacity from 0 to W in 0/1 knapsack; iterating forward solves Unbounded Knapsack instead.",
    ]
  ),

  // --- TECH: FRONTEND WEB VITALS ---
  makeReel(
    'reel-web-vitals-1',
    'Mastering Core Web Vitals: LCP, INP, and CLS',
    7,
    49,
    'topic-core-web-vitals',
    'LCP measures loading speed (<2.5s), INP measures responsiveness (<200ms), CLS measures visual stability (<0.1).',
    [
      'LCP: Largest Contentful Paint. Preload hero images, eliminate render-blocking CSS.',
      'INP: Interaction to Next Paint. Split long tasks (>50ms) using startTransition.',
      'CLS: Cumulative Layout Shift. Always specify explicit width/height on images and dynamic ads.',
    ],
    `  ┌──────────────────────────────────────────────────────────┐
  │  LCP < 2.5s   │ Preload hero image, inline critical CSS  │
  ├───────────────┼──────────────────────────────────────────┤
  │  INP < 200ms  │ Break long tasks, use startTransition    │
  ├───────────────┼──────────────────────────────────────────┤
  │  CLS < 0.1    │ Set width/height on images & ad banners  │
  └──────────────────────────────────────────────────────────┘`,
    'Google Core Web Vitals evaluate real-world user experience across three dimensions: LCP for loading speed, INP for input delay and interactivity, and CLS for visual stability. We optimize LCP by preloading above-the-fold assets, INP by deferring non-urgent work with React Transitions, and CLS by allocating explicit aspect-ratio containers.',
    [
      "DON'T measure performance only on local high-end M-series machines; always profile with 4x CPU throttling and simulated Slow 4G.",
    ]
  ),

  // --- TECH: BACKEND B-TREES ---
  makeReel(
    'reel-btree-indexes-1',
    'B+ Tree Indexes vs Hash Indexes in PostgreSQL & MySQL',
    0,
    51,
    'topic-btree-indexes',
    'B+ Trees store records in sorted leaf pages linked sequentially, supporting both equality and range scans.',
    [
      'B+ Tree height stays shallow (typically 3-4 levels for millions of rows).',
      'Leaf nodes are doubly linked, enabling fast range scans (BETWEEN, <, >).',
      'Covering indexes (INCLUDE) allow index-only scans without table heap lookups.',
    ],
    `               [ Root Node ]
              /             \\
        [ Internal ]      [ Internal ]
        /          \\      /          \\
    [ Leaf 1 ] ◄──► [ Leaf 2 ] ◄──► [ Leaf 3 ]
    (Sorted data pointers with doubly linked list)`,
    'While Hash indexes offer theoretical O(1) lookups, B+ trees are the universal standard in relational databases because their height is strictly balanced (O(log N)) and their leaf nodes form a doubly linked list that supports lightning-fast range queries and ORDER BY sorting without temporary tables.',
    [
      "DON'T place a low-cardinality column (like boolean or gender) as the leading column of a composite B+ tree index.",
    ]
  ),

  // --- TECH: BACKEND ACID & CONCURRENCY ---
  makeReel(
    'reel-acid-isolation-1',
    'Dirty Read, Non-Repeatable Read & Phantom Read: Isolation Levels',
    1,
    56,
    'topic-acid-isolation',
    'Read Committed prevents Dirty Reads; Repeatable Read prevents Non-Repeatable Reads; Serializable eliminates Phantoms.',
    [
      'Dirty Read: Reading uncommitted data from an ongoing transaction that may rollback.',
      'Non-Repeatable Read: Re-reading the same row within a transaction produces different column values.',
      'Phantom Read: Re-running a range query returns newly inserted rows from another committed transaction.',
    ],
    `  ISOLATION LEVEL     DIRTY READ    NON-REPEATABLE READ    PHANTOM READ
  Read Uncommitted        ❌ ALLOWED        ❌ ALLOWED             ❌ ALLOWED
  Read Committed          ✅ PREVENTED      ❌ ALLOWED             ❌ ALLOWED
  Repeatable Read         ✅ PREVENTED      ✅ PREVENTED           ❌ ALLOWED
  Serializable            ✅ PREVENTED      ✅ PREVENTED           ✅ PREVENTED`,
    'SQL standard defines four isolation levels to balance concurrency against consistency anomalies. Under Read Committed, queries only read committed rows. Repeatable Read ensures all reads within a transaction see the exact same snapshot, implemented via Multi-Version Concurrency Control (MVCC) xmin/xmax transaction horizons.',
    [
      "DON'T assume Serializable isolation is free; strict serializability requires two-phase locking or SSI predicate locks that increase deadlocks and abort rates.",
    ]
  ),

  // --- PM: METRIC DROP RCA ---
  makeReel(
    'reel-pm-metric-drop-1',
    'How to Investigate a 15% Sudden Drop in Daily Active Users',
    2,
    53,
    'topic-metric-drop',
    'Verify data telemetry first, then isolate internal factors before investigating external market dynamics.',
    [
      'Clarify metric definition, timeframe, and whether the drop was sudden or gradual.',
      'Segment by platform (iOS/Android), geography, app version, and user cohorts.',
      'Check internal releases, payment gateway downtime, and tracking SDK deployment.',
    ],
    `  [ 15% DAU DROP REPORTED ]
        │
        ├── 1. Data Integrity Check (Did tracking pipeline fail?)
        ├── 2. Segmentation (iOS vs Android, Country, New vs Existing)
        ├── 3. Internal Factors (Bad deployment, forced logout, payment outage)
        └── 4. External Factors (Holiday, competitor launch, internet outage)`,
    'When investigating a sharp metric drop in PM interviews, my framework starts with telemetry verification to rule out logging pipeline bugs. I then segment the metric along dimensions such as platform, geography, and cohort to isolate the blast radius, systematically correlating the dip with internal releases and external catalysts.',
    [
      "DON'T brainstorm feature solutions before diagnosing root cause; an interviewer wants to see disciplined investigative segmentation.",
    ]
  ),

  // --- PM: A/B TESTING ---
  makeReel(
    'reel-pm-ab-testing-1',
    'Statistical Significance in A/B Testing: P-Value, Power & Sample Size',
    3,
    48,
    'topic-ab-significance',
    'Never conclude an A/B test early; peeking at unfinalized data exponentially inflates false positive rate.',
    [
      'Null Hypothesis (H0): No real difference between Variant A and Variant B.',
      'P-Value < 0.05: Less than 5% probability the observed uplift is random noise.',
      'Statistical Power (1 - beta = 80%): Probability of detecting an effect if it truly exists.',
    ],
    `  Control (A):   Conversion = 5.2%  (N = 50,000)
  Variant (B):   Conversion = 5.7%  (N = 50,000)
  P-Value = 0.012 (< 0.05) ──► Statistically Significant!
  Minimum Detectable Effect (MDE) achieved with 80% statistical power.`,
    'To run rigorous A/B tests, we precalculate required sample size based on Minimum Detectable Effect, baseline conversion, and 80% statistical power at alpha 0.05. We strictly avoid the peeking problem by maintaining the predefined sample horizon, ensuring that observed uplifts reflect genuine user preference rather than random noise.',
    [
      "DON'T stop the test the minute p < 0.05 on day 2; statistical variance requires full weekly cycles to account for day-of-week seasonality.",
    ]
  ),

  // --- PM: BEHAVIORAL PUSHBACK ---
  makeReel(
    'reel-pm-pushback-1',
    'Handling Engineering Pushback on Aggressive Deadlines',
    4,
    50,
    'topic-pushback-eng',
    'Treat engineering as strategic partners: cut scope, not quality or team trust.',
    [
      'Acknowledge technical debt and listen to architectural concerns first.',
      'Decouple feature into Must-Have MVP vs Phase 2 Fast-Follow items.',
      'Align engineering incentives with user impact telemetry.',
    ],
    `  [ TENSION: Launch in 3 Weeks vs 6 Weeks Estimate ]
        │
        ├── 1. Understand Architecture & Tech Debt Concerns
        ├── 2. Decouple Scope: Must-Have MVP vs Phase 2 Fast-Follow
        └── 3. Align on Shared Goal: Validate customer value without burning team`,
    'When engineering pushes back on scope or timeline, I never respond with executive pressure. Instead, I seek to deeply understand the architectural constraints and technical debt risks. I then collaborate with the tech lead to slice the release into a lean MVP that delivers core user value while deferring non-essential edge cases to a fast-follow iteration.',
    [
      "DON'T promise engineering that tech debt will be addressed later if product leadership never actually allocates sprint capacity for refactoring.",
    ]
  ),

  // --- FINANCE: DCF VALUATION ---
  makeReel(
    'reel-fin-dcf-1',
    'Discounted Cash Flow (DCF) Valuation: Step-by-Step Walkthrough',
    5,
    55,
    'topic-dcf-wacc',
    'Enterprise Value = Sum of PV(Unlevered Free Cash Flows) + PV(Terminal Value).',
    [
      'FCFF = EBIT * (1 - Tax) + D&A - CapEx - Change in Net Working Capital.',
      'WACC = (Equity/Value * Cost of Equity) + (Debt/Value * Cost of Debt * (1 - Tax)).',
      'Terminal Value calculated via Gordon Growth Model: FCFF * (1 + g) / (WACC - g).',
    ],
    `  FCFF = EBIT*(1 - T) + D&A - CapEx - ΔNWC
         │
         ▼
  Discount by WACC: [ E/V * Re + D/V * Rd * (1-T) ]
         │
         ▼
  Terminal Value via Gordon Growth: [ FCFF_(t+1) / (WACC - g) ]`,
    'In a Discounted Cash Flow valuation, we project Unlevered Free Cash Flow (FCFF) over a 5 to 10 year horizon, discounting each cash flow back to present value using the Weighted Average Cost of Capital (WACC). Terminal value is typically computed via the Gordon Growth model or exit multiple, reflecting the steady-state value of the enterprise.',
    [
      "DON'T use Levered Free Cash Flow (FCFE) when discounting by WACC; FCFE must be discounted by Cost of Equity (Ke), while FCFF uses WACC.",
    ]
  ),

  // --- UPSC: BASIC STRUCTURE ---
  makeReel(
    'reel-upsc-basic-structure-1',
    'The Basic Structure Doctrine & Kesavananda Bharati (1973)',
    6,
    53,
    'topic-basic-structure',
    'Parliament cannot use Article 368 to destroy the essential identity and core principles of the Indian Constitution.',
    [
      '13-Judge Bench in Kesavananda Bharati case established the doctrine by 7-6 majority.',
      'Basic features include: Supremacy of Constitution, Rule of Law, Judicial Review, Secularism.',
      'Minerva Mills (1980) struck down Article 368(4) and (5) affirming limited amending power is itself basic structure.',
    ],
    `  [ ARTICLE 368: Amending Power of Parliament ]
        │
        ▼ (Subject to Judicial Review)
  ┌────────────────────────────────────────────────────────┐
  │  BASIC STRUCTURE (Untouchable Core)                   │
  │  • Supremacy of Constitution • Rule of Law             │
  │  • Separation of Powers      • Judicial Review         │
  │  • Federal Character         • Secularism & Democracy  │
  └────────────────────────────────────────────────────────┘`,
    'Established in the historic 13-judge bench ruling of Kesavananda Bharati v. State of Kerala (1973), the Basic Structure Doctrine demarcates the constitutional boundary of Parliamentary sovereignty. While Parliament has broad constituent powers under Article 368 to amend the text, it cannot dismantle the foundational pillars that give the Constitution its core identity.',
    [
      "DON'T say the Basic Structure is an exhaustive list written in the Constitution; it is an evolving judicial doctrine developed case-by-case.",
    ]
  ),

  // --- UPSC: ARTICLE 21 ---
  makeReel(
    'reel-upsc-article21-1',
    'Article 21 Evolution: From AK Gopalan to Maneka Gandhi & Puttaswamy',
    7,
    52,
    'topic-article-21',
    'Procedure established by law was transformed into substantive Due Process of Law by judicial interpretation.',
    [
      'AK Gopalan (1950): Literal interpretation; only executive actions subject to judicial review.',
      'Maneka Gandhi (1978): Golden Triangle (Art 14, 19, 21); law depriving liberty must be fair, just, and reasonable.',
      'KS Puttaswamy (2017): 9-judge bench recognized Right to Privacy as an intrinsic fundamental right under Art 21.',
    ],
    `  1950: A.K. Gopalan ──► Narrow literal interpretation (mere executive legality)
          │
  1978: Maneka Gandhi──► Golden Triangle (Art 14, 19, 21): Procedure must be Just, Fair & Reasonable!
          │
  2017: K.S. Puttaswamy► Right to Privacy affirmed as intrinsic fundamental right under Art 21`,
    'Article 21 guarantees that no person shall be deprived of their life or personal liberty except according to procedure established by law. Through landmark jurisprudence in Maneka Gandhi (1978), the Supreme Court harmonized Articles 14, 19, and 21, establishing that any depriving procedure must be inherently just, fair, and reasonable, ultimately extending to the fundamental Right to Privacy in Puttaswamy (2017).',
    [
      "DON'T confuse Article 21 with rights available only to citizens; Article 21 protects ALL persons, including foreign nationals and non-citizens.",
    ]
  ),

  // --- UPSC: 1857 REVOLT ---
  makeReel(
    'reel-upsc-1857-1',
    'Revolt of 1857: Military, Political & Socio-Economic Causes',
    0,
    49,
    'topic-1857-revolt',
    'Greased cartridges were the spark; Doctrine of Lapse, economic drain, and social alienation were the gunpowder.',
    [
      'Political: Lord Dalhousie Doctrine of Lapse annexed Satara, Jhansi, Nagpur, and Awadh (1856).',
      'Economic: Ruin of traditional handicrafts, high land revenue settlements (Ryotwari/Mahalwari/Permanent).',
      'Military: Introduction of Enfield rifle with greased cartridges offensive to Hindu and Muslim sepoy beliefs.',
    ],
    `  [ CAUSES OF 1857 REVOLT ]
  • Political:  Doctrine of Lapse (Dalhousie annexes Jhansi, Satara, Awadh)
  • Economic:   De-industrialization, heavy land revenue settlement (Ryotwari/Zamidari)
  • Military:   Enfield rifle greased cartridges (cow/pig fat), General Service Enlistment
  • Outcome:    GOI Act 1858 ──► End of Company rule; Direct British Crown sovereignty`,
    'The Revolt of 1857 was the first widespread armed uprising against East India Company rule. While the introduction of greased cartridges triggered the mutiny at Meerut, the revolt was fueled by systemic grievances including Dalhousie Doctrine of Lapse, extreme agrarian taxation, and racial humiliation. Its direct consequence was the Government of India Act 1858, transferring power to the British Crown.',
    [
      "DON'T characterize 1857 as an all-India pan-national revolt; large parts of southern, western, and eastern India, as well as princely rulers like Scindia and Holkar, remained aloof or aided the British.",
    ]
  ),

  // --- UPSC: REPO RATE & INFLATION ---
  makeReel(
    'reel-upsc-repo-1',
    'RBI Monetary Policy: How Repo Rate Tames Inflation',
    1,
    51,
    'topic-repo-inflation',
    'Hiking the repo rate increases bank borrowing costs, cools credit expansion, and dampens aggregate demand.',
    [
      'Repo Rate: Interest rate at which RBI lends short-term money to commercial banks against government securities.',
      'Flexible Inflation Target: 4% (+/- 2% tolerance band) mandated under the RBI Act.',
      'Monetary Policy Committee (MPC) consists of 6 members (3 RBI, 3 Government of India appointed).',
    ],
    `  HIGH INFLATION (> 6%)
        │
        ▼
  RBI Hikes Repo Rate (e.g. 6.50%)
        │
        ▼
  Commercial Banks Raise Lending & FD Rates
        │
        ▼
  Borrowing Decreases + Savings Increase ──► Demand Cools ──► Inflation Drops!`,
    'Under the Flexible Inflation Targeting framework (4% +/- 2%), the RBI Monetary Policy Committee adjusts the Repo Rate—the benchmark rate at which the central bank lends overnight funds to commercial banks against government securities. Raising the repo rate tightens systemic liquidity and increases loan interest rates, moderating demand-pull inflationary pressures.',
    [
      "DON'T confuse Repo Rate with Standing Deposit Facility (SDF); Repo is what RBI charges banks to borrow, while SDF is what RBI pays banks to absorb surplus liquidity.",
    ]
  ),

  // --- JEE: GAUSS LAW & FLUX ---
  makeReel(
    'reel-jee-gauss-1',
    "Gauss's Law (∮ E·dA = q_in/ε₀): External Charges vs Enclosed Flux",
    '/physics_reels/reel-jee-gauss-1.mp4',
    45,
    'topic-gauss-flux',
    'Net electric flux Φ through a closed Gaussian surface depends ONLY on enclosed charge (q_in), while Electric Field E depends on ALL charges!',
    [
      'Gauss Law: Φ_net = ∮ E · dA = q_enclosed / ε₀.',
      'External charges (q_out) contribute zero net flux because every field line entering the closed surface also exits it.',
      'However, the Electric Field vector E at any point on the surface is the superposition of BOTH inside and outside charges.',
    ],
    `  [ GAUSSIAN SURFACE ]
    ╭───────────────╮
    │   +q_in       │  ◄─── Net Flux Φ = q_in / ε₀ (ONLY q_in!)
    ╰───────────────╯
           ▲
           │ Field lines enter & exit (Net Flux = 0)
        +q_out (External Charge still affects E at surface points!)`,
    'In JEE electrostatics, never confuse Net Flux with Electric Field in Gauss Law (∮ E·dA = q_in/ε₀). While the total flux through a closed surface depends strictly on the enclosed charge q_in, the electric field vector E at any point on that surface is determined by all charges—both inside and outside.',
    [
      "DON'T claim E is zero on a Gaussian surface just because q_enclosed is zero; external charges still produce a non-zero E field that enters and exits with zero net flux.",
    ]
  ),
  makeReel(
    'reel-jee-gauss-2',
    'Gaussian Symmetry Shortcuts: Charge at Center, Face, Edge & Corner of a Cube',
    '/physics_reels/reel-jee-gauss-2.mp4',
    45,
    'topic-gauss-flux',
    'Use 3D cube symmetry to solve flux in 5 seconds: Center = q/ε₀, Face = q/2ε₀, Edge = q/4ε₀, Corner = q/8ε₀.',
    [
      'Charge at Cube Center: Total flux = q/ε₀; flux through 1 face = q / (6ε₀).',
      'Charge at Cube Corner: Shared by 8 surrounding cubes ──► Total cube flux = q / (8ε₀).',
      'For a corner charge, flux through the 3 faces touching the corner is 0; flux through each of the 3 opposite faces is q / (24ε₀).',
    ],
    `  [ CUBE SYMMETRY FLUX SHORTCUTS ]
  • Center of Cube : Φ_total = q / ε₀     │ Φ_face = q / 6ε₀
  • Face Center    : Φ_total = q / 2ε₀    │ (Shared by 2 cubes)
  • Edge Center    : Φ_total = q / 4ε₀    │ (Shared by 4 cubes)
  • Corner Vertex  : Φ_total = q / 8ε₀    │ Φ_far_face = q / 24ε₀`,
    'To solve Gaussian cube flux problems in under 5 seconds, tile identical cubes around the charge to enclose it symmetrically. A corner charge requires 8 cubes to enclose, giving q/8ε₀ total flux through one cube—and since field lines graze the 3 adjacent faces with zero flux, the remaining 3 faces each receive exactly q/24ε₀.',
    [
      "DON'T divide q/8ε₀ by 6 for a corner charge! Field lines are parallel to the 3 faces meeting at that corner, so flux is shared only among the 3 non-adjacent faces (q/24ε₀).",
    ]
  ),

  // --- JEE: ORGANIC SN1 vs SN2 ---
  makeReel(
    'reel-jee-sn1-sn2-1',
    'SN1 vs SN2 Mechanisms: Carbocation vs Backside Attack',
    3,
    50,
    'topic-sn1-sn2',
    'SN2 is single-step with inversion; SN1 is two-step with carbocation intermediate and racemization.',
    [
      'SN2: Rate = k[R-X][Nu]. Favored by methyl > 1° > 2°. Polar aprotic solvents (DMSO, Acetone).',
      'SN1: Rate = k[R-X]. Favored by 3° > 2°. Polar protic solvents (Water, Ethanol).',
      'Stereochemistry: SN2 gives complete Walden Inversion; SN1 yields partial racemization.',
    ],
    `  MECHANISM       RATE LAW          INTERMEDIATE         STEREOCHEMISTRY    SUBSTRATE
  SN1             Rate = k[R-X]     Carbocation (sp2)    Racemization       3° > 2° >> 1°
  SN2             Rate = k[R-X][Nu] None (Transition)    Walden Inversion   Methyl > 1° > 2° >> 3°`,
    'Nucleophilic aliphatic substitution proceeds through either bimolecular SN2 or unimolecular SN1 pathways. SN2 favors primary halides with strong nucleophiles in polar aprotic solvents, proceeding via concerted backside attack with Walden inversion. In contrast, SN1 is favored by tertiary substrates with weak nucleophiles in polar protic solvents, proceeding via a planar carbocation intermediate producing racemization.',
    [
      "DON'T propose an SN2 reaction on a tertiary alkyl halide; severe steric hindrance at the backside makes SN2 impossible, yielding E2 elimination instead.",
    ]
  ),

  // --- JEE: THERMODYNAMICS & GIBBS ---
  makeReel(
    'reel-jee-thermo-1',
    'Gibbs Free Energy & Spontaneity: ΔG = ΔH - TΔS Decoded',
    4,
    47,
    'topic-thermo-gibbs',
    'A reaction is spontaneous at constant T and P if and only if ΔG is negative.',
    [
      'ΔG < 0: Spontaneous (exergonic). ΔG = 0: Equilibrium. ΔG > 0: Non-spontaneous (endergonic).',
      'If ΔH < 0 and ΔS > 0: Always spontaneous at all temperatures.',
      'If ΔH > 0 and ΔS < 0: Never spontaneous at any temperature.',
    ],
    `  ΔH        ΔS        ΔG = ΔH - TΔS       SPONTANEITY
  Negative  Positive  Always Negative     Spontaneous at ALL temperatures
  Positive  Negative  Always Positive     Non-spontaneous at ALL temperatures
  Negative  Negative  Negative at LOW T   Spontaneous at low temperatures
  Positive  Positive  Negative at HIGH T  Spontaneous at high temperatures`,
    'The second law of thermodynamics requires the total entropy of the universe to increase for any spontaneous process. Under isothermal and isobaric laboratory conditions, this translates directly to the Gibbs free energy change: ΔG = ΔH - TΔS. A negative ΔG indicates an exergonic spontaneous reaction, while ΔG = 0 marks dynamic equilibrium where forward and reverse reaction rates balance.',
    [
      "DON'T confuse thermodynamic spontaneity (ΔG < 0) with reaction rate; diamond converting to graphite is spontaneous but kinetically imperceptible at room temperature due to high activation energy.",
    ]
  ),

  // --- JEE: LEIBNIZ INTEGRAL ---
  makeReel(
    'reel-jee-leibniz-1',
    'Leibniz Rule: Differentiating Under the Integral Sign',
    5,
    48,
    'topic-leibniz-integral',
    'd/dx ∫[u(x) to v(x)] f(t) dt combines boundary derivatives with integrand evaluation.',
    [
      'Formula: d/dx [ ∫_{u(x)}^{v(x)} f(t) dt ] = f(v(x)) * v(x) - f(u(x)) * u(x).',
      'If integrand also contains x, add ∫ [∂f/∂x] dt inside the integral.',
      'Extremely high frequency topic in JEE Advanced definite integral questions.',
    ],
    `  d/dx [ ∫_{u(x)}^{v(x)} f(t) dt ] = f(v(x)) · v'(x)  -  f(u(x)) · u'(x)

  Example: d/dx [ ∫_{0}^{x²} sin(t) dt ]
  = sin(x²) · (2x) - sin(0) · (0)
  = 2x sin(x²)`,
    'The Leibniz Integral Rule enables differentiation of definite integrals whose upper and lower limits are themselves functions of x. Applying the fundamental theorem of calculus with the chain rule, the derivative equals the integrand evaluated at the upper limit multiplied by the upper derivative, minus the integrand evaluated at the lower limit multiplied by the lower derivative.',
    [
      "DON'T forget to multiply by the derivative of the limit functions (chain rule); omitting v'(x) is the most frequent calculus sign error.",
    ]
  ),

  // --- NEET: MENDELIAN GENETICS ---
  makeReel(
    'reel-neet-genetics-1',
    'Mendels Dihybrid Cross: 9:3:3:1 Phenotypic Ratio Explained',
    6,
    51,
    'topic-mendelian-genetics',
    'Independent assortment occurs because non-homologous chromosome pairs align independently during meiosis.',
    [
      'Parents: Round Yellow (RRYY) crossed with Wrinkled Green (rryy).',
      'F1 Generation: All Round Yellow (RrYy).',
      'F2 Phenotypic Ratio: 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green.',
    ],
    `  Parents: RRYY (Round Yellow)  x  rryy (Wrinkled Green)
  F1:      All RrYy (Round Yellow)
  F2 Cross: 16 Punnett Squares
  ──► 9 Round Yellow  : 3 Round Green  : 3 Wrinkled Yellow  : 1 Wrinkled Green`,
    'Gregor Mendels dihybrid cross between homozygous dominant round yellow seeds and homozygous recessive wrinkled green seeds yielded an F2 phenotypic ratio of 9:3:3:1. This established the Law of Independent Assortment, demonstrating that allele pairs for different traits segregate independently during gamete formation, assuming the gene loci are on non-homologous chromosomes.',
    [
      "DON'T assume the 9:3:3:1 ratio holds for linked genes; linkage on the same chromosome causes parental combinations to exceed recombinants, violating independent assortment.",
    ]
  ),

  // --- NEET: TOTAL INTERNAL REFLECTION ---
  makeReel(
    'reel-neet-tir-1',
    'Total Internal Reflection (TIR): Denser-to-Rarer Condition & sin(θc) = n₂/n₁',
    '/physics_reels/reel-neet-tir-1.mp4',
    45,
    'topic-total-internal-reflection',
    'TIR requires light to travel from optically denser (n₁) to rarer (n₂) medium at an angle i > θc = sin⁻¹(n₂/n₁).',
    [
      'Condition 1: Light MUST travel from optically denser to optically rarer medium (n₁ > n₂).',
      'Condition 2: Angle of incidence i must exceed Critical Angle θc, where sin(θc) = n₂ / n₁ = 1 / μ.',
      'At i = θc, the refracted ray grazes the boundary at r = 90°; for i > θc, 100% of light reflects internally.',
    ],
    `             Normal
                │
  Rarer (n₂)    │         Refracted ray grazes at r = 90° (when i = θc)
  ──────────────┼───────────────────────────────► Boundary
  Denser (n₁)   │      ↗  100% Total Internal Reflection! (when i > θc)
                │    ↗
                │ ↗   sin(θc) = n₂ / n₁`,
    'Total Internal Reflection occurs only when two strict conditions are met: light travels from an optically denser medium to a rarer medium, and the angle of incidence exceeds the critical angle θc where sin(θc) equals n₂ over n₁. Beyond θc, refraction is mathematically impossible and 100% of light intensity reflects back.',
    [
      "DON'T try to compute a critical angle when light moves from air into glass or water; TIR is physically impossible from rarer to denser media.",
    ]
  ),
  makeReel(
    'reel-neet-tir-2',
    'TIR in Action: Optical Fibers, Medical Endoscopes & Diamond Brilliance (θc = 24.4°)',
    '/physics_reels/reel-neet-tir-2.mp4',
    45,
    'topic-total-internal-reflection',
    'Optical fibers trap light with zero signal loss using a high-index Core (n₁) surrounded by a lower-index Cladding (n₂).',
    [
      'Optical Fiber & Endoscope: Inner Core has higher refractive index (n₁ ≈ 1.52) than outer Cladding (n₂ ≈ 1.48).',
      'Diamond Brilliance: High refractive index (n = 2.42) gives a tiny critical angle θc = 24.4°, trapping light for multiple internal reflections.',
      'Mirage in Deserts: Hot air near ground is optically rarer than cooler air above, bending sky light upward via TIR.',
    ],
    `  [ OPTICAL FIBER STRUCTURE ]
  ┌───────────────────────────────────────────────────┐
  │ Cladding (Lower Index n₂ ≈ 1.48)                  │
  ├───────────────────────────────────────────────────┤
  │ Core (Higher Index n₁ ≈ 1.52)  ──► ╱╲  ╱╲  ╱╲ ──► │
  ├───────────────────────────────────────────────────┤
  │ Cladding (Lower Index n₂ ≈ 1.48)                  │
  └───────────────────────────────────────────────────┘`,
    'Every real-world TIR application relies on keeping light inside a high-index core. In optical fibers and medical endoscopes, the inner glass core has a higher refractive index than the outer cladding so laser pulses bounce miles with virtually zero attenuation. Similarly, diamond’s high refractive index of 2.42 shrinks its critical angle to just 24.4 degrees, trapping light to create its signature sparkle.',
    [
      "DON'T swap core and cladding refractive indices in NEET questions: n_core MUST always be strictly greater than n_cladding.",
    ]
  ),

  // --- SCHOOL CLASS 10: TRIGONOMETRIC IDENTITIES ---
  makeReel(
    'reel-school-trig-1',
    'Pythagorean Trigonometric Identities & Proofs',
    0,
    45,
    'topic-trig-identities',
    'sin²θ + cos²θ = 1 arises directly from Pythagoras theorem on the unit circle.',
    [
      'Identity 1: sin²θ + cos²θ = 1.',
      'Identity 2: 1 + tan²θ = sec²θ (divide Identity 1 by cos²θ).',
      'Identity 3: 1 + cot²θ = csc²θ (divide Identity 1 by sin²θ).',
    ],
    `  Unit Circle: x = cos(θ), y = sin(θ), radius = 1
  x² + y² = 1  ──►  cos²(θ) + sin²(θ) = 1

  Divide by cos²(θ):   1 + tan²(θ) = sec²(θ)
  Divide by sin²(θ):   1 + cot²(θ) = csc²(θ)`,
    'The fundamental trigonometric identities originate directly from the Pythagorean theorem applied to right triangles and the unit circle. Dividing the identity sin²θ + cos²θ = 1 by cos²θ yields 1 + tan²θ = sec²θ, while dividing by sin²θ yields 1 + cot²θ = csc²θ. These three identities allow algebraic transformation between any circular functions.',
    [
      "DON'T confuse sec²θ - tan²θ = 1 with tan²θ - sec²θ; order matters because subtraction is non-commutative.",
    ]
  ),

  // --- SCHOOL CLASS 10: REDOX REACTIONS ---
  makeReel(
    'reel-school-redox-1',
    'Redox Reactions: Oxidation Numbers & Electron Transfer',
    1,
    47,
    'topic-redox-reactions',
    'Oxidation Is Loss of electrons (OIL); Reduction Is Gain of electrons (RIG).',
    [
      'Oxidation: Addition of oxygen, removal of hydrogen, or loss of electrons.',
      'Reduction: Removal of oxygen, addition of hydrogen, or gain of electrons.',
      'Substance oxidized is the Reducing Agent; substance reduced is the Oxidizing Agent.',
    ],
    `        ┌──────── Loss of 2e⁻ (Oxidation) ────────┐
        ▼                                          ▼
      Zn(s)   +   Cu²⁺(aq)   ──►   Zn²⁺(aq)   +   Cu(s)
                   ▲                                ▲
                   └────── Gain of 2e⁻ (Reduction) ──┘
  Zn is Reducing Agent (gets oxidized) | Cu²⁺ is Oxidizing Agent (gets reduced)`,
    'Oxidation-reduction (redox) reactions involve the simultaneous transfer of electrons between chemical species. Oxidation corresponds to an increase in oxidation state or loss of electrons, while reduction corresponds to a decrease in oxidation state or gain of electrons. The species losing electrons acts as the reducing agent, while the electron acceptor functions as the oxidizing agent.',
    [
      "DON'T confuse the agent with the process: the substance that is oxidized is the REDUCING agent, and the substance that is reduced is the OXIDIZING agent.",
    ]
  ),
];

// ==========================================
// 7. HOME FEED SHORTCUTS & RECOMMENDATIONS
// ==========================================
export const mockHomeFeed: HomeFeedDto = {
  subjectShortcuts: [
    { id: 'tech-sysdesign', name: 'System Design', classLevel: 0 },
    { id: 'tech-dsa', name: 'DSA Patterns', classLevel: 0 },
    { id: 'tech-frontend', name: 'Frontend & React', classLevel: 0 },
    { id: 'pm-product-sense', name: 'Product Sense', classLevel: 0 },
    { id: 'upsc-polity', name: 'UPSC Polity', classLevel: 0 },
    { id: 'jee-physics', name: 'JEE Physics', classLevel: 0 },
    { id: 'neet-biology', name: 'NEET Biology', classLevel: 0 },
  ],
  continueLearning: [
    mockTopicDetails[0], // CAP Theorem
    mockTopicDetails[1], // Consistent Hashing
    mockTopicDetails[5], // Two Pointers
  ],
  recommended: [
    mockTopicDetails[2], // Rate Limiting
    mockTopicDetails[10], // React Fiber
    mockTopicDetails[14], // CIRCLES Method
    mockTopicDetails[20], // Preamble Ideals
  ],
  quickRevision: [
    mockTopicDetails[0], // CAP Theorem
    mockTopicDetails[25], // Rotational Motion
    mockTopicDetails[29], // Cardiac Cycle
  ],
};

// ==========================================
// 8. QUIZZES
// ==========================================
export const mockQuizzes: Record<string, QuizDto> = {
  'topic-cap-theorem': {
    topicId: 'topic-cap-theorem',
    topicTitle: 'CAP Theorem & PACELC Trade-offs',
    questions: [
      {
        id: 'q-cap-1',
        text: 'In the presence of a network partition, an AP (Available / Partition Tolerant) system will:',
        options: [
          { id: 'opt-1', text: 'Reject writes to prevent inconsistency' },
          { id: 'opt-2', text: 'Accept reads and writes, returning potentially stale data' },
          { id: 'opt-3', text: 'Crash all nodes until communication is restored' },
          { id: 'opt-4', text: 'Automatically achieve linearizability' },
        ],
        correctOptionId: 'opt-2',
        topicId: 'topic-cap-theorem',
      },
      {
        id: 'q-cap-2',
        text: 'According to PACELC, in normal operating conditions without network partition, systems trade off:',
        options: [
          { id: 'opt-1', text: 'Latency versus Consistency' },
          { id: 'opt-2', text: 'Availability versus Partition Tolerance' },
          { id: 'opt-3', text: 'Bandwidth versus Security' },
          { id: 'opt-4', text: 'CPU usage versus Storage' },
        ],
        correctOptionId: 'opt-1',
        topicId: 'topic-cap-theorem',
      },
    ],
  },
  'topic-consistent-hashing': {
    topicId: 'topic-consistent-hashing',
    topicTitle: 'Consistent Hashing & Ring Rebalancing',
    questions: [
      {
        id: 'q-hash-1',
        text: 'What primary problem do Virtual Nodes solve in Consistent Hashing?',
        options: [
          { id: 'opt-1', text: 'They encrypt client credentials' },
          { id: 'opt-2', text: 'They prevent uneven key distribution (hot spots) on the ring' },
          { id: 'opt-3', text: 'They eliminate the need for hash functions' },
          { id: 'opt-4', text: 'They speed up disk I/O' },
        ],
        correctOptionId: 'opt-2',
        topicId: 'topic-consistent-hashing',
      },
    ],
  },
  'topic-rate-limiting': {
    topicId: 'topic-rate-limiting',
    topicTitle: 'Token Bucket vs Leaky Bucket Rate Limiting',
    questions: [
      {
        id: 'q-rl-1',
        text: 'Which rate limiting algorithm allows short bursts of traffic up to bucket capacity?',
        options: [
          { id: 'opt-1', text: 'Leaky Bucket' },
          { id: 'opt-2', text: 'Token Bucket' },
          { id: 'opt-3', text: 'Fixed Window' },
          { id: 'opt-4', text: 'FIFO Queue' },
        ],
        correctOptionId: 'opt-2',
        topicId: 'topic-rate-limiting',
      },
    ],
  },
};

// ==========================================
// 9. FLASHCARDS
// ==========================================
export const mockFlashcards: Record<string, FlashcardDto[]> = {
  'topic-cap-theorem': [
    {
      id: 'fc-1',
      topicId: 'topic-cap-theorem',
      frontQuestion: 'What does Partition Tolerance (P) strictly mean in CAP theorem?',
      backAnswer: 'The system continues to function even if arbitrary messages are delayed or lost between nodes across the network.',
      bullets: [
        'You cannot "opt out" of partitions in real physical networks.',
        'When P happens, you must choose CP (refuse writes/reads) or AP (accept writes/reads with stale data).',
      ],
    },
    {
      id: 'fc-2',
      topicId: 'topic-cap-theorem',
      frontQuestion: 'Name 2 real-world CP databases vs 2 AP databases.',
      backAnswer: 'CP: Google Cloud Spanner, Apache ZooKeeper / Etcd. AP: Apache Cassandra, Amazon DynamoDB (default).',
      bullets: [
        'CP ensures linearizable consistency at the cost of availability during cuts.',
        'AP ensures 99.999% uptime with eventual consistency.',
      ],
    },
  ],
  'topic-consistent-hashing': [
    {
      id: 'fc-3',
      topicId: 'topic-consistent-hashing',
      frontQuestion: 'How many keys need remapping when a cache server is added in Consistent Hashing?',
      backAnswer: 'Only k / N keys on average (where k is total keys, N is number of servers). Standard hash(k) % N remaps almost 100% of keys.',
      bullets: [
        'Virtual nodes (vnodes) prevent hot-spotting when physical nodes are heterogeneous.',
      ],
    },
  ],
  'topic-circles-method': [
    {
      id: 'fc-pm-1',
      topicId: 'topic-circles-method',
      frontQuestion: 'What do the 7 letters of the CIRCLES Product Design framework stand for?',
      backAnswer: 'Comprehend situation, Identify customer, Report customer needs, Cut through prioritization, List solutions, Evaluate trade-offs, Summarize.',
      bullets: [
        'Never jump to solutions before clarifying the goal, target persona, and pain points.',
        'Always define a North Star metric before evaluating trade-offs.',
      ],
    },
  ],
  'topic-basic-structure': [
    {
      id: 'fc-upsc-1',
      topicId: 'topic-basic-structure',
      frontQuestion: 'Which landmark 1973 Supreme Court case established the Basic Structure Doctrine?',
      backAnswer: 'Kesavananda Bharati v. State of Kerala (1973) by a razor-thin 7:6 majority bench.',
      bullets: [
        'Parliament can amend any part of the Constitution under Article 368 EXCEPT its Basic Structure.',
        'Judicial Review, Secularism, Federalism, and Free & Fair Elections are part of the Basic Structure.',
      ],
    },
  ],
  'topic-cardiac-cycle': [
    {
      id: 'fc-neet-1',
      topicId: 'topic-cardiac-cycle',
      frontQuestion: 'What physiological events correspond to the P wave, QRS complex, and T wave on an ECG?',
      backAnswer: 'P wave = Atrial depolarization; QRS complex = Ventricular depolarization; T wave = Ventricular repolarization.',
      bullets: [
        'Atrial systole lasts 0.1s, ventricular systole 0.3s, and joint diastole 0.4s (Total = 0.8s at 72 bpm).',
        'Lub (S1) is closure of AV valves; Dub (S2) is closure of semilunar valves.',
      ],
    },
  ],
  'topic-moment-inertia': [
    {
      id: 'fc-jee-1',
      topicId: 'topic-moment-inertia',
      frontQuestion: 'When does the Perpendicular Axis Theorem (Iz = Ix + Iy) apply, and when does it fail?',
      backAnswer: 'It applies ONLY to 2D planar lamina bodies where Ix and Iy lie in the plane of the lamina and Iz is perpendicular to it. It FAILS for 3D bodies like spheres or cylinders.',
      bullets: [
        'Parallel Axis Theorem (I = I_cm + M*d^2) works for ANY 2D or 3D rigid body.',
      ],
    },
  ],
  'topic-dcf-model': [
    {
      id: 'fc-fin-1',
      topicId: 'topic-dcf-model',
      frontQuestion: 'How do you calculate Unlevered Free Cash Flow (UFCF) in a DCF valuation?',
      backAnswer: 'UFCF = EBIT × (1 - Tax Rate) + D&A - CapEx - Change in Net Working Capital.',
      bullets: [
        'UFCF is discounted using WACC to yield Enterprise Value (EV) available to all capital providers.',
      ],
    },
  ],
};

// ==========================================
// 10. PROGRESS & BOOKMARKS
// ==========================================
export const mockProgress: TopicProgressDto[] = [
  {
    id: 'prog-1',
    topicId: 'topic-cap-theorem',
    completionPercent: 100,
    createdAt: new Date('2026-10-18'),
    updatedAt: new Date('2026-10-21'),
    topic: { id: 'topic-cap-theorem', title: 'CAP Theorem & PACELC Trade-offs', difficulty: 'Medium' },
    chapter: { id: 'ch-sd-distributed', title: 'Distributed Core Concepts' },
    subject: { id: 'tech-sysdesign', name: 'System Design & Arch', classLevel: 0 },
  },
  {
    id: 'prog-2',
    topicId: 'topic-circles-method',
    completionPercent: 75,
    createdAt: new Date('2026-10-19'),
    updatedAt: new Date('2026-10-21'),
    topic: { id: 'topic-circles-method', title: 'Mastering the CIRCLES Framework for Interviews', difficulty: 'Medium' },
    chapter: { id: 'ch-pm-circles', title: 'CIRCLES Framework for Product Design' },
    subject: { id: 'pm-product-sense', name: 'Product Sense & CIRCLES', classLevel: 0 },
  },
  {
    id: 'prog-3',
    topicId: 'topic-basic-structure',
    completionPercent: 60,
    createdAt: new Date('2026-10-20'),
    updatedAt: new Date('2026-10-21'),
    topic: { id: 'topic-basic-structure', title: 'Basic Structure Doctrine & Judicial Review', difficulty: 'Hard' },
    chapter: { id: 'ch-preamble', title: 'Preamble & Basic Structure' },
    subject: { id: 'upsc-polity', name: 'Indian Polity & Constitution', classLevel: 0 },
  },
  {
    id: 'prog-4',
    topicId: 'topic-cardiac-cycle',
    completionPercent: 50,
    createdAt: new Date('2026-10-20'),
    updatedAt: new Date('2026-10-21'),
    topic: { id: 'topic-cardiac-cycle', title: 'Cardiac Cycle, ECG Waves & Double Circulation', difficulty: 'Medium' },
    chapter: { id: 'ch-neet-circulatory', title: 'Human Circulatory System & ECG' },
    subject: { id: 'neet-biology', name: 'Biology (Physiology & Genetics)', classLevel: 0 },
  },
];

export const mockBookmarks: BookmarkDto[] = [
  {
    id: 'bm-1',
    topicId: 'topic-cap-theorem',
    reelId: 'reel-cap-1',
    createdAt: new Date('2026-10-20'),
    topic: { id: 'topic-cap-theorem', title: 'CAP Theorem & PACELC Trade-offs', difficulty: 'Medium' },
    chapter: { id: 'ch-sd-distributed', title: 'Distributed Core Concepts' },
    subject: { id: 'tech-sysdesign', name: 'System Design & Arch', classLevel: 0 },
  },
  {
    id: 'bm-2',
    topicId: 'topic-circles-method',
    reelId: 'reel-pm-circles-1',
    createdAt: new Date('2026-10-21'),
    topic: { id: 'topic-circles-method', title: 'Mastering the CIRCLES Framework for Interviews', difficulty: 'Medium' },
    chapter: { id: 'ch-pm-circles', title: 'CIRCLES Framework for Product Design' },
    subject: { id: 'pm-product-sense', name: 'Product Sense & CIRCLES', classLevel: 0 },
  },
  {
    id: 'bm-3',
    topicId: 'topic-basic-structure',
    reelId: 'reel-upsc-basic-structure-1',
    createdAt: new Date('2026-10-21'),
    topic: { id: 'topic-basic-structure', title: 'Basic Structure Doctrine & Judicial Review', difficulty: 'Hard' },
    chapter: { id: 'ch-preamble', title: 'Preamble & Basic Structure' },
    subject: { id: 'upsc-polity', name: 'Indian Polity & Constitution', classLevel: 0 },
  },
  {
    id: 'bm-4',
    topicId: 'topic-cardiac-cycle',
    reelId: 'reel-neet-cardiac-1',
    createdAt: new Date('2026-10-21'),
    topic: { id: 'topic-cardiac-cycle', title: 'Cardiac Cycle, ECG Waves & Double Circulation', difficulty: 'Medium' },
    chapter: { id: 'ch-neet-circulatory', title: 'Human Circulatory System & ECG' },
    subject: { id: 'neet-biology', name: 'Biology (Physiology & Genetics)', classLevel: 0 },
  },
  {
    id: 'bm-5',
    topicId: 'topic-moment-inertia',
    reelId: 'reel-jee-rotational-1',
    createdAt: new Date('2026-10-21'),
    topic: { id: 'topic-moment-inertia', title: 'Parallel & Perpendicular Axis Theorems', difficulty: 'Hard' },
    chapter: { id: 'ch-jee-rotational', title: 'Rotational Motion & Dynamics' },
    subject: { id: 'jee-physics', name: 'Physics (Mechanics & Electro)', classLevel: 0 },
  },
];

// ==========================================
// 11. REAL REEL AVAILABILITY HELPERS
// ==========================================
export const TOPICS_WITH_REAL_REELS = new Set<string>(
  mockReels
    .filter((r) => !SAMPLE_VIDEOS.includes(r.videoUrl))
    .map((r) => r.topicId)
);

export const CHAPTERS_WITH_REAL_REELS = new Set<string>(
  mockTopics
    .filter((t) => TOPICS_WITH_REAL_REELS.has(t.id))
    .map((t) => t.chapterId)
);

export const SUBJECTS_WITH_REAL_REELS = new Set<string>(
  Object.entries(mockChaptersBySubject)
    .filter(([, chapters]) => chapters.some((c) => CHAPTERS_WITH_REAL_REELS.has(c.id)))
    .map(([subjectId]) => subjectId)
);

export const EXAM_TYPES_WITH_REAL_REELS = new Set<string>(
  Object.entries(mockSubjectsByExamType)
    .filter(([, subjects]) => subjects.some((s) => SUBJECTS_WITH_REAL_REELS.has(s.id)))
    .map(([examType]) => examType)
);

export function hasRealReel(topicId: string): boolean {
  return TOPICS_WITH_REAL_REELS.has(topicId);
}

// ==========================================
// 12. COMMUNITY TRENDING & TOP-GROSSING REELS
// ==========================================
const CURATED_REEL_COMMUNITY_META: Record<
  string,
  {
    badge: TrendingBadgeType;
    badgeLabel: string;
    viewsCount: number;
    completionsCount: number;
    completionRate: number;
    rewatchesCount: number;
    likesCount: number;
    bookmarksCount: number;
    sharesCount: number;
    commentsCount: number;
    activeLearnersNow: number;
    trendingScore: number;
    velocityDeltaPercent: number;
    quizPassRate: number;
    authorName: string;
    authorBadge: string;
    topComment: string;
    upvotesCount: number;
    createdAt: string;
  }
> = {
  'reel-jee-rotational-1': {
    badge: 'TRENDING_1',
    badgeLabel: '🔥 #1 TRENDING TODAY',
    viewsCount: 48200,
    completionsCount: 46270,
    completionRate: 96,
    rewatchesCount: 14900,
    likesCount: 8420,
    bookmarksCount: 5120,
    sharesCount: 2340,
    commentsCount: 642,
    activeLearnersNow: 184,
    trendingScore: 99.4,
    velocityDeltaPercent: 485,
    quizPassRate: 94,
    authorName: 'Aarav Sharma',
    authorBadge: 'IIT Bombay CSE • JEE Adv Cohort',
    topComment:
      'The 0:28 warning about never applying Iz = Ix + Iy to a 3D sphere saved me from a -1 negative mark trap in Allen Mock #6!',
    upvotesCount: 1290,
    createdAt: '2h ago',
  },
  'reel-jee-gauss-1': {
    badge: 'TOP_GROSSING',
    badgeLabel: '🏆 #1 TOP GROSSING',
    viewsCount: 64500,
    completionsCount: 61275,
    completionRate: 95,
    rewatchesCount: 19300,
    likesCount: 11240,
    bookmarksCount: 7840,
    sharesCount: 3190,
    commentsCount: 814,
    activeLearnersNow: 156,
    trendingScore: 98.1,
    velocityDeltaPercent: 390,
    quizPassRate: 93,
    authorName: 'Ishaan Verma',
    authorBadge: 'JEE 99.94%ile • Physics Mentor',
    topComment:
      'Finally understood why external charges warp the E-field on the surface while net flux still cancels out to Q_enclosed / ε0.',
    upvotesCount: 1640,
    createdAt: '4h ago',
  },
  'reel-neet-tir-1': {
    badge: 'HIGH_RETENTION',
    badgeLabel: '⚡ 97% COMPLETION',
    viewsCount: 52900,
    completionsCount: 51313,
    completionRate: 97,
    rewatchesCount: 16800,
    likesCount: 9340,
    bookmarksCount: 6410,
    sharesCount: 2780,
    commentsCount: 590,
    activeLearnersNow: 142,
    trendingScore: 96.8,
    velocityDeltaPercent: 360,
    quizPassRate: 96,
    authorName: 'Dr. Ananya Nair',
    authorBadge: 'AIIMS Delhi • NEET 705/720',
    topComment:
      'sin(θc) = n2/n1 visual ray transition from denser to rarer medium is crystal clear. Best 45 seconds for Ray Optics revision!',
    upvotesCount: 1120,
    createdAt: '3h ago',
  },
  'reel-school-ohm-1': {
    badge: 'COMMUNITY_FAVORITE',
    badgeLabel: '💎 COMMUNITY FAVORITE',
    viewsCount: 41800,
    completionsCount: 39290,
    completionRate: 94,
    rewatchesCount: 12400,
    likesCount: 7890,
    bookmarksCount: 4920,
    sharesCount: 2150,
    commentsCount: 512,
    activeLearnersNow: 118,
    trendingScore: 94.5,
    velocityDeltaPercent: 310,
    quizPassRate: 95,
    authorName: 'Riya Kapoor',
    authorBadge: 'CBSE Class 10 • 99.2% Scholar',
    topComment:
      'The non-ohmic filament bulb curve vs constant-temperature metallic conductor graph is guaranteed to come in Section C!',
    upvotesCount: 980,
    createdAt: '5h ago',
  },
  'reel-jee-rotational-2': {
    badge: 'RISING_FAST',
    badgeLabel: '🚀 RISING FAST (+410%)',
    viewsCount: 36400,
    completionsCount: 34216,
    completionRate: 94,
    rewatchesCount: 13200,
    likesCount: 6740,
    bookmarksCount: 4380,
    sharesCount: 1890,
    commentsCount: 428,
    activeLearnersNow: 109,
    trendingScore: 93.2,
    velocityDeltaPercent: 410,
    quizPassRate: 91,
    authorName: 'Karan Mehta',
    authorBadge: 'IIT Kanpur • Rotational Ace',
    topComment:
      'Step 1 shift to COM first (I_cm = I_given - Md1²), Step 2 shift to target axis. Never shifting directly between non-COM axes again!',
    upvotesCount: 845,
    createdAt: '1h ago',
  },
  'reel-jee-gauss-2': {
    badge: 'HIGH_RETENTION',
    badgeLabel: '⚡ MOST REWATCHED',
    viewsCount: 38900,
    completionsCount: 36955,
    completionRate: 95,
    rewatchesCount: 17600,
    likesCount: 7120,
    bookmarksCount: 5090,
    sharesCount: 1940,
    commentsCount: 476,
    activeLearnersNow: 98,
    trendingScore: 92.7,
    velocityDeltaPercent: 295,
    quizPassRate: 92,
    authorName: 'Devansh Joshi',
    authorBadge: 'JEE Advanced Top 500 Cohort',
    topComment:
      'Point charge at cube corner = Q / (8ε0), face center = Q / (2ε0). The 8-cube symmetry mental model makes it effortless.',
    upvotesCount: 910,
    createdAt: '6h ago',
  },
  'reel-neet-tir-2': {
    badge: 'COMMUNITY_FAVORITE',
    badgeLabel: '🔬 HIGH-YIELD OPTICS',
    viewsCount: 33700,
    completionsCount: 31678,
    completionRate: 94,
    rewatchesCount: 11200,
    likesCount: 6280,
    bookmarksCount: 4150,
    sharesCount: 1620,
    commentsCount: 389,
    activeLearnersNow: 86,
    trendingScore: 90.4,
    velocityDeltaPercent: 270,
    quizPassRate: 94,
    authorName: 'Sneha Reddy',
    authorBadge: 'NEET Physics 180/180 Scorer',
    topComment:
      'Optical fiber n_core > n_cladding and diamond 24.4° critical angle trap explained in under 50 seconds!',
    upvotesCount: 760,
    createdAt: '7h ago',
  },
  'reel-school-ohm-2': {
    badge: 'TOP_GROSSING',
    badgeLabel: '🏆 BOARD EXAM ESSENTIAL',
    viewsCount: 39200,
    completionsCount: 36848,
    completionRate: 94,
    rewatchesCount: 12900,
    likesCount: 7050,
    bookmarksCount: 4680,
    sharesCount: 1840,
    commentsCount: 445,
    activeLearnersNow: 92,
    trendingScore: 91.6,
    velocityDeltaPercent: 285,
    quizPassRate: 96,
    authorName: 'kabir_sci10',
    authorBadge: 'NTSE Scholar • Class 10',
    topComment:
      'Why home appliances use parallel wiring (independent switches + 220V constant voltage + R_eq < R_min) is summarized so cleanly.',
    upvotesCount: 830,
    createdAt: '5h ago',
  },
};

// Build trending reel entries for ALL reels in mockReels (real studio reels prioritized first)
export const mockTrendingReels: TrendingReelDto[] = (() => {
  const realStudioReels = mockReels.filter((r) => !SAMPLE_VIDEOS.includes(r.videoUrl));
  const otherReels = mockReels.filter((r) => SAMPLE_VIDEOS.includes(r.videoUrl));
  const ordered = [...realStudioReels, ...otherReels];

  const fallbackBadges: Array<{ badge: TrendingBadgeType; label: string }> = [
    { badge: 'TOP_GROSSING', label: '🏆 TOP GROSSING' },
    { badge: 'HIGH_RETENTION', label: '⚡ 93% COMPLETION' },
    { badge: 'COMMUNITY_FAVORITE', label: '💎 COMMUNITY PICK' },
    { badge: 'RISING_FAST', label: '🚀 TRENDING IN TRACK' },
  ];

  return ordered.map((reel, idx) => {
    const curated = CURATED_REEL_COMMUNITY_META[reel.id];
    if (curated) {
      return {
        ...reel,
        rank: idx + 1,
        badge: curated.badge,
        badgeLabel: curated.badgeLabel,
        metrics: {
          viewsCount: curated.viewsCount,
          completionsCount: curated.completionsCount,
          completionRate: curated.completionRate,
          rewatchesCount: curated.rewatchesCount,
          likesCount: curated.likesCount,
          bookmarksCount: curated.bookmarksCount,
          sharesCount: curated.sharesCount,
          commentsCount: curated.commentsCount,
          activeLearnersNow: curated.activeLearnersNow,
          trendingScore: curated.trendingScore,
          velocityDeltaPercent: curated.velocityDeltaPercent,
          quizPassRate: curated.quizPassRate,
        },
        communityHighlight: {
          authorName: curated.authorName,
          authorBadge: curated.authorBadge,
          topComment: curated.topComment,
          upvotesCount: curated.upvotesCount,
          createdAt: curated.createdAt,
        },
      };
    }

    const fb = fallbackBadges[idx % fallbackBadges.length];
    const viewsCount = Math.max(8500, 29000 - idx * 950);
    const completionRate = 89 + (idx % 7);
    const completionsCount = Math.round((viewsCount * completionRate) / 100);
    return {
      ...reel,
      rank: idx + 1,
      badge: fb.badge,
      badgeLabel: fb.label,
      metrics: {
        viewsCount,
        completionsCount,
        completionRate,
        rewatchesCount: Math.round(viewsCount * 0.28),
        likesCount: Math.round(viewsCount * 0.16),
        bookmarksCount: Math.round(viewsCount * 0.11),
        sharesCount: Math.round(viewsCount * 0.045),
        commentsCount: Math.max(42, 310 - idx * 9),
        activeLearnersNow: Math.max(18, 75 - idx * 2),
        trendingScore: Number(Math.max(72, 89.5 - idx * 0.8).toFixed(1)),
        velocityDeltaPercent: Math.max(85, 240 - idx * 6),
        quizPassRate: 88 + (idx % 8),
      },
      communityHighlight: {
        authorName: `Conceptly Peer #${104 + idx}`,
        authorBadge: `${reel.subject.name} Track`,
        topComment:
          reel.keyTakeaway ||
          `Essential 45-second breakdown for ${reel.topic.title}. Watch twice before taking the checkpoint quiz!`,
        upvotesCount: Math.max(95, 540 - idx * 18),
        createdAt: `${(idx % 9) + 2}h ago`,
      },
    };
  });
})();

export function getMockCommunityReelFeed(options: {
  sortBy?: TrendingReelSortBy;
  timeWindow?: TrendingTimeWindow;
  examType?: string;
  onlyRealReels?: boolean;
}): CommunityReelFeedResponseDto {
  const sortBy = options.sortBy ?? 'trending';
  const timeWindow = options.timeWindow ?? '24h';
  const onlyRealReels = options.onlyRealReels ?? true;

  let pool = onlyRealReels
    ? mockTrendingReels.filter((r) => !SAMPLE_VIDEOS.includes(r.videoUrl))
    : [...mockTrendingReels];

  if (options.examType && options.examType !== 'ALL') {
    const allowedSubjects = new Set(
      (options.examType === 'SCHOOL'
        ? mockSubjectsByClass[10] ?? []
        : mockSubjectsByExamType[options.examType] ?? []
      ).map((s) => s.id)
    );
    const domainFiltered = pool.filter((r) => allowedSubjects.has(r.subject.id));
    if (domainFiltered.length > 0) {
      pool = domainFiltered;
    }
  }

  const windowMultiplier =
    timeWindow === '24h'
      ? 0.28
      : timeWindow === '7d'
      ? 0.65
      : timeWindow === '30d'
      ? 0.88
      : 1.0;

  const scaled = pool.map((item) => ({
    ...item,
    metrics: {
      ...item.metrics,
      viewsCount: Math.max(420, Math.round(item.metrics.viewsCount * windowMultiplier)),
      completionsCount: Math.max(
        390,
        Math.round(item.metrics.completionsCount * windowMultiplier)
      ),
      rewatchesCount: Math.max(
        140,
        Math.round(item.metrics.rewatchesCount * windowMultiplier)
      ),
      likesCount: Math.max(95, Math.round(item.metrics.likesCount * windowMultiplier)),
      bookmarksCount: Math.max(
        60,
        Math.round(item.metrics.bookmarksCount * windowMultiplier)
      ),
      sharesCount: Math.max(25, Math.round(item.metrics.sharesCount * windowMultiplier)),
    },
  }));

  scaled.sort((a, b) => {
    if (sortBy === 'top_grossing') {
      return b.metrics.viewsCount - a.metrics.viewsCount;
    }
    if (sortBy === 'most_rewatched') {
      return (
        b.metrics.rewatchesCount * b.metrics.completionRate -
        a.metrics.rewatchesCount * a.metrics.completionRate
      );
    }
    if (sortBy === 'community_picks') {
      return (
        b.metrics.likesCount +
        b.metrics.sharesCount * 2 -
        (a.metrics.likesCount + a.metrics.sharesCount * 2)
      );
    }
    // default: 'trending' (velocity & trendingScore)
    return b.metrics.trendingScore - a.metrics.trendingScore;
  });

  const ranked = scaled.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const activeLearnersNow = ranked.reduce(
    (sum, r) => sum + r.metrics.activeLearnersNow,
    0
  );
  const reelsWatchedToday = ranked.reduce((sum, r) => sum + r.metrics.viewsCount, 0);
  const totalCommunityUpvotes = ranked.reduce((sum, r) => sum + r.metrics.likesCount, 0);
  const avgCompletionRate =
    ranked.length > 0
      ? Math.round(
          ranked.reduce((sum, r) => sum + r.metrics.completionRate, 0) / ranked.length
        )
      : 95;

  return {
    items: ranked,
    communityPulse: {
      activeLearnersNow,
      reelsWatchedToday,
      totalCommunityUpvotes,
      topTrendingSubject: ranked[0]?.subject?.name ?? 'Physics (Mechanics & Electro)',
      avgCompletionRate,
    },
    sortBy,
    timeWindow,
    nextCursor: null,
  };
}


