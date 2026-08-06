"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BookingWidgetProps {
  yachtId: string;
  pricePerDay: number;
}

export default function BookingWidget({ yachtId, pricePerDay }: BookingWidgetProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Inizializzazione del client Supabase
  const supabase = createClient();

  // Calcolo dei giorni e del prezzo totale
  const calculateTotal = () => {
    if (!startDate || !endDate) return { days: 0, total: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) return { days: 0, total: 0 };
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return {
      days: diffDays,
      total: diffDays * pricePerDay
    };
  };

  const { days, total } = calculateTotal();

  // Funzione per gestire l'inserimento della prenotazione nel database
  const handleBooking = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Verifica dell'autenticazione dell'utente
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setMessage({ 
          type: 'error', 
          text: "È necessario effettuare l'accesso alla piattaforma per poter richiedere una prenotazione." 
        });
        setIsLoading(false);
        return;
      }

      // 2. Calcolo della commissione della piattaforma (es. 10%)
      const platformFee = total * 0.10;

      // 3. Inserimento del record nella tabella bookings
      const { error: insertError } = await supabase
        .from("bookings")
        .insert({
          yacht_id: yachtId,
          guest_id: user.id,
          start_date: startDate,
          end_date: endDate,
          total_price: total,
          platform_fee: platformFee,
          status: "PENDING"
        });

      if (insertError) throw insertError;

      // 4. Gestione del successo
      setMessage({ 
        type: 'success', 
        text: "Richiesta inviata con successo. La prenotazione è ora in attesa di approvazione." 
      });
      
      // Resetta il calendario
      setStartDate("");
      setEndDate("");

    } catch (err) {
      console.error("Errore critico durante la generazione della prenotazione:", err);
      setMessage({ 
        type: 'error', 
        text: "Si è verificato un errore tecnico. La preghiamo di riprovare più tardi." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-coastal-100 sticky top-28">
      <div className="flex items-end gap-1 mb-6">
        <span className="text-3xl font-semibold text-coastal-900">€{pricePerDay}</span>
        <span className="text-coastal-500 mb-1">/ giorno</span>
      </div>

      {/* Messaggi di feedback (Errore o Successo) */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm ${
          message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-coastal-700 mb-2">Check-in</label>
          <input 
            type="date" 
            className="w-full p-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-coastal-700 mb-2">Check-out</label>
          <input 
            type="date" 
            className="w-full p-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Resoconto dei costi visibile solo con date valide */}
        {days > 0 && (
          <div className="pt-4 border-t border-coastal-100">
            <div className="flex justify-between items-center text-coastal-600 mb-2">
              <span>€{pricePerDay} x {days} notti</span>
              <span>€{total}</span>
            </div>
            <div className="flex justify-between items-center text-coastal-900 font-semibold text-lg mt-4">
              <span>Totale</span>
              <span>€{total}</span>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleBooking}
        disabled={days === 0 || isLoading}
        className={`w-full py-4 rounded-xl font-medium transition-colors mb-4 flex justify-center items-center ${
          days > 0 && !isLoading
            ? "bg-coastal-900 text-white hover:bg-coastal-800" 
            : "bg-coastal-100 text-coastal-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Elaborazione...
          </>
        ) : (
          "Richiedi Prenotazione"
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-coastal-500 font-light mt-6">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Transazione Sicura Garantita</span>
      </div>
    </div>
  );
}