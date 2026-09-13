export interface SubjectItem {
  id: string;
  code: string;
  title: string;
  grade: number;
  category: "Science" | "Mathematics";
  description: string;
  teacher: string;
  schedule: string;
  enrolledStudentsCount: number;
  zoomMeetingId?: string;
  zoomPasscode?: string;
  zoomJoinUrl?: string;
  medium?: "English Medium" | "Sinhala Medium" | "Bilingual";
  syllabusTopics?: string[];
}

export interface StudySection {
  heading: string;
  body: string[];
  formulasOrPoints?: string[];
  exampleProblem?: {
    question: string;
    solution: string;
  };
}

export interface MaterialItem {
  id: string;
  title: string;
  subjectId: string;
  subjectTitle: string;
  grade: number;
  category: "Science" | "Mathematics";
  type: "PDF Note" | "Video Lesson" | "Worksheet" | "Formula Sheet";
  fileUrl: string;
  fileSize: string;
  downloads: number;
  uploadedAt: string;
  unitNumber?: number;
  term?: number;
  summary?: string;
  contentSections?: StudySection[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subjectTitle: string;
  grade: number;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface PaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  grade: number;
  subjectTitle: string;
  amount: number;
  slipUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  notes?: string;
  month?: string;
  referenceNo?: string;
  bankName?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  grade: number;
  role: "student" | "admin";
  registeredSubjects: string[]; // subject IDs
  password?: string;
  school?: string;
  medium?: "English" | "Sinhala" | "Tamil";
  parentPhone?: string;
  studentIndex?: string;
  status?: "Active" | "Pending" | "Suspended";
  enrolledSubjectTitle?: string;
}

export const INITIAL_STUDENTS: UserProfile[] = [];

export interface BroadcastMessage {
  id: string;
  targetGrade: string; // 'All' or '6', '7', etc.
  targetSubject: string; // 'All' or specific
  subjectLine: string;
  body: string;
  sentAt: string;
  recipientCount: number;
  priority?: "normal" | "urgent";
}

export interface AcademyBankDetail {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  notes: string;
}

export const ACADEMY_BANK_ACCOUNTS: AcademyBankDetail[] = [
  {
    bankName: "Amana Bank",
    accountName: "MRM NAFEES",
    accountNumber: "0200521878001",
    branch: "Dehiwala Branch",
    notes: "Mention Student Name & Grade as the transfer reference"
  }
];

export const ACADEMY_CONTACT = {
  directorName: "Sir Nafees Mohamed",
  phone: "+94 75 779 4423",
  whatsappDisplay: "+94 75 779 4423",
  whatsappUrl: "https://wa.me/94757794423",
  email: "nfsmhdlms@gmail.com",
  zoomMeetingId: "849 2039 1102",
  zoomPasscode: "NAFEES2026",
  location: "Kandy Road Tuition Complex / Islandwide Online Portal",
  officeHours: "Tuesday – Sunday: 8:00 AM – 7:30 PM (Mondays Closed)"
};

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: "sub-sci-6",
    code: "SCI-06",
    title: "Grade 6 Integrated Science",
    grade: 6,
    category: "Science",
    description: "Living world, diversity of organisms, matter, energy transformations, simple machines, and earth sciences.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Saturday 9:00 AM - 11:00 AM",
    enrolledStudentsCount: 42,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Living Organisms", "Matter & Properties", "Energy & Light", "Weather & Climate"]
  },
  {
    id: "sub-math-6",
    code: "MATH-06",
    title: "Grade 6 Foundation Mathematics",
    grade: 6,
    category: "Mathematics",
    description: "Number line, fractions, decimals, basic geometry, perimeter, area, and introduction to integers.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Sunday 9:00 AM - 11:00 AM",
    enrolledStudentsCount: 38,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Integers & Number Systems", "Fractions & Decimals", "Perimeter & Area", "Angles & Polygons"]
  },
  {
    id: "sub-sci-7",
    code: "SCI-07",
    title: "Grade 7 General Science",
    grade: 7,
    category: "Science",
    description: "Plant physiology, human digestive system, states of matter, forces, pressure, and chemical reactions.",
    teacher: "Sir Nafees Mohamed & Science Demonstrators",
    schedule: "Every Saturday 11:30 AM - 1:30 PM",
    enrolledStudentsCount: 51,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Plant Nutrition", "Human Digestion", "Force & Pressure", "Elements & Compounds"]
  },
  {
    id: "sub-math-7",
    code: "MATH-07",
    title: "Grade 7 Essential Mathematics",
    grade: 7,
    category: "Mathematics",
    description: "Algebraic expressions, linear equations, ratio, proportion, percentages, and geometric constructions.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Sunday 11:30 AM - 1:30 PM",
    enrolledStudentsCount: 47,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Algebraic Expressions", "Linear Equations", "Ratios & Rates", "Circles & Symmetry"]
  },
  {
    id: "sub-sci-8",
    code: "SCI-08",
    title: "Grade 8 Advanced Science",
    grade: 8,
    category: "Science",
    description: "Periodic classification, electric current, sound waves, ecosystem dynamics, heat transfer, and light reflection.",
    teacher: "Sir Nafees Mohamed & Science Demonstrators",
    schedule: "Every Saturday 2:00 PM - 4:00 PM",
    enrolledStudentsCount: 65,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Atomic Models", "Current Electricity", "Wave Motion", "Ecology & Food Webs"]
  },
  {
    id: "sub-math-8",
    code: "MATH-08",
    title: "Grade 8 Algebra & Geometry",
    grade: 8,
    category: "Mathematics",
    description: "Pythagoras theorem, simultaneous equations, area of circles, graphs, inequalities, and statistics.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Sunday 2:00 PM - 4:00 PM",
    enrolledStudentsCount: 62,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Pythagoras Theorem", "Linear Inequalities", "Simultaneous Equations", "Data Representation"]
  },
  {
    id: "sub-sci-9",
    code: "SCI-09",
    title: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    category: "Science",
    description: "Atomic structure, chemical bonding, Newton's laws of motion, work, power & energy, acids, bases, and optical ray diagrams.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Saturday 4:30 PM - 6:30 PM",
    enrolledStudentsCount: 84,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Newtonian Mechanics", "Chemical Bonding", "Acids, Bases & Salts", "Light & Reflection"]
  },
  {
    id: "sub-math-9",
    code: "MATH-09",
    title: "Grade 9 Higher Mathematics",
    grade: 9,
    category: "Mathematics",
    description: "Quadratic equations, trigonometry basics, matrices, probability, coordinate geometry, and cyclic quadrilaterals.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Sunday 4:30 PM - 6:30 PM",
    enrolledStudentsCount: 89,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Quadratic Factoring", "Trigonometric Ratios", "Coordinate Geometry", "Circle Theorems"]
  },
  {
    id: "sub-sci-10",
    code: "SCI-10",
    title: "Grade 10 O/L Master Science",
    grade: 10,
    category: "Science",
    description: "Comprehensive O/L preparation covering Organic Chemistry, Chemical Calculations (Mole concept), Electromagnetism, and Genetics.",
    teacher: "Sir Nafees Mohamed & Specialist Panel",
    schedule: "Every Wednesday 4:30 PM - 7:30 PM",
    enrolledStudentsCount: 112,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["The Mole & Stoichiometry", "Chemical Reactions & Heat", "Electromagnetism", "Genetics & Inheritance"]
  },
  {
    id: "sub-math-10",
    code: "MATH-10",
    title: "Grade 10 O/L Master Mathematics",
    grade: 10,
    category: "Mathematics",
    description: "Mastery of Logarithms, Vectors, Geometric Progressions, Mensuration, Quadratic Graphs, and O/L Past Paper Drills.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Thursday 4:30 PM - 7:30 PM",
    enrolledStudentsCount: 125,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Logarithms & Indices", "Quadratic Functions", "Mensuration (Cylinder/Sphere)", "Geometric Progressions"]
  },
  {
    id: "sub-sci-11",
    code: "SCI-11",
    title: "Grade 11 Advanced Science & O/L Final Revision",
    grade: 11,
    category: "Science",
    description: "Final O/L syllabus mastery, 10-year past paper marking schemes analysis, rapid chemistry revision, and model exam drills.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Friday 4:00 PM - 7:30 PM",
    enrolledStudentsCount: 140,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Current Electricity & Electronics", "Electrolysis & Metallurgy", "Refraction & Lenses", "Final O/L Model Papers"]
  },
  {
    id: "sub-math-11",
    code: "MATH-11",
    title: "Grade 11 Higher Pure & Applied Mathematics",
    grade: 11,
    category: "Mathematics",
    description: "Advanced Algebra, Trigonometric Identities, Heights & Distances, Circle Theorems, Probability Trees, and Target Papers.",
    teacher: "Sir Nafees Mohamed (Lead Lecturer)",
    schedule: "Every Saturday 6:30 PM - 9:30 PM",
    enrolledStudentsCount: 155,
    zoomMeetingId: "849 2039 1102",
    zoomPasscode: "NAFEES2026",
    medium: "English Medium",
    syllabusTopics: ["Trigonometric Heights & Distances", "Circle Theorems & Tangents", "Tree Diagrams & Probability", "O/L Target Mock Papers"]
  }
];

