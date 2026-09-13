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

export const INITIAL_STUDENTS: UserProfile[] = [
  {
    id: "stu-1",
    fullName: "Kasun Fernando",
    email: "kasun@study.edu",
    phone: "0771234567",
    grade: 9,
    role: "student",
    registeredSubjects: ["sub-sci-9"],
    enrolledSubjectTitle: "Grade 9 Core Physics & Chemistry",
    status: "Active",
    school: "Royal College, Colombo",
    medium: "English",
    studentIndex: "SWN-2026-G09-101"
  },
  {
    id: "stu-2",
    fullName: "Nimali Silva",
    email: "student@study.edu",
    phone: "0719876543",
    grade: 9,
    role: "student",
    registeredSubjects: ["sub-math-9"],
    enrolledSubjectTitle: "Grade 9 Higher Mathematics",
    status: "Active",
    school: "Visakha Vidyalaya, Colombo",
    medium: "English",
    studentIndex: "SWN-2026-G09-082"
  },
  {
    id: "stu-3",
    fullName: "Dinesh De Silva",
    email: "dinesh@study.edu",
    phone: "0751112223",
    grade: 10,
    role: "student",
    registeredSubjects: ["sub-sci-10"],
    enrolledSubjectTitle: "Grade 10 O/L Master Science",
    status: "Active",
    school: "Ananda College, Colombo",
    medium: "English",
    studentIndex: "SWN-2026-G10-214"
  },
  {
    id: "stu-4",
    fullName: "Ruwanthi Perera",
    email: "ruwanthi@study.edu",
    phone: "0724445556",
    grade: 8,
    role: "student",
    registeredSubjects: ["sub-math-8"],
    enrolledSubjectTitle: "Grade 8 Algebra & Geometry",
    status: "Active",
    school: "Devi Balika Vidyalaya, Colombo",
    medium: "English",
    studentIndex: "SWN-2026-G08-305"
  },
  {
    id: "stu-5",
    fullName: "Amal Jayasinghe",
    email: "amal@study.edu",
    phone: "0789990001",
    grade: 6,
    role: "student",
    registeredSubjects: ["sub-sci-6"],
    enrolledSubjectTitle: "Grade 6 Integrated Science",
    status: "Active",
    school: "Dharmaraja College, Kandy",
    medium: "English",
    studentIndex: "SWN-2026-G06-412"
  }
];

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
    bankName: "Commercial Bank of Ceylon",
    accountName: "Study With Nafees Academy",
    accountNumber: "8004921045",
    branch: "City Branch (Branch Code: 021)",
    notes: "Mention Student Name & Grade as the transfer reference (e.g., Nimali G9)"
  },
  {
    bankName: "Bank of Ceylon (BOC)",
    accountName: "Nafees Mohamed",
    accountNumber: "0092384102",
    branch: "Central Branch",
    notes: "Cash Deposit Machines (CDM) & Online Banking accepted"
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

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: "mat-1",
    title: "Grade 9 Physics: Motion, Speed & Velocity Complete Theory & Summary",
    subjectId: "sub-sci-9",
    subjectTitle: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    category: "Science",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "2.4 MB",
    downloads: 142,
    uploadedAt: "2026-08-15",
    unitNumber: 3,
    term: 1,
    summary: "Complete O/L revision guide on rectilinear motion, distance vs displacement, speed vs velocity, acceleration, and interpreting distance-time and velocity-time graphs.",
    contentSections: [
      {
        heading: "1. Key Definitions & Concepts",
        body: [
          "Distance (s): The total length of the path travelled by an object irrespective of direction. It is a scalar quantity measured in metres (m).",
          "Displacement (s): The shortest straight-line distance from the starting point to the end point in a specified direction. It is a vector quantity.",
          "Speed (v): The rate of distance travelled per unit time (Speed = Distance / Time). Scalar, SI unit: m/s.",
          "Velocity (v): The rate of displacement per unit time in a given direction (Velocity = Displacement / Time). Vector, SI unit: m/s.",
          "Acceleration (a): The rate of change of velocity with time (a = (v - u) / t). SI unit: m/s²."
        ],
        formulasOrPoints: [
          "Speed = Total Distance / Total Time",
          "Acceleration (a) = (v - u) / t",
          "v = u + at",
          "s = ut + ½at²",
          "v² = u² + 2as"
        ]
      },
      {
        heading: "2. Motion Graphs Analysis (Crucial for O/L)",
        body: [
          "Distance-Time Graph: The gradient (slope) of a distance-time graph represents the SPEED of the object.",
          "Velocity-Time Graph: The gradient represents ACCELERATION. The AREA under a velocity-time graph equals the TOTAL DISPLACEMENT travelled."
        ],
        exampleProblem: {
          question: "A train starts from rest and reaches a speed of 20 m/s in 10 seconds under uniform acceleration. Calculate (a) the acceleration, and (b) the distance covered.",
          solution: "Given: u = 0 m/s, v = 20 m/s, t = 10 s.\n(a) a = (v - u) / t = (20 - 0) / 10 = 2.0 m/s².\n(b) s = ut + ½at² = (0)(10) + ½(2.0)(10)² = 100 m."
        }
      }
    ]
  },
  {
    id: "mat-2",
    title: "Grade 9 Chemistry: Periodic Table & Chemical Bonding Guide",
    subjectId: "sub-sci-9",
    subjectTitle: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    category: "Science",
    type: "Formula Sheet",
    fileUrl: "#",
    fileSize: "1.1 MB",
    downloads: 98,
    uploadedAt: "2026-08-18",
    unitNumber: 5,
    term: 2,
    summary: "Electronic configurations of the first 20 elements, Lewis electron dot structures, ionic bonding vs covalent bonding characteristics, and valency rules.",
    contentSections: [
      {
        heading: "1. Electronic Configuration & The Octet Rule",
        body: [
          "Electrons orbit the nucleus in energy levels (shells): 1st shell (max 2), 2nd shell (max 8), 3rd shell (max 8 for first 20 elements).",
          "Valence Electrons: Electrons present in the outermost energy level dictate chemical reactivity.",
          "Octet Rule: Atoms gain, lose, or share electrons to attain a stable electron configuration similar to noble gases (8 valence electrons)."
        ],
        formulasOrPoints: [
          "Sodium (Na, Z=11): 2, 8, 1 -> Loses 1 electron to form Na⁺ (Cation)",
          "Chlorine (Cl, Z=17): 2, 8, 7 -> Gains 1 electron to form Cl⁻ (Anion)",
          "Ionic Bond: Formed by electrostatic attraction between oppositely charged ions (Metal + Non-metal)",
          "Covalent Bond: Formed by mutual sharing of electron pairs between non-metal atoms (e.g., H₂O, CH₄, CO₂)"
        ]
      }
    ]
  },
  {
    id: "mat-3",
    title: "Grade 9 Mathematics: Quadratic Equations Step-by-Step Mastery",
    subjectId: "sub-math-9",
    subjectTitle: "Grade 9 Higher Mathematics",
    grade: 9,
    category: "Mathematics",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "3.8 MB",
    downloads: 210,
    uploadedAt: "2026-08-10",
    unitNumber: 8,
    term: 2,
    summary: "Comprehensive guide to solving quadratic equations by factoring, completing the square, and using the quadratic formula with exam model questions.",
    contentSections: [
      {
        heading: "1. Standard Form & Methods of Solving",
        body: [
          "Standard Form: ax² + bx + c = 0, where a ≠ 0.",
          "Method 1: Factorization — Find two integers p and q such that p + q = b and p * q = a * c.",
          "Method 2: Quadratic Formula — x = (-b ± √(b² - 4ac)) / (2a)."
        ],
        formulasOrPoints: [
          "Discriminant: Δ = b² - 4ac",
          "If Δ > 0: Two distinct real roots",
          "If Δ = 0: Two equal real roots (one repeated root)",
          "If Δ < 0: No real roots"
        ],
        exampleProblem: {
          question: "Solve 2x² - 7x + 3 = 0 using the factorization method.",
          solution: "a = 2, b = -7, c = 3. We need two numbers with product 6 and sum -7: -6 and -1.\nRewrite: 2x² - 6x - x + 3 = 0\n2x(x - 3) - 1(x - 3) = 0\n(2x - 1)(x - 3) = 0\nHence: x = 1/2 or x = 3."
        }
      }
    ]
  },
  {
    id: "mat-4",
    title: "Grade 10 Science: Electric Circuits & Ohm's Law Practical Guide",
    subjectId: "sub-sci-10",
    subjectTitle: "Grade 10 O/L Master Science",
    grade: 10,
    category: "Science",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "5.2 MB",
    downloads: 340,
    uploadedAt: "2026-08-01",
    unitNumber: 12,
    term: 3,
    summary: "Ohm's law verification, series and parallel resistor combinations, potential dividers, electrical energy, power calculations, and household safety.",
    contentSections: [
      {
        heading: "1. Ohm's Law & Circuit Analysis",
        body: [
          "Ohm's Law: At a constant temperature, current (I) through a conductor is directly proportional to potential difference (V) across it: V = IR.",
          "Series Resistors: Total resistance R_total = R₁ + R₂ + R₃ (Current is equal through each resistor).",
          "Parallel Resistors: 1 / R_total = 1/R₁ + 1/R₂ + 1/R₃ (Potential difference is equal across each branch)."
        ],
        formulasOrPoints: [
          "V = I × R",
          "Electrical Power: P = VI = I²R = V² / R",
          "Electrical Energy: E = P × t = VIt (Joules or kWh)"
        ]
      }
    ]
  },
  {
    id: "mat-5",
    title: "Grade 10 Mathematics: Logarithms & Exponential Forms Revision",
    subjectId: "sub-math-10",
    subjectTitle: "Grade 10 O/L Master Mathematics",
    grade: 10,
    category: "Mathematics",
    type: "Worksheet",
    fileUrl: "#",
    fileSize: "2.1 MB",
    downloads: 188,
    uploadedAt: "2026-08-11",
    unitNumber: 4,
    term: 1,
    summary: "The fundamental laws of logarithms, conversion between index form and logarithmic form, log tables usage, and multi-step simplification exercises.",
    contentSections: [
      {
        heading: "1. Laws of Logarithms",
        body: [
          "Definition: If a^x = y (where a > 0, a ≠ 1), then log_a(y) = x.",
          "Product Rule: log_a(xy) = log_a(x) + log_a(y)",
          "Quotient Rule: log_a(x / y) = log_a(x) - log_a(y)",
          "Power Rule: log_a(x^k) = k × log_a(x)"
        ]
      }
    ]
  },
  {
    id: "mat-6",
    title: "Grade 11 Science & Mathematics: O/L Model Paper 01 & Marking Scheme",
    subjectId: "sub-sci-11",
    subjectTitle: "Grade 11 Advanced Science & O/L Final Revision",
    grade: 11,
    category: "Science",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "4.5 MB",
    downloads: 412,
    uploadedAt: "2026-08-20",
    unitNumber: 20,
    term: 3,
    summary: "Full syllabus O/L model exam paper with question-by-question examiner marking criteria, common student pitfalls, and time management allocation.",
    contentSections: [
      {
        heading: "1. O/L Examination Guidelines by Sir Nafees",
        body: [
          "Paper I (MCQs): 40 questions in 60 minutes. Allocate roughly 1 minute 20 seconds per question.",
          "Paper II (Structured & Essay): Part A (Structured) has 4 compulsory questions. Answer clearly with units in final numbers.",
          "Common Pitfalls: Skipping units (e.g. m/s², N, J) costs 1 mark each time. In chemical equations, always check state symbols if specified."
        ]
      }
    ]
  }
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: "quiz-sci-9-1",
    title: "Grade 9 Science: Speed, Velocity & Acceleration Mastery Exam",
    subjectTitle: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    durationMinutes: 15,
    totalQuestions: 4,
    passingScore: 75,
    questions: [
      {
        id: "q1",
        question: "What is the standard SI unit of acceleration?",
        options: ["m/s", "m/s²", "km/h", "N/kg"],
        correctAnswer: 1,
        explanation: "Acceleration is defined as rate of change of velocity per second, measured in meters per second squared (m/s²)."
      },
      {
        id: "q2",
        question: "If a vehicle accelerates uniformly from rest at 2 m/s² for 5 seconds, what is its final velocity?",
        options: ["5 m/s", "7 m/s", "10 m/s", "25 m/s"],
        correctAnswer: 2,
        explanation: "Using v = u + at -> v = 0 + (2 * 5) = 10 m/s."
      },
      {
        id: "q3",
        question: "Which of the following physical quantities is a vector?",
        options: ["Distance", "Speed", "Displacement", "Mass"],
        correctAnswer: 2,
        explanation: "Displacement has both magnitude and a defined direction in space, making it a vector quantity."
      },
      {
        id: "q4",
        question: "An object moving at a constant speed along a circular track has:",
        options: ["Zero acceleration", "Constant velocity", "Continuously changing velocity", "Zero resultant force"],
        correctAnswer: 2,
        explanation: "Since the direction of motion continuously changes on a curved path, velocity changes, producing centripetal acceleration."
      }
    ]
  },
  {
    id: "quiz-math-9-1",
    title: "Grade 9 Mathematics: Quadratic Equations & Factoring Quiz",
    subjectTitle: "Grade 9 Higher Mathematics",
    grade: 9,
    durationMinutes: 20,
    totalQuestions: 4,
    passingScore: 75,
    questions: [
      {
        id: "mq1",
        question: "What are the roots of the quadratic equation x² - 5x + 6 = 0?",
        options: ["x = 1, x = 6", "x = 2, x = 3", "x = -2, x = -3", "x = -1, x = 5"],
        correctAnswer: 1,
        explanation: "Factoring gives (x - 2)(x - 3) = 0, so the roots are x = 2 and x = 3."
      },
      {
        id: "mq2",
        question: "In the quadratic formula x = (-b ± √(b² - 4ac)) / (2a), what is the term (b² - 4ac) called?",
        options: ["Denominator", "Discriminant", "Gradient", "Coefficient"],
        correctAnswer: 1,
        explanation: "The discriminant (Δ = b² - 4ac) determines whether roots are real, equal, or complex."
      },
      {
        id: "mq3",
        question: "If the discriminant b² - 4ac > 0, the equation has:",
        options: ["No real roots", "Two equal real roots", "Two distinct real roots", "Infinite roots"],
        correctAnswer: 2,
        explanation: "A strictly positive discriminant yields two distinct real solutions on the Cartesian plane."
      },
      {
        id: "mq4",
        question: "Expand and simplify the algebraic expression (2x + 3)(x - 4):",
        options: ["2x² - 5x - 12", "2x² + 5x - 12", "2x² - 12", "2x² - 8x + 3"],
        correctAnswer: 0,
        explanation: "Using FOIL expansion: 2x(x) + 2x(-4) + 3(x) + 3(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12."
      }
    ]
  },
  {
    id: "quiz-sci-10-1",
    title: "Grade 10 Science: Chemical Reactions & Electric Circuits Test",
    subjectTitle: "Grade 10 O/L Master Science",
    grade: 10,
    durationMinutes: 20,
    totalQuestions: 4,
    passingScore: 75,
    questions: [
      {
        id: "q10_1",
        question: "What is the total resistance of two 6 Ω resistors connected in parallel?",
        options: ["12 Ω", "6 Ω", "3 Ω", "1.5 Ω"],
        correctAnswer: 2,
        explanation: "1/R = 1/6 + 1/6 = 2/6 = 1/3 => R = 3 Ω."
      },
      {
        id: "q10_2",
        question: "Which gas is evolved when dilute hydrochloric acid reacts with calcium carbonate?",
        options: ["Hydrogen (H₂)", "Oxygen (O₂)", "Carbon dioxide (CO₂)", "Chlorine (Cl₂)"],
        correctAnswer: 2,
        explanation: "CaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂. Carbon dioxide turns lime water milky."
      },
      {
        id: "q10_3",
        question: "What is the oxidation number of sulfur in sulfuric acid (H₂SO₄)?",
        options: ["+2", "+4", "+6", "-2"],
        correctAnswer: 2,
        explanation: "2(+1) + S + 4(-2) = 0 => 2 + S - 8 = 0 => S = +6."
      },
      {
        id: "q10_4",
        question: "According to Fleming's Left Hand Rule, the middle finger indicates the direction of:",
        options: ["Magnetic Field", "Current", "Force/Thrust", "Motion"],
        correctAnswer: 1,
        explanation: "Thumb = Force/Motion, Forefinger = Magnetic Field, Middle finger = Electric Current (FBI)."
      }
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-101",
    studentId: "stu-901",
    studentName: "Kasun Fernando",
    studentEmail: "kasun@study.edu",
    grade: 9,
    subjectTitle: "Grade 9 Core Physics & Chemistry",
    amount: 3500,
    slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    status: "Approved",
    submittedAt: "2026-08-10 10:30 AM",
    notes: "Verified bank transfer confirmation code #88219 (Commercial Bank)",
    month: "August 2026",
    referenceNo: "CB-88219",
    bankName: "Commercial Bank"
  },
  {
    id: "pay-102",
    studentId: "demo-student-1",
    studentName: "Nimali Silva",
    studentEmail: "student@study.edu",
    grade: 9,
    subjectTitle: "Grade 9 Higher Mathematics",
    amount: 3500,
    slipUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
    status: "Pending",
    submittedAt: "2026-08-19 02:15 PM",
    month: "August 2026",
    referenceNo: "BOC-44109",
    bankName: "Bank of Ceylon"
  }
];

export const INITIAL_MESSAGES: BroadcastMessage[] = [
  {
    id: "msg-1",
    targetGrade: "All",
    targetSubject: "All",
    subjectLine: "📢 March 2026 Term Test Revision Schedule & Zoom Link",
    body: "Dear Students & Parents, the special O/L term assessment revision sessions will be conducted via Zoom this weekend. Please download the printed model tute from your Study Materials section prior to attending. Passcode: NAFEES2026.",
    sentAt: "2026-08-18 04:00 PM",
    recipientCount: 380,
    priority: "urgent"
  },
  {
    id: "msg-2",
    targetGrade: "10",
    targetSubject: "Grade 10 O/L Master Science",
    subjectLine: "Grade 10: Mole Concept & Chemical Calculations Tute Ready",
    body: "New structured notes for Unit 11 have been uploaded to your dashboard. Make sure to complete the review questions before Wednesday's live class.",
    sentAt: "2026-08-20 11:30 AM",
    recipientCount: 112,
    priority: "normal"
  }
];

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
