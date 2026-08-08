import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Verifica Sicurezza Rigorosa
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
    redirect("/"); 
  }

  // 2. Estrazione Globale dei Dati per la Dashboard
  // Estraiamo tutti gli utenti
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  // Estraiamo gli yacht includendo i dati dell'armatore (host)
  const { data: yachts } = await supabase
    .from("yachts")
    .select(`
      *,
      host:users!host_id(first_name, last_name, email)
    `)
    .order("created_at", { ascending: false });

  // Estraiamo le prenotazioni includendo i dati dello yacht e del cliente (guest)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      yacht:yachts(name, price_per_day),
      guest:users!bookings_guest_id_fkey(first_name, last_name, email)
    `)
    .order("created_at", { ascending: false });

  // 3. Passiamo i dati al componente interattivo
  return (
    <AdminDashboardClient 
      initialUsers={users || []} 
      initialYachts={yachts || []} 
      initialBookings={bookings || []} 
    />
  );
}