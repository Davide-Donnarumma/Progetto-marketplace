import Link from "next/link";
import { Anchor } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
  const supabase = await createClient();
  
  // Verifica dell'autenticazione utente
  const { data: { user } } = await supabase.auth.getUser();

  let userData = null;

  // Se l'utente è loggato, recuperiamo i dettagli anagrafici e il ruolo
  if (user) {
    const { data, error } = await supabase
      .from("users")
      .select("first_name, last_name, role")
      .eq("id", user.id)
      .single();
      
    if (!error && data) {
      userData = data;
    }
  }

  return (
    // La barra è impostata su "fixed" con un effetto vetro (backdrop-blur) per sovrapporsi elegantemente all'immagine della homepage
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-coastal-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Settore Sinistro: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Anchor className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
          <span className="text-xl font-light text-coastal-900 tracking-wide">
            Coastal<span className="font-semibold">Elegance</span>
          </span>
        </Link>

        {/* Settore Centrale: Link Pubblici */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-light text-coastal-600 hover:text-coastal-900 transition-colors">
            Esplora la Flotta
          </Link>
        </div>

        {/* Settore Destro: Il Menu Utente Dinamico */}
        <div className="flex items-center justify-end">
          <UserDropdown user={userData} />
        </div>
        
      </div>
    </nav>
  );
}