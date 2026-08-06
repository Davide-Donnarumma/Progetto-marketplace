import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import YachtDetailClient from "./YachtDetailClient";

// Definizione rigorosa dei parametri asincroni per Next.js
type Props = {
  params: Promise<{ id: string }>;
};

export default async function YachtDetailPage({ params }: Props) {
  // 1. Estrazione asincrona dell'ID dalla barra degli indirizzi
  const resolvedParams = await params;
  const yachtId = resolvedParams.id;

  // 2. Inizializzazione del client di database lato server
  const supabase = await createClient();

  // 3. Esecuzione della query per recuperare i dettagli dell'imbarcazione
  const { data: yacht, error } = await supabase
    .from("yachts")
    .select("*")
    .eq("id", yachtId)
    .single();

  // 4. Gestione Edge Case: Yacht non trovato
  if (error || !yacht) {
    notFound();
  }

  // 5. Renderizzazione della pagina delegata al Client Component interattivo
  return (
    <main className="min-h-screen bg-coastal-50 pt-24 pb-20">
      <YachtDetailClient yacht={yacht} />
    </main>
  );
}