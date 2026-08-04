import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Inizializza la risposta del server
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Aggiorna il cookie nella richiesta in corso
          request.cookies.set({ name, value, ...options });
          // Rigenera la risposta per includere il nuovo cookie
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          });
          supabaseResponse.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // L'invocazione di getUser() fondamentale: forza Supabase a validare
  // il token attuale e, se scaduto, a rinnovarlo automaticamente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // PROTEZIONE DELLE ROTTE (Route Guards)
  
  const path = request.nextUrl.pathname;

  // Se l'utente NON è loggato e tenta di accedere a checkout, dashboard o fleet
  if (
    !user &&
    (path.startsWith("/checkout") ||
      path.startsWith("/dashboard") ||
      path.startsWith("/fleet"))
  ) {
    // Lo reindirizziamo al login, passando l'URL di provenienza per comodità
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
