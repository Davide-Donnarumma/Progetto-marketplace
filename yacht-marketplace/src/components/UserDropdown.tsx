"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Compass, Anchor, ChevronDown, PlusCircle, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type UserData = {
  first_name: string;
  last_name: string;
  role: "GUEST" | "HOST" | "ADMIN";
} | null;

export default function UserDropdown({ user }: { user: UserData }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Chiusura del menu se si clicca all'esterno dell'area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  // Se l'utente non è autenticato, mostriamo il pulsante di accesso
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="text-sm font-medium px-6 py-2.5 bg-coastal-900 text-white rounded-full hover:bg-coastal-800 transition-colors shadow-sm"
        >
          Accedi
        </Link>
      </div>
    );
  }

  // Creazione delle iniziali per l'Avatar
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bottone Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full border border-coastal-200 hover:shadow-sm transition-all bg-white focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-medium text-sm">
          {initials}
        </div>
        <ChevronDown className={`w-4 h-4 text-coastal-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu a Tendina */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-coastal-100 py-2 text-sm z-50 overflow-hidden">
          
          <div className="px-4 py-3 border-b border-coastal-100 mb-2 bg-coastal-50/50">
            <p className="font-medium text-coastal-900">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-coastal-500 font-light mt-0.5">
              Account {user.role === 'HOST' ? 'Armatore' : user.role === 'ADMIN' ? 'Amministratore' : 'Cliente'}
            </p>
          </div>

          {/* VOCI PER L'AMMINISTRATORE */}
          {user.role === "ADMIN" ? (
            <>
              <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-coastal-600 hover:bg-coastal-50 hover:text-gold transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Pannello di Controllo
              </Link>
            </>
          ) 
          /* VOCI PER L'ARMATORE */
          : user.role === "HOST" ? (
            <>
              <Link href="/booking" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-coastal-600 hover:bg-coastal-50 hover:text-gold transition-colors">
                <Anchor className="w-4 h-4" /> Richieste
              </Link>
              <Link href="/host/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-coastal-600 hover:bg-coastal-50 hover:text-gold transition-colors">
                <LayoutDashboard className="w-4 h-4" /> La Mia Flotta
              </Link>
              <Link href="/host/add-yacht" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-coastal-600 hover:bg-coastal-50 hover:text-gold transition-colors">
                <PlusCircle className="w-4 h-4" /> Aggiungi Yacht
              </Link>
            </>
          ) 
          /* VOCI PER IL CLIENTE */
          : (
            <>
              <Link href="/trips" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-coastal-600 hover:bg-coastal-50 hover:text-gold transition-colors">
                <Compass className="w-4 h-4" /> I Miei Viaggi
              </Link>
            </>
          )}

          <div className="border-t border-coastal-100 mt-2 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" /> Esci dall&apos;Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}