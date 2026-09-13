import {
  SubjectItem,
  MaterialItem,
  QuizItem,
  PaymentItem,
  UserProfile,
  BroadcastMessage,
  AboutSirDetails,
  PortfolioItem,
  SirArticle,
  INITIAL_SUBJECTS,
  INITIAL_MATERIALS,
  INITIAL_QUIZZES,
  INITIAL_PAYMENTS,
  INITIAL_MESSAGES,
  INITIAL_ABOUT_SIR,
  INITIAL_PORTFOLIOS,
  INITIAL_ARTICLES,
  INITIAL_STUDENTS
} from "./mockData";

export const MOCK_STUDENT_USER: UserProfile = {
  id: "demo-student-1",
  email: "student@study.edu",
  fullName: "Nimali Silva",
  phone: "0771234567",
  grade: 9,
  role: "student",
  registeredSubjects: ["sub-sci-9", "sub-math-9"],
  password: "Student@123",
  school: "Visakha Vidyalaya, Colombo",
  medium: "English",
  parentPhone: "0712345678",
  studentIndex: "SWN-2026-G09-082"
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

export const STORAGE_KEYS = {
  SESSION: "study_hub_session",
  SUBJECTS: "study_hub_subjects",
  MATERIALS: "study_hub_materials",
  QUIZZES: "study_hub_quizzes",
  PAYMENTS: "study_hub_payments",
  MESSAGES: "study_hub_messages",
  USERS: "study_hub_users",
  ABOUT_DETAILS: "study_hub_about_details",
  PORTFOLIOS: "study_hub_portfolios",
  ARTICLES: "study_hub_articles"
};

// Clean handover reset: wipes all old test/demo data on client browser load
const HANDOVER_CLEAN_KEY = "study_hub_clean_handover_v2";
if (typeof window !== "undefined") {
  try {
    if (!localStorage.getItem(HANDOVER_CLEAN_KEY)) {
      localStorage.removeItem(STORAGE_KEYS.MATERIALS);
      localStorage.removeItem(STORAGE_KEYS.QUIZZES);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.setItem(HANDOVER_CLEAN_KEY, "true");
    }
  } catch {}
}

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

async function getSupabase() {
  if (typeof window === "undefined") return null;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    return createClient();
  } catch {
    return null;
  }
}

async function syncMaterialsToSupabase(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const materials = getStorageItem<MaterialItem[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materials })
    });
  } catch (err) {
    console.warn("Failed to sync materials to Supabase:", err);
  }
}

async function refreshMaterialsFromSupabase(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/materials");
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.materials) && data.materials.length > 0) {
        const local = getStorageItem<MaterialItem[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
        const map = new Map<string, MaterialItem>();

        // Cloud materials are authoritative
        data.materials.forEach((m: MaterialItem) => {
          map.set(m.title.toLowerCase().trim(), m);
        });

        // Retain any local draft items not yet synced
        local.forEach((m: MaterialItem) => {
          const key = m.title.toLowerCase().trim();
          if (!map.has(key)) {
            map.set(key, m);
          }
        });

        const merged = Array.from(map.values());
        setStorageItem(STORAGE_KEYS.MATERIALS, merged);
      }
    }
  } catch (err) {
    console.warn("Failed to refresh materials from Supabase:", err);
  }
}

async function syncPaymentsToSupabase(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const payments = getStorageItem<PaymentItem[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payments })
    });
  } catch (err) {
    console.warn("Failed to sync payments to Supabase:", err);
  }
}

