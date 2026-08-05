import { ReactNode } from "react";
import Link from "next/link";
import { Anchor, LogOut, Ship, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HostLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-coastal-50 flex">
      {/* Sidebar Laterale */}
      {/* RISOLTO: Rimosso il 'flex' di base che andava in conflitto con 'hidden' */}
      <aside className="w-64 bg-white border-r border-coastal-100 hidden md:flex flex-col">
        <div className="p-6 border-b border-coastal-100 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Anchor className="h-8 w-8 text-gold" />
            <span className="font-semibold text-xl tracking-tight text-coastal-900">Host Area</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/host/dashboard" className="flex items-center gap-3 px-4 py-3 bg-coastal-50 text-coastal-900 rounded-xl font-medium transition-colors">
            <Ship className="w-5 h-5 text-gold" /> Le Mie Barche
          </Link>
          <Link href="/host/profile" className="flex items-center gap-3 px-4 py-3 text-coastal-500 hover:bg-coastal-50 hover:text-coastal-900 rounded-xl font-medium transition-colors">
            <User className="w-5 h-5" /> Profilo
          </Link>
        </nav>

        <div className="p-4 border-t border-coastal-100">
          <div className="flex items-center gap-3 px-4 py-3 text-coastal-500 hover:text-red-600 rounded-xl font-medium transition-colors cursor-pointer">
             <LogOut className="w-5 h-5" /> Esci
          </div>
        </div>
      </aside>

      {/* Area Contenuto Principale */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-light text-coastal-900">Benvenuto, Armatore</h1>
            <p className="text-sm text-coastal-500">Gestisca la Sua flotta esclusiva.</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}