export const INITIAL_MATERIALS: MaterialItem[] = [];

export const INITIAL_QUIZZES: QuizItem[] = [];

export const INITIAL_PAYMENTS: PaymentItem[] = [];

export const INITIAL_MESSAGES: BroadcastMessage[] = [];

export interface AboutSirDetails {
  fullName: string;
  title: string;
  photoUrl: string;
  bio: string;
  qualifications: string[];
  experienceYears: number;
  email: string;
  phone: string;
  location: string;
  teachingPhilosophy: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  icon: string;
}

export interface SirArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedDate: string;
  readTime: string;
  imageUrl?: string;
  author: string;
}

export const INITIAL_ABOUT_SIR: AboutSirDetails = {
  fullName: "Sir Nafees Mohamed",
  title: "Founder & Lead Educator — Science & Mathematics Specialist",
  photoUrl: "/nafees-logo.jpg",
  bio: "Sir Nafees Mohamed is an esteemed Science and Mathematics educator with over 10 years of experience preparing secondary school students for academic triumph in G.C.E. O/L examinations. By combining deep conceptual clarity, rigorous problem-solving techniques, and modern digital learning tools, Sir Nafees has guided thousands of students to distinction grades.",
  qualifications: [
    "B.Sc. Special (Hons) in Physical Sciences",
    "Postgraduate Diploma in Education (PGDE)",
    "Senior G.C.E. O/L Science & Mathematics Curriculum Specialist",
    "Certified Digital Learning Innovator & STEM Educator"
  ],
  experienceYears: 10,
  email: "nfsmhdlms@gmail.com",
  phone: "+94 75 779 4423",
  location: "Kandy Road Tuition Complex / Islandwide Live Zoom Sessions",
  teachingPhilosophy: "True education is not mere rote learning; it is cultivating scientific reasoning and mathematical confidence. When concepts are unlocked step-by-step with patience and structure, every student has the potential to excel."
};