async function refreshPaymentsFromSupabase(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/payments");
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.payments) && data.payments.length > 0) {
        const local = getStorageItem<PaymentItem[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
        const map = new Map<string, PaymentItem>();

        // Cloud payments
        data.payments.forEach((p: PaymentItem) => {
          map.set(p.id, p);
        });

        // Local payments not yet in cloud
        local.forEach((p: PaymentItem) => {
          if (!map.has(p.id)) {
            map.set(p.id, p);
          }
        });

        const merged = Array.from(map.values());
        setStorageItem(STORAGE_KEYS.PAYMENTS, merged);
      }
    }
  } catch (err) {
    console.warn("Failed to refresh payments from Supabase:", err);
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
    const cached = getStorageItem<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_STUDENTS);
    if (!cached || cached.length === 0) {
      setStorageItem(STORAGE_KEYS.USERS, INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    return cached;
  },

  registerStudent(user: Omit<UserProfile, "id"> & { password?: string }): UserProfile {
    const users = this.getRegisteredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) {
      throw new Error("Email already registered");
    }
    const gradeFormatted = String(user.grade || 9).padStart(2, "0");
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const studentIndex = user.studentIndex || `SWN-2026-G${gradeFormatted}-${randomSeq}`;

    const newUser: UserProfile = {
      ...user,
      id: `stu-${Date.now()}`,
      studentIndex,
      status: user.status || "Active"
    };
    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  addStudentByAdmin(student: Omit<UserProfile, "id">): UserProfile {
    const users = this.getRegisteredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === student.email.toLowerCase());
    if (exists) {
      throw new Error("A student with this email address already exists.");
    }
    const gradeFormatted = String(student.grade || 9).padStart(2, "0");
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const studentIndex = student.studentIndex || `SWN-2026-G${gradeFormatted}-${randomSeq}`;

    const newStudent: UserProfile = {
      ...student,
      id: `stu-${Date.now()}`,
      studentIndex,
      status: student.status || "Active",
      role: "student"
    };
    const updated = [newStudent, ...users];
    setStorageItem(STORAGE_KEYS.USERS, updated);
    return newStudent;
  },

  updateStudent(id: string, updatedData: Partial<UserProfile>): UserProfile[] {
    const users = this.getRegisteredUsers();
    const updated = users.map((stu) => {
      if (stu.id === id) {
        return {
          ...stu,
          ...updatedData
        };
      }
      return stu;
    });
    setStorageItem(STORAGE_KEYS.USERS, updated);

    // If active session belongs to this student, sync session too
    const currentSession = this.getCurrentUser();
    if (currentSession && currentSession.id === id) {
      this.setCurrentUser({ ...currentSession, ...updatedData });
    }

    return updated;
  },

  deleteStudent(id: string): UserProfile[] {
    const users = this.getRegisteredUsers();
    const updated = users.filter((stu) => stu.id !== id);
    setStorageItem(STORAGE_KEYS.USERS, updated);

    // If active session belongs to this student, log them out
    const currentSession = this.getCurrentUser();
    if (currentSession && currentSession.id === id) {
      this.setCurrentUser(null);
    }

    return updated;
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
    const cached = getStorageItem<SubjectItem[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    const initialMap = new Map(INITIAL_SUBJECTS.map((s) => [s.id, s]));
    const merged = cached.map((s) => {
      const init = initialMap.get(s.id);
      return init ? { ...init, enrolledStudentsCount: s.enrolledStudentsCount || init.enrolledStudentsCount } : s;
    });
    const cachedIds = new Set(cached.map((s) => s.id));
    for (const init of INITIAL_SUBJECTS) {
      if (!cachedIds.has(init.id)) merged.push(init);
    }
    return merged;
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
    const cached = getStorageItem<MaterialItem[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    const initialMap = new Map(INITIAL_MATERIALS.map((m) => [m.id, m]));
    const updated = cached.map((m) => {
      const init = initialMap.get(m.id);
      if (init) {
        return {
          ...init,
          ...m,
          contentSections: m.contentSections && m.contentSections.length > 0 ? m.contentSections : init.contentSections,
          summary: m.summary || init.summary
        };
      }
      return m;
    });
    const cachedIds = new Set(cached.map((c) => c.id));
    for (const init of INITIAL_MATERIALS) {
      if (!cachedIds.has(init.id)) updated.push(init);
    }
    return updated;
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
    if (typeof window !== "undefined") {
      fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMat)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.material && data.material.id) {
            const current = getStorageItem<MaterialItem[]>(STORAGE_KEYS.MATERIALS, []);
            const updated = current.map((m) => (m.id === newMat.id ? { ...m, id: data.material.id } : m));
            setStorageItem(STORAGE_KEYS.MATERIALS, updated);
          }
        })
        .catch((err) => console.warn("Supabase material add error:", err));
    }
    return newMat;
  },

  deleteMaterial(id: string): void {
    const list = this.getMaterials();
    const target = list.find((m) => m.id === id);
    const updated = list.filter((m) => m.id !== id);
    setStorageItem(STORAGE_KEYS.MATERIALS, updated);
    if (typeof window !== "undefined") {
      const q = target
        ? `id=${encodeURIComponent(id)}&title=${encodeURIComponent(target.title)}`
        : `id=${encodeURIComponent(id)}`;
      fetch(`/api/materials?${q}`, { method: "DELETE" }).catch((err) =>
        console.warn("Supabase material delete error:", err)
      );
    }
  },

  incrementMaterialDownload(id: string): void {
    const list = this.getMaterials().map((m) =>
      m.id === id ? { ...m, downloads: m.downloads + 1 } : m
    );
    setStorageItem(STORAGE_KEYS.MATERIALS, list);
    syncMaterialsToSupabase().catch(() => {});
  },

  async refreshMaterialsFromSupabase(): Promise<void> {
    await refreshMaterialsFromSupabase();
  },

  async syncMaterialsToSupabase(): Promise<void> {
    await syncMaterialsToSupabase();
  },

  // Quizzes
  getQuizzes(): QuizItem[] {
    const cached = getStorageItem<QuizItem[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    const cachedIds = new Set(cached.map((q) => q.id));
    const merged = [...cached];
    for (const init of INITIAL_QUIZZES) {
      if (!cachedIds.has(init.id)) merged.push(init);
    }
    return merged;
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
    if (typeof window !== "undefined") {
      fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment)
      }).catch((err) => console.warn("Payment cloud push error:", err));
    }
    return newPayment;
  },

  updatePaymentStatus(id: string, status: "Approved" | "Rejected", notes?: string): void {
    const list = this.getPayments().map((p) =>
      p.id === id ? { ...p, status, notes: notes || p.notes } : p
    );
    setStorageItem(STORAGE_KEYS.PAYMENTS, list);
    if (typeof window !== "undefined") {
      fetch("/api/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes })
      }).catch((err) => console.warn("Payment status cloud update error:", err));
    }
  },

  async refreshPaymentsFromSupabase(): Promise<void> {
    await refreshPaymentsFromSupabase();
  },

  async syncPaymentsToSupabase(): Promise<void> {
    await syncPaymentsToSupabase();
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
  },

  // About Sir Details
  getAboutDetails(): AboutSirDetails {
    return getStorageItem<AboutSirDetails>(STORAGE_KEYS.ABOUT_DETAILS, INITIAL_ABOUT_SIR);
  },

  updateAboutDetails(details: AboutSirDetails): AboutSirDetails {
    setStorageItem(STORAGE_KEYS.ABOUT_DETAILS, details);
    return details;
  },

  // Portfolio Items
  getPortfolios(): PortfolioItem[] {
    return getStorageItem<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIOS, INITIAL_PORTFOLIOS);
  },

  addPortfolio(item: Omit<PortfolioItem, "id">): PortfolioItem {
    const list = this.getPortfolios();
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`
    };
    setStorageItem(STORAGE_KEYS.PORTFOLIOS, [...list, newItem]);
    return newItem;
  },

  updatePortfolio(id: string, updated: Partial<PortfolioItem>): PortfolioItem[] {
    const list = this.getPortfolios().map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    setStorageItem(STORAGE_KEYS.PORTFOLIOS, list);
    return list;
  },

  deletePortfolio(id: string): void {
    const list = this.getPortfolios().filter((item) => item.id !== id);
    setStorageItem(STORAGE_KEYS.PORTFOLIOS, list);
  },

  // Articles & News about Sir
  getArticles(): SirArticle[] {
    return getStorageItem<SirArticle[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  },

  addArticle(article: Omit<SirArticle, "id" | "publishedDate">): SirArticle {
    const list = this.getArticles();
    const newArticle: SirArticle = {
      ...article,
      id: `art-${Date.now()}`,
      publishedDate: new Date().toISOString().split("T")[0]
    };
    setStorageItem(STORAGE_KEYS.ARTICLES, [newArticle, ...list]);
    return newArticle;
  },

  updateArticle(id: string, updated: Partial<SirArticle>): SirArticle[] {
    const list = this.getArticles().map((article) =>
      article.id === id ? { ...article, ...updated } : article
    );
    setStorageItem(STORAGE_KEYS.ARTICLES, list);
    return list;
  },

  deleteArticle(id: string): void {
    const list = this.getArticles().filter((article) => article.id !== id);
    setStorageItem(STORAGE_KEYS.ARTICLES, list);
  }
};

