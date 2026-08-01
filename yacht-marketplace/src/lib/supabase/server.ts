import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Questo blocco catch è vitale: la funzione 'set' può essere chiamata
            // da un Server Component che non ha il permesso di alterare i cookie.
            // L'errore viene ignorato in quanto i middleware gestiranno il rinnovo.
            // (La dichiarazione della variabile error è stata omessa per via di ESLint)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
          }
        },
      },
    },
  );
}
