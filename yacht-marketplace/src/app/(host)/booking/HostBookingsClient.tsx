"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, Calendar, User, Anchor, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Definizione della struttura dati ricevuta dal Server Component
type BookingWithDetails = {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  yacht: { name: string; image_url: string | null; host_id: string } | null;
  guest: { first_name: string; last_name: string } | null;
};

export default function HostBookingsClient({ initialBookings }: { initialBookings: BookingWithDetails[] }) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>(initialBookings);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const supabase = createClient();

  // Funzione per aggiornare lo stato della prenotazione su Supabase
  const updateBookingStatus = async (bookingId: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    setProcessingId(bookingId);

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      // Aggiornamento dello stato locale per riflettere la modifica istantaneamente
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento della prenotazione:", error);
      alert("Si è verificato un errore tecnico durante l'operazione. La preghiamo di riprovare.");
    } finally {
      setProcessingId(null);
    }
  };

  // UI qualora non vi siano prenotazioni
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-coastal-100 flex flex-col items-center justify-center">
        <Anchor className="w-12 h-12 text-coastal-300 mb-4 stroke-[1.5]" />
        <h3 className="text-xl font-medium text-coastal-900 mb-2">Nessuna richiesta presente</h3>
        <p className="text-coastal-500 font-light">Al momento non ci sono prenotazioni per la Sua flotta.</p>
      </div>
    );
  }

  // Renderizzazione della lista delle prenotazioni
  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-coastal-100 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
          
          {/* Immagine Imbarcazione */}
          <div className="relative w-full md:w-56 h-40 rounded-xl overflow-hidden bg-coastal-100 shrink-0">
            <Image
              src={booking.yacht?.image_url || "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000"}
              alt={booking.yacht?.name || "Yacht"}
              fill
              className="object-cover"
            />
          </div>

          {/* Dettagli Prenotazione */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium text-coastal-900">{booking.yacht?.name}</h3>
                
                {/* Badge di Stato Dinamico */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-coastal-600 font-light">
                  <User className="w-4 h-4 text-coastal-400" />
                  <span>{booking.guest?.first_name} {booking.guest?.last_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-coastal-600 font-light">
                  <Calendar className="w-4 h-4 text-coastal-400" />
                  <span>{booking.start_date} <span className="mx-1">→</span> {booking.end_date}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-coastal-100 flex items-center justify-between">
              <div className="text-xl font-medium text-coastal-900">
                €{booking.total_price}
              </div>
              
              {/* Controlli di Approvazione (Visibili esclusivamente se lo stato è PENDING) */}
              {booking.status === "PENDING" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                    disabled={processingId === booking.id}
                    className="flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                    title="Rifiuta Richiesta"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                    disabled={processingId === booking.id}
                    className="flex items-center gap-2 px-6 py-2.5 bg-coastal-900 text-white hover:bg-coastal-800 rounded-xl transition-colors font-medium text-sm disabled:opacity-50 shadow-sm"
                  >
                    {processingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approva
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}