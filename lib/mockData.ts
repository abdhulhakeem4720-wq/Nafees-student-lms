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
}

export interface BroadcastMessage {
  id: string;
  targetGrade: string; // 'All' or '6', '7', etc.
  targetSubject: string; // 'All' or specific
  subjectLine: string;
  body: string;
  sentAt: string;
  recipientCount: number;
}

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: "sub-sci-6",
    code: "SCI-06",
    title: "Grade 6 Integrated Science",
    grade: 6,
    category: "Science",
    description: "Fundamentals of living things, matter, energy, states of matter, and simple machines.",
    teacher: "Dr. Anura Perera",
    schedule: "Every Saturday 9:00 AM - 11:00 AM",
    enrolledStudentsCount: 42
  },
  {
    id: "sub-math-6",
    code: "MATH-06",
    title: "Grade 6 Foundation Mathematics",
    grade: 6,
    category: "Mathematics",
    description: "Fractions, decimals, basic geometry, perimeter, and introduction to integers.",
    teacher: "Prof. K. Liyanage",
    schedule: "Every Sunday 9:00 AM - 11:00 AM",
    enrolledStudentsCount: 38
  },
  {
    id: "sub-sci-7",
    code: "SCI-07",
    title: "Grade 7 General Science",
    grade: 7,
    category: "Science",
    description: "Plant physiology, human body digestive system, forces, motion, and chemical reactions.",
    teacher: "Dr. Anura Perera",
    schedule: "Every Saturday 11:30 AM - 1:30 PM",
    enrolledStudentsCount: 51
  },
  {
    id: "sub-math-7",
    code: "MATH-07",
    title: "Grade 7 Essential Mathematics",
    grade: 7,
    category: "Mathematics",
    description: "Algebraic expressions, linear equations, ratio, proportion, and angles in polygons.",
    teacher: "Mrs. Nithya Sharma",
    schedule: "Every Sunday 11:30 AM - 1:30 PM",
    enrolledStudentsCount: 47
  },
  {
    id: "sub-sci-8",
    code: "SCI-08",
    title: "Grade 8 Advanced Science",
    grade: 8,
    category: "Science",
    description: "Elements & compounds, electric circuits, sound waves, ecosystem dynamics, and heat energy.",
    teacher: "Dr. S. Jayawardena",
    schedule: "Every Saturday 2:00 PM - 4:00 PM",
    enrolledStudentsCount: 65
  },
  {
    id: "sub-math-8",
    code: "MATH-08",
    title: "Grade 8 Algebra & Geometry",
    grade: 8,
    category: "Mathematics",
    description: "Pythagoras theorem, simultaneous equations, area of circles, graphs, and statistics.",
    teacher: "Prof. K. Liyanage",
    schedule: "Every Sunday 2:00 PM - 4:00 PM",
    enrolledStudentsCount: 62
  },
  {
    id: "sub-sci-9",
    code: "SCI-09",
    title: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    category: "Science",
    description: "Atomic structure, chemical bonding, Newton's laws of motion, work & power, optics.",
    teacher: "Dr. S. Jayawardena",
    schedule: "Every Saturday 4:30 PM - 6:30 PM",
    enrolledStudentsCount: 84
  },
  {
    id: "sub-math-9",
    code: "MATH-09",
    title: "Grade 9 Higher Mathematics",
    grade: 9,
    category: "Mathematics",
    description: "Quadratic equations, trigonometry, matrices, probability, and coordinate geometry.",
    teacher: "Mrs. Nithya Sharma",
    schedule: "Every Sunday 4:30 PM - 6:30 PM",
    enrolledStudentsCount: 89
  },
  {
    id: "sub-sci-10",
    code: "SCI-10",
    title: "Grade 10 O/L Master Science",
    grade: 10,
    category: "Science",
    description: "Comprehensive O/L preparation covering Organic Chemistry, Electromagnetism, and Genetics.",
    teacher: "Dr. Anura Perera & Team",
    schedule: "Every Wednesday 4:00 PM - 7:00 PM",
    enrolledStudentsCount: 112
  },
  {
    id: "sub-math-10",
    code: "MATH-10",
    title: "Grade 10 O/L Master Mathematics",
    grade: 10,
    category: "Mathematics",
    description: "Mastery of Logarithms, Vectors, Geometric Progression, Mensuration, and Past Paper Drills.",
    teacher: "Prof. K. Liyanage",
    schedule: "Every Thursday 4:00 PM - 7:00 PM",
    enrolledStudentsCount: 125
  }
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: "mat-1",
    title: "Grade 9 Physics: Motion & Velocity Complete Summary",
    subjectId: "sub-sci-9",
    subjectTitle: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    category: "Science",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "2.4 MB",
    downloads: 142,
    uploadedAt: "2026-08-15"
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
    uploadedAt: "2026-08-18"
  },
  {
    id: "mat-3",
    title: "Grade 9 Mathematics: Quadratic Equations Step-by-Step",
    subjectId: "sub-math-9",
    subjectTitle: "Grade 9 Higher Mathematics",
    grade: 9,
    category: "Mathematics",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "3.8 MB",
    downloads: 210,
    uploadedAt: "2026-08-10"
  },
  {
    id: "mat-4",
    title: "Grade 10 O/L Past Paper Revision Notes (Science)",
    subjectId: "sub-sci-10",
    subjectTitle: "Grade 10 O/L Master Science",
    grade: 10,
    category: "Science",
    type: "Worksheet",
    fileUrl: "#",
    fileSize: "5.2 MB",
    downloads: 340,
    uploadedAt: "2026-08-01"
  },
  {
    id: "mat-5",
    title: "Grade 8 Mathematics: Pythagoras Theorem Illustrated Guide",
    subjectId: "sub-math-8",
    subjectTitle: "Grade 8 Algebra & Geometry",
    grade: 8,
    category: "Mathematics",
    type: "PDF Note",
    fileUrl: "#",
    fileSize: "1.8 MB",
    downloads: 87,
    uploadedAt: "2026-08-12"
  }
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: "quiz-sci-9-1",
    title: "Grade 9 Science: Speed, Velocity & Acceleration Test",
    subjectTitle: "Grade 9 Core Physics & Chemistry",
    grade: 9,
    durationMinutes: 15,
    totalQuestions: 4,
    passingScore: 75,
    questions: [
      {
        id: "q1",
        question: "What is the SI unit of acceleration?",
        options: ["m/s", "m/s²", "km/h", "N/kg"],
        correctAnswer: 1,
        explanation: "Acceleration is defined as rate of change of velocity per second, measured in meters per second squared (m/s²)."
      },
      {
        id: "q2",
        question: "If a car accelerates from rest at 2 m/s² for 5 seconds, what is its final speed?",
        options: ["5 m/s", "7 m/s", "10 m/s", "25 m/s"],
        correctAnswer: 2,
        explanation: "Using v = u + at -> v = 0 + (2 * 5) = 10 m/s."
      },
      {
        id: "q3",
        question: "Which of the following is a vector quantity?",
        options: ["Distance", "Speed", "Displacement", "Mass"],
        correctAnswer: 2,
        explanation: "Displacement has both magnitude and direction, making it a vector quantity."
      },
      {
        id: "q4",
        question: "An object moving at a constant speed in a circular path has:",
        options: ["Zero acceleration", "Constant velocity", "Changing velocity", "Zero net force"],
        correctAnswer: 2,
        explanation: "Since direction changes continuously in a circle, velocity changes even if speed is constant."
      }
    ]
  },
  {
    id: "quiz-math-9-1",
    title: "Grade 9 Mathematics: Quadratic Equations Mastery Quiz",
    subjectTitle: "Grade 9 Higher Mathematics",
    grade: 9,
    durationMinutes: 20,
    totalQuestions: 4,
    passingScore: 75,
    questions: [
      {
        id: "mq1",
        question: "What are the roots of the equation x² - 5x + 6 = 0?",
        options: ["x = 1, x = 6", "x = 2, x = 3", "x = -2, x = -3", "x = -1, x = 5"],
        correctAnswer: 1,
        explanation: "Factoring (x - 2)(x - 3) = 0 gives roots x = 2 and x = 3."
      },
      {
        id: "mq2",
        question: "In the quadratic formula x = (-b ± √(b² - 4ac)) / (2a), what is (b² - 4ac) called?",
        options: ["Denominator", "Discriminant", "Gradient", "Polynomial"],
        correctAnswer: 1,
        explanation: "The discriminant determines the nature of the roots of a quadratic equation."
      },
      {
        id: "mq3",
        question: "If the discriminant b² - 4ac > 0, the equation has:",
        options: ["No real roots", "Two equal real roots", "Two distinct real roots", "Infinite roots"],
        correctAnswer: 2,
        explanation: "A positive discriminant yields two distinct real solutions."
      },
      {
        id: "mq4",
        question: "Expand the expression (2x + 3)(x - 4):",
        options: ["2x² - 5x - 12", "2x² + 5x - 12", "2x² - 12", "2x² - 8x + 3"],
        correctAnswer: 0,
        explanation: "Foil method: 2x*x + 2x*(-4) + 3*x + 3*(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12."
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
    notes: "Verified bank transfer confirmation code #88219"
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
    submittedAt: "2026-08-19 02:15 PM"
  }
];

export const INITIAL_MESSAGES: BroadcastMessage[] = [
  {
    id: "msg-1",
    targetGrade: "9",
    targetSubject: "Grade 9 Core Physics & Chemistry",
    subjectLine: "Upcoming Live Lab Demonstration & Quiz Reminder",
    body: "Dear Grade 9 Students, please be reminded that our Physics lab review is scheduled for this Saturday at 4:30 PM. Download the Motion & Velocity notes before attending.",
    sentAt: "2026-08-18 04:00 PM",
    recipientCount: 84
  }
];
