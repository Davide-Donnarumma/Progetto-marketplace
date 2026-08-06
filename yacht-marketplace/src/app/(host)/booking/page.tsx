import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Anchor } from "lucide-react";
// Importazione del futuro componente Client (lo creeremo nel prossimo step)
import HostBookingsClient from "./HostBookingsClient";

export default async function HostBookingsPage() {
  const supabase = await createClient();

  // 1. Verifica che l'utente sia autenticato
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login"); // Se non è loggato, rimanda al login
  }

  // 2. Recupero delle prenotazioni destinate agli yacht di questo specifico Host
  // Utilizziamo !inner per filtrare la tabella unita (yachts) in base all'ID dell'host
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      yacht:yachts!inner (
        name,
        image_url,
        host_id
      ),
      guest:users!bookings_guest_id_fkey (
        first_name,
        last_name
      )
    `)
    .eq("yacht.host_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore nel recupero delle prenotazioni dell'armatore:", error);
  }

  return (
    <main className="min-h-screen bg-coastal-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-coastal-200">
          <Anchor className="text-gold w-6 h-6" />
          <h1 className="text-3xl font-light text-coastal-900">Richieste di Prenotazione</h1>
        </div>

        {/* 
          Passiamo i dati al componente interattivo che permetterà 
          all'armatore di accettare o rifiutare le richieste 
        */}
        <HostBookingsClient initialBookings={bookings || []} />
        
      </div>
    </main>
  );
}