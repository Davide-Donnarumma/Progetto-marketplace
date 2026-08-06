import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Compass } from "lucide-react";
import TripsClient from "./TripsClient";

export default async function TripsPage() {
  const supabase = await createClient();

  // 1. Verifica che l'utente sia autenticato
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Recupero delle prenotazioni effettuate da questo specifico cliente
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      yacht:yachts (
        name,
        image_url,
        port_location
      )
    `)
    .eq("guest_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore nel recupero dei viaggi:", error);
  }

  return (
    <main className="min-h-screen bg-coastal-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-coastal-200">
          <Compass className="text-gold w-6 h-6" />
          <h1 className="text-3xl font-light text-coastal-900">I Miei Viaggi</h1>
        </div>
        
        {/* Passiamo i dati al componente interattivo */}
        <TripsClient bookings={bookings || []} />
      </div>
    </main>
  );
}