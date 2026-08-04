import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Deleghiamo la gestione della sessione e la protezione delle rotte
  return await updateSession(request);
}

// Configurazione per evitare l'esecuzione inutile del middleware
// su file statici (immagini, font, script), ottimizzando le prestazioni.
export const config = {
  matcher: [
    /*
     * Intercetta tutte le rotte TRANNE:
     * - _next/static (file statici)
     * - _next/image (immagini ottimizzate)
     * - favicon.ico (icona)
     * - Qualsiasi file con estensione (es. .svg, .png)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};