import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // L'operatore '!' assicura a TypeScript che queste variabili d'ambiente
  // esistono, come definito nel file .env.local
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
