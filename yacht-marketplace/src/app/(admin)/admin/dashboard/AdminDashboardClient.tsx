"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Anchor, CreditCard, AlertTriangle, Ban, Trash2, Flag, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ==========================================
// DEFINIZIONI DEI TIPI
// ==========================================
type AdminTab = "USERS" | "YACHTS" | "BOOKINGS";

type UserRecord = {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  account_status?: string;
};

type YachtRecord = {
  id: string;
  name: string;
  price_per_day: number;
  is_flagged?: boolean;
  host?: { first_name: string; last_name: string; email: string };
};

type BookingRecord = {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  yacht?: { name: string; price_per_day: number };
  guest?: { first_name: string; last_name: string; email: string };
};

interface AdminDashboardClientProps {
  initialUsers: UserRecord[];
  initialYachts: YachtRecord[];
  initialBookings: BookingRecord[];
}

export default function AdminDashboardClient({ 
  initialUsers, 
  initialYachts, 
  initialBookings 
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("USERS");
  
  // Stati tipizzati per la manipolazione delle tabelle
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [yachts, setYachts] = useState<YachtRecord[]>(initialYachts);
  const [bookings] = useState<BookingRecord[]>(initialBookings);
  
  const supabase = createClient();

  // ==========================================
  // LOGICHE DI AZIONE E MODERAZIONE
  // ==========================================

  const handleUserAction = async (userId: string, action: "WARNING" | "BLOCK" | "DELETE") => {
    const confirmMessage = action === "DELETE" ? "Sei sicuro di voler eliminare questo utente in modo permanente?" : `Sei sicuro di voler applicare lo stato ${action} a questo utente?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      if (action === "DELETE") {
        await supabase.from("users").delete().eq("id", userId);
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        await supabase.from("users").update({ account_status: action }).eq("id", userId);
        setUsers(users.map((u) => u.id === userId ? { ...u, account_status: action } : u));
      }
      alert("Azione completata con successo.");
    } catch (err) {
      console.error(err);
      alert("Errore durante l'esecuzione dell'azione.");
    }
  };

  const handleYachtAction = async (yachtId: string, action: "FLAG" | "DELETE") => {
    if (!window.confirm(`Sei sicuro di voler procedere con l'azione: ${action}?`)) return;

    try {
      if (action === "DELETE") {
        await supabase.from("yachts").delete().eq("id", yachtId);
        setYachts(yachts.filter((y) => y.id !== yachtId));
      } else {
        await supabase.from("yachts").update({ is_flagged: true }).eq("id", yachtId);
        setYachts(yachts.map((y) => y.id === yachtId ? { ...y, is_flagged: true } : y));
      }
      alert("Azione completata con successo.");
    } catch (err) {
      console.error(err);
      alert("Errore durante l'esecuzione dell'azione.");
    }
  };

  // ==========================================
  // RENDER DELLE TABELLE
  // ==========================================

  const renderUsersTable = () => (
    <div className="overflow-x-auto bg-white rounded-2xl border border-coastal-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-coastal-50 border-b border-coastal-100 text-sm text-coastal-500 font-medium">
            <th className="p-4">Nome e Cognome</th>
            <th className="p-4">Ruolo</th>
            <th className="p-4">Stato Account</th>
            <th className="p-4 text-right">Azioni Disciplinari</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-coastal-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-coastal-50/50 transition-colors">
              <td className="p-4 font-medium text-coastal-900">{user.first_name} {user.last_name}</td>
              <td className="p-4"><span className="px-2 py-1 bg-coastal-100 text-coastal-600 rounded-md text-xs">{user.role}</span></td>
              <td className="p-4">
                {user.account_status === 'BLOCK' ? <span className="text-red-600 flex items-center gap-1"><Ban className="w-4 h-4"/> Bloccato</span> :
                 user.account_status === 'WARNING' ? <span className="text-yellow-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> Ammonito</span> :
                 <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Attivo</span>}
              </td>
              <td className="p-4 flex justify-end gap-2">
                <button onClick={() => handleUserAction(user.id, "WARNING")} title="Invia Avvertimento" className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"><AlertTriangle className="w-4 h-4" /></button>
                <button onClick={() => handleUserAction(user.id, "BLOCK")} title="Blocca Account" className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><Ban className="w-4 h-4" /></button>
                <button onClick={() => handleUserAction(user.id, "DELETE")} title="Elimina Utente" className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderYachtsTable = () => (
    <div className="overflow-x-auto bg-white rounded-2xl border border-coastal-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-coastal-50 border-b border-coastal-100 text-sm text-coastal-500 font-medium">
            <th className="p-4">Imbarcazione</th>
            <th className="p-4">Armatore</th>
            <th className="p-4">Prezzo / Giorno</th>
            <th className="p-4">Stato</th>
            <th className="p-4 text-right">Azioni</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-coastal-100">
          {yachts.map((yacht) => (
            <tr key={yacht.id} className="hover:bg-coastal-50/50 transition-colors">
              <td className="p-4 font-medium text-coastal-900">{yacht.name}</td>
              <td className="p-4">{yacht.host?.first_name} {yacht.host?.last_name}</td>
              <td className="p-4">€{yacht.price_per_day}</td>
              <td className="p-4">
                {yacht.is_flagged ? <span className="text-red-600 flex items-center gap-1"><Flag className="w-4 h-4"/> Segnalata</span> : <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Regolare</span>}
              </td>
              <td className="p-4 flex justify-end gap-2">
                <button onClick={() => handleYachtAction(yacht.id, "FLAG")} title="Segnala Imbarcazione" className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"><Flag className="w-4 h-4" /></button>
                <button onClick={() => handleYachtAction(yacht.id, "DELETE")} title="Rimuovi dal portale" className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBookingsTable = () => (
    <div className="overflow-x-auto bg-white rounded-2xl border border-coastal-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-coastal-50 border-b border-coastal-100 text-sm text-coastal-500 font-medium">
            <th className="p-4">ID Transazione</th>
            <th className="p-4">Imbarcazione</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Date</th>
            <th className="p-4">Importo</th>
            <th className="p-4">Stato</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-coastal-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-coastal-50/50 transition-colors">
              <td className="p-4 font-mono text-xs text-coastal-500">{booking.id.split('-')[0]}...</td>
              <td className="p-4 font-medium text-coastal-900">{booking.yacht?.name}</td>
              <td className="p-4">{booking.guest?.first_name} {booking.guest?.last_name}</td>
              <td className="p-4 text-coastal-500">{booking.start_date} <br/> {booking.end_date}</td>
              <td className="p-4 font-medium text-coastal-900">€{booking.total_price}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-md text-xs uppercase ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="min-h-screen bg-coastal-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-coastal-200">
          <LayoutDashboard className="text-gold w-6 h-6" />
          <h1 className="text-3xl font-light text-coastal-900">Pannello di Controllo</h1>
        </div>

        {/* Griglia delle Statistiche Generali (Fungono da selettori di Tab) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div onClick={() => setActiveTab("USERS")} className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${activeTab === 'USERS' ? 'bg-white border-gold ring-1 ring-gold' : 'bg-white border-coastal-100 hover:border-coastal-300'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${activeTab === 'USERS' ? 'bg-gold/10 text-gold' : 'bg-blue-50 text-blue-600'}`}>
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-coastal-500 font-light">Utenti Registrati</p>
                <p className="text-2xl font-semibold text-coastal-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div onClick={() => setActiveTab("YACHTS")} className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${activeTab === 'YACHTS' ? 'bg-white border-gold ring-1 ring-gold' : 'bg-white border-coastal-100 hover:border-coastal-300'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${activeTab === 'YACHTS' ? 'bg-gold/10 text-gold' : 'bg-coastal-50 text-coastal-600'}`}>
                <Anchor className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-coastal-500 font-light">Flotta Totale</p>
                <p className="text-2xl font-semibold text-coastal-900">{yachts.length}</p>
              </div>
            </div>
          </div>

          <div onClick={() => setActiveTab("BOOKINGS")} className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${activeTab === 'BOOKINGS' ? 'bg-white border-gold ring-1 ring-gold' : 'bg-white border-coastal-100 hover:border-coastal-300'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${activeTab === 'BOOKINGS' ? 'bg-gold/10 text-gold' : 'bg-green-50 text-green-600'}`}>
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-coastal-500 font-light">Transazioni</p>
                <p className="text-2xl font-semibold text-coastal-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Area di Visualizzazione Dinamica */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "USERS" && renderUsersTable()}
          {activeTab === "YACHTS" && renderYachtsTable()}
          {activeTab === "BOOKINGS" && renderBookingsTable()}
        </div>
        
      </div>
    </main>
  );
}