export const INITIAL_PORTFOLIOS: PortfolioItem[] = [
  {
    id: "port-1",
    title: "1,250+ O/L Distinctions",
    category: "Milestone",
    description: "Over 1,250 students guided to top distinction grades (A & B) in G.C.E. O/L Science and Mathematics.",
    year: "2016 - 2026",
    icon: "🏆"
  },
  {
    id: "port-2",
    title: "Comprehensive Digital Learning Platform",
    category: "Methodology",
    description: "Built a dedicated student LMS with structured PDF lesson notes, live Zoom class integration, automated quizzes, and verified fee tracking.",
    year: "2024",
    icon: "💻"
  },
  {
    id: "port-3",
    title: "Grades 6 to 11 Syllabus Coverage",
    category: "Curriculum",
    description: "Structured progressive learning paths for junior secondary students through O/L candidates across English and bilingual mediums.",
    year: "Ongoing",
    icon: "📚"
  },
  {
    id: "port-4",
    title: "Excellence in Pedagogy Recognition",
    category: "Achievement",
    description: "Recognized for innovative teaching methodologies in breaking down complex algebraic proofs and Newtonian physics for students.",
    year: "2023",
    icon: "🎖️"
  }
];

export const INITIAL_ARTICLES: SirArticle[] = [
  {
    id: "art-1",
    title: "Mastering O/L Mathematics: 5 Essential Strategies by Sir Nafees",
    excerpt: "Discover how breaking down quadratic equations, geometry theorems, and time-management strategies can transform your O/L maths result.",
    content: `Mathematics is often perceived as a daunting subject, but it is fundamentally a language of patterns and logic. Sir Nafees Mohamed shares five proven strategies that have helped hundreds of students convert their fear into distinctions:

1. **Deconstruct the Theory First**: Never attempt past paper questions before fully understanding the underlying theorem. Whether it's Pythagoras' Theorem or Quadratic Equations, internalize *why* the formula works.

2. **Daily Problem Solving Routine**: Dedicate at least 30 minutes daily to solving 3-5 multi-step questions. Consistency builds pattern recognition.

3. **Maintain an Error Logbook**: Whenever you get a question wrong during revision, write down the exact step where you made the miscalculation and re-solve it.

4. **Time Management in Paper II**: Practice structured 3-hour mock papers under exam conditions. Allocate specific time limits per section.

5. **Visual Diagrams in Geometry**: Always redraw geometry diagrams clearly with angle annotations. Seeing the shape clearly is half the solution.`,
    category: "Exam Guidance",
    publishedDate: "2026-08-15",
    readTime: "4 min read",
    author: "Sir Nafees Mohamed",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "art-2",
    title: "Why Grade 11 Science Revision Requires a Dual Approach",
    excerpt: "Blending conceptual theory revision with timed target papers is the secret to scoring A grades in O/L Science.",
    content: `As Grade 11 students prepare for their final Ordinary Level examinations, the key to top performance lies in balancing Physics, Chemistry, and Biology seamlessly.

In Sir Nafees's Grade 11 Advanced Revision Module, students undergo a dual-phase training:
- **Phase 1: Conceptual Reinforcement**: Revisiting core concepts in Electromagnetism, Chemical Reactions, and Human Body Physiology using structured visual summaries.
- **Phase 2: Target Paper Drills**: Analyzing past 10 years' scheme marking logic so students know exactly how examiners evaluate structured essay answers.

With dedicated weekly support and model exam papers, Grade 11 students enter their exams with complete readiness and confidence.`,
    category: "Science Insights",
    publishedDate: "2026-08-20",
    readTime: "5 min read",
    author: "Sir Nafees Mohamed",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
  }
];
