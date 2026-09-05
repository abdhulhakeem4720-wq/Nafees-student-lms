import { createBrowserClient } from "@supabase/ssr";

export function isSupabasePlaceholder(url?: string): boolean {
  if (!url) return true;
  return (
    url.includes("your-project.supabase.co") ||
    url.includes("zjhnniexwyleodytmtro") ||
    url.trim() === ""
  );
}

function createMockClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error("Mock auth mode active") }),
      signInWithPassword: async () => ({ data: { user: null }, error: new Error("Mock auth mode active") }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: async () => ({ data: [], error: null })
        }),
        limit: async () => ({ data: [], error: null })
      }),
      insert: async () => ({ data: null, error: null }),
      upsert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error("Mock storage active") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        createSignedUrl: async () => ({ data: null, error: new Error("Mock storage active") })
      })
    }
  } as any;
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (isSupabasePlaceholder(url)) {
    return createMockClient();
  }

  try {
    return createBrowserClient(url, key);
  } catch (err) {
    console.warn("Supabase client creation fallback:", err);
    return createMockClient();
  }
}

