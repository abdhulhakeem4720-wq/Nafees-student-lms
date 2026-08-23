import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

  try {
    return createBrowserClient(url, key);
  } catch (err) {
    console.warn("Supabase client creation fallback:", err);
    // Return a dummy client structure that fails gracefully
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
          })
        })
      })
    } as any;
  }
}
