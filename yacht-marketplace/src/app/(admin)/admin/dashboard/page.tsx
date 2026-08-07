import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, Anchor, CreditCard } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Verifica Sicurezza: L'utente deve essere loggato E avere il ruolo ADMIN
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "ADMIN") {
    // Se un utente normale tenta di accedere, lo rimandiamo alla home
    redirect("/"); 
  }

  // 2. Recupero dei dati statistici globali
  const { count: totalUsers } = await supabase.from("users").select("*", { count: 'exact', head: true });
  const { count: totalYachts } = await supabase.from("yachts").select("*", { count: 'exact', head: true });
  const { count: totalBookings } = await supabase.from("bookings").select("*", { count: 'exact', head: true });

  return (
    <main className="min-h-screen bg-coastal-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-coastal-200">
          <LayoutDashboard className="text-gold w-6 h-6" />
          <h1 className="text-3xl font-light text-coastal-900">Pannello di Controllo</h1>
        </div>

        {/* Griglia delle Statistiche Generali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card Utenti */}
          <div className="bg-white p-6 rounded-2xl border border-coastal-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-coastal-500 font-light">Utenti Registrati</p>
              <p className="text-2xl font-semibold text-coastal-900">{totalUsers || 0}</p>
            </div>
          </div>

          {/* Card Imbarcazioni */}
          <div className="bg-white p-6 rounded-2xl border border-coastal-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-coastal-50 text-coastal-600 rounded-xl">
              <Anchor className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-coastal-500 font-light">Flotta Totale</p>
              <p className="text-2xl font-semibold text-coastal-900">{totalYachts || 0}</p>
            </div>
          </div>

          {/* Card Prenotazioni */}
          <div className="bg-white p-6 rounded-2xl border border-coastal-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-coastal-500 font-light">Transazioni</p>
              <p className="text-2xl font-semibold text-coastal-900">{totalBookings || 0}</p>
            </div>
          </div>
        </div>

        {/* Qui potremo aggiungere in futuro tabelle dettagliate per approvare yacht, gestire contestazioni, ecc. */}
        <div className="bg-white rounded-2xl border border-coastal-100 shadow-sm p-8 text-center text-coastal-500 font-light">
          Selezioni un&apos;area gestionale per visualizzare i dettagli avanzati.
        </div>
        
      </div>
    </main>
  );
}