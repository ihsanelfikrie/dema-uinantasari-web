import { createBrowserClient } from "@supabase/ssr";

const mockQueryBuilder = {
  select: () => mockQueryBuilder,
  eq: () => mockQueryBuilder,
  order: () => mockQueryBuilder,
  single: () => mockQueryBuilder,
  then: (onfulfilled: any) => onfulfilled({ data: null, error: null }),
};

const mockSupabase = {
  from: () => mockQueryBuilder,
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
