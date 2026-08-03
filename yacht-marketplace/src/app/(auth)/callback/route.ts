import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Se non è specificata una destinazione, reindirizza alla ricerca
  const next = searchParams.get("next") ?? "/search";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // In caso di token non valido o scaduto, si viene reindirizzati al login
  return NextResponse.redirect(
    `${origin}/login?error=Operazione non autorizzata o link scaduto`,
  );
}
