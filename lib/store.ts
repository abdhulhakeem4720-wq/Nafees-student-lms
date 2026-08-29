import {
  SubjectItem,
  MaterialItem,
  QuizItem,
  PaymentItem,
  UserProfile,
  BroadcastMessage,
  INITIAL_SUBJECTS,
  INITIAL_MATERIALS,
  INITIAL_QUIZZES,
  INITIAL_PAYMENTS,
  INITIAL_MESSAGES
} from "./mockData";

export const MOCK_STUDENT_USER: UserProfile = {
  id: "demo-student-1",
  email: "student@study.edu",
  fullName: "Nimali Silva",
  phone: "0771234567",
  grade: 9,
  role: "student",
  registeredSubjects: ["sub-sci-9", "sub-math-9"],
  password: "Student@123"
};

export const MOCK_ADMIN_USER: UserProfile = {
  id: "admin-1",
  email: "nfsmhdlms@gmail.com",
  fullName: "Nafees Mohamed (Academy Director)",
  phone: "0719876543",
  grade: 10,
  role: "admin",
  registeredSubjects: [],
  password: "Nfsmhd@000"
};

const STORAGE_KEYS = {
  SESSION: "study_hub_session",
  SUBJECTS: "study_hub_subjects",
  MATERIALS: "study_hub_materials",
  QUIZZES: "study_hub_quizzes",
  PAYMENTS: "study_hub_payments",
  MESSAGES: "study_hub_messages",
  USERS: "study_hub_users"
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Global Store Helper
export const StudyStore = {
  // Auth Session
  getCurrentUser(): UserProfile | null {
    return getStorageItem<UserProfile | null>(STORAGE_KEYS.SESSION, null);
  },

  setCurrentUser(user: UserProfile | null): void {
    setStorageItem(STORAGE_KEYS.SESSION, user);
    if (typeof document !== "undefined") {
      if (user) {
        document.cookie = `study_hub_session=${user.role}; path=/; max-age=86400`;
      } else {
        document.cookie = `study_hub_session=; path=/; max-age=0`;
      }
    }
  },

  loginDemo(role: "student" | "admin"): UserProfile {
    const user = role === "admin" ? MOCK_ADMIN_USER : MOCK_STUDENT_USER;
    this.setCurrentUser(user);
    return user;
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  // Registered Users
  getRegisteredUsers(): UserProfile[] {
    return getStorageItem<UserProfile[]>(STORAGE_KEYS.USERS, []);
  },

  registerStudent(user: Omit<UserProfile, "id"> & { password: string }): UserProfile {
    const users = this.getRegisteredUsers();
    const exists = users.find((u) => u.email === user.email);
    if (exists) {
      throw new Error("Email already registered");
    }
    const newUser = { ...user, id: `stu-${Date.now()}` };
    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  validateAdminCredentials(email: string, password: string): UserProfile | null {
    const adminEmail = "nfsmhdlms@gmail.com";
    const adminPassword = "Nfsmhd@000";

    if (email.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      return {
        id: "admin-1",
        email: adminEmail,
        fullName: "Nafees Mohamed (Academy Director)",
        phone: "0710000000",
        grade: 10,
        role: "admin",
        registeredSubjects: [],
        password: adminPassword
      };
    }
    return null;
  },

  validateStudentCredentials(email: string, password: string): UserProfile | null {
    const adminEmail = "nfsmhdlms@gmail.com";
    // Block admin email from logging in via student login
    if (email.trim().toLowerCase() === adminEmail.toLowerCase()) {
      return null;
    }

    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password);
    return user || null;
  },

  validateCredentials(email: string, password: string): UserProfile | null {
    const admin = this.validateAdminCredentials(email, password);
    if (admin) return admin;
    return this.validateStudentCredentials(email, password);
  },

  isStrongPassword(password: string): boolean {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    return true;
  },

  // Subjects
  getSubjects(): SubjectItem[] {
    return getStorageItem<SubjectItem[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },

  toggleSubjectRegistration(subjectId: string): { user: UserProfile | null; error?: string } {
    const user = this.getCurrentUser();
    if (!user) return { user: null, error: "Not logged in" };

    const subjects = this.getSubjects();
    const targetSub = subjects.find((s) => s.id === subjectId);

    // STRICT GRADE ENFORCEMENT: Block students from registering for another grade's subject
    if (targetSub && user.role === "student" && targetSub.grade !== user.grade) {
      return {
        user,
        error: `Grade Mismatch: You are registered as a Grade ${user.grade} student. You cannot join Grade ${targetSub.grade} courses.`
      };
    }

    const registered = new Set(user.registeredSubjects);
    if (registered.has(subjectId)) {
      registered.delete(subjectId);
    } else {
      registered.add(subjectId);
    }

    const updatedUser: UserProfile = {
      ...user,
      registeredSubjects: Array.from(registered)
    };

    this.setCurrentUser(updatedUser);
    return { user: updatedUser };
  },

  // Materials
  getMaterials(): MaterialItem[] {
    return getStorageItem<MaterialItem[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  },

  addMaterial(material: Omit<MaterialItem, "id" | "downloads" | "uploadedAt">): MaterialItem {
    const list = this.getMaterials();
    const newMat: MaterialItem = {
      ...material,
      id: `mat-${Date.now()}`,
      downloads: 0,
      uploadedAt: new Date().toISOString().split("T")[0]
    };
    setStorageItem(STORAGE_KEYS.MATERIALS, [newMat, ...list]);
    return newMat;
  },

  deleteMaterial(id: string): void {
    const list = this.getMaterials().filter((m) => m.id !== id);
    setStorageItem(STORAGE_KEYS.MATERIALS, list);
  },

  incrementMaterialDownload(id: string): void {
    const list = this.getMaterials().map((m) =>
      m.id === id ? { ...m, downloads: m.downloads + 1 } : m
    );
    setStorageItem(STORAGE_KEYS.MATERIALS, list);
  },

  // Quizzes
  getQuizzes(): QuizItem[] {
    return getStorageItem<QuizItem[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  },

  addQuiz(quiz: Omit<QuizItem, "id">): QuizItem {
    const list = this.getQuizzes();
    const newQuiz: QuizItem = {
      ...quiz,
      id: `quiz-${Date.now()}`
    };
    setStorageItem(STORAGE_KEYS.QUIZZES, [newQuiz, ...list]);
    return newQuiz;
  },

  deleteQuiz(id: string): void {
    const list = this.getQuizzes().filter((q) => q.id !== id);
    setStorageItem(STORAGE_KEYS.QUIZZES, list);
  },

  // Payments
  getPayments(): PaymentItem[] {
    return getStorageItem<PaymentItem[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  addPayment(payment: Omit<PaymentItem, "id" | "submittedAt" | "status">): PaymentItem {
    const list = this.getPayments();
    const newPayment: PaymentItem = {
      ...payment,
      id: `pay-${Date.now()}`,
      status: "Pending",
      submittedAt: new Date().toLocaleString()
    };
    setStorageItem(STORAGE_KEYS.PAYMENTS, [newPayment, ...list]);
    return newPayment;
  },

  updatePaymentStatus(id: string, status: "Approved" | "Rejected", notes?: string): void {
    const list = this.getPayments().map((p) =>
      p.id === id ? { ...p, status, notes: notes || p.notes } : p
    );
    setStorageItem(STORAGE_KEYS.PAYMENTS, list);
  },

  // Messages
  getMessages(): BroadcastMessage[] {
    return getStorageItem<BroadcastMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  sendBroadcastMessage(msg: Omit<BroadcastMessage, "id" | "sentAt">): BroadcastMessage {
    const list = this.getMessages();
    const newMsg: BroadcastMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toLocaleString()
    };
    setStorageItem(STORAGE_KEYS.MESSAGES, [newMsg, ...list]);
    return newMsg;
  }
};
