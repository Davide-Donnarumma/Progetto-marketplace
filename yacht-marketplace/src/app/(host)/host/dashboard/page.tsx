import Link from "next/link";
import { PlusCircle, Ship } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HostDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Recupera gli yacht appartenenti a questo utente
  const { data: myYachts } = await supabase
    .from('yachts')
    .select('*')
    .eq('owner_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-coastal-100">
        <div>
          <h2 className="text-lg font-medium text-coastal-900">La Sua Flotta</h2>
          <p className="text-sm text-coastal-500">Yacht attualmente registrati nel sistema.</p>
        </div>
        <Link 
          href="/host/add-yacht"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-coastal-900 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" /> Aggiungi Yacht
        </Link>
      </div>

      {(!myYachts || myYachts.length === 0) ? (
        <div className="bg-coastal-50 border-2 border-dashed border-coastal-200 rounded-3xl p-12 text-center">
          <Ship className="w-16 h-16 text-coastal-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-coastal-900 mb-2">Nessuno yacht presente</h3>
          <p className="text-coastal-500 max-w-md mx-auto">
            Inizi a guadagnare aggiungendo la Sua prima imbarcazione. Clicchi sul pulsante in alto a destra per iniziare.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Qui in futuro mapperemo le carte degli yacht dell'armatore */}
          <p className="text-coastal-500">Yacht caricati in fase di sviluppo...</p>
        </div>
      )}
    </div>
  );
}