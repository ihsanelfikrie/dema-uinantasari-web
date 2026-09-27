import { createBrowserClient } from "@supabase/ssr";

const mockQueryBuilder: any = new Proxy(
  {
    then: (onfulfilled: any) => onfulfilled({ data: null, error: null }),
  },
  {
    get(target, prop) {
      if (prop === "then") {
        return target.then;
      }
      return () => mockQueryBuilder;
    },
  }
);

const mockStorage = {
  from: () => ({
    upload: async () => ({ data: {}, error: null }),
    remove: async () => ({ data: {}, error: null }),
    createSignedUrl: async () => ({ data: { signedUrl: "" }, error: null }),
  }),
};

const mockAuth = {
  getUser: async () => ({ data: { user: null }, error: null }),
  signInWithPassword: async () => ({ data: { user: null }, error: null }),
  signOut: async () => ({ error: null }),
};

const mockSupabase = {
  from: () => mockQueryBuilder,
  storage: mockStorage,
  auth: mockAuth,
} as any;


export function createClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return mockSupabase;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
