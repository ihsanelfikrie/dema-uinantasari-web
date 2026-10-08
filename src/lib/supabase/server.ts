import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as any).WebSocket = class {};
}

let cachedAdminClient: any = null;

function getAdminClient() {
  if (cachedAdminClient) return cachedAdminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  cachedAdminClient = createSupabaseClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cachedAdminClient;
}

export async function createClient() {
  const cookieStore = await cookies();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY)
  ) {
    return mockSupabase;
  }

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const admin = getAdminClient();
  if (admin) {
    return new Proxy(authClient, {
      get(target, prop, receiver) {
        if (prop === "auth") {
          return authClient.auth;
        }
        if (prop === "from") {
          return admin.from.bind(admin);
        }
        if (prop === "storage") {
          return admin.storage;
        }
        if (prop === "rpc") {
          return admin.rpc.bind(admin);
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  return authClient;
}
