"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Anchor, CreditCard } from "lucide-react";

type GuestBooking = {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  yacht: { name: string; image_url: string | null; port_location: string } | null;
};

export default function TripsClient({ bookings }: { bookings: GuestBooking[] }) {
  
  // UI qualora il cliente non abbia mai fatto richieste
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-coastal-100 flex flex-col items-center justify-center">
        <Anchor className="w-12 h-12 text-coastal-300 mb-4 stroke-[1.5]" />
        <h3 className="text-xl font-medium text-coastal-900 mb-2">Nessun viaggio in programma</h3>
        <p className="text-coastal-500 font-light mb-6">Non ha ancora effettuato alcuna richiesta di prenotazione.</p>
        <Link href="/search" className="px-6 py-3 bg-coastal-900 text-white rounded-xl font-medium hover:bg-coastal-800 transition-colors">
          Esplora la flotta
        </Link>
      </div>
    );
  }

  // Griglia delle prenotazioni
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-coastal-100 flex flex-col transition-shadow hover:shadow-md">
          
          <div className="relative h-48 bg-coastal-200">
            <Image
              src={booking.yacht?.image_url || "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000"}
              alt={booking.yacht?.name || "Yacht"}
              fill
              className="object-cover"
            />
            {/* Badge di Stato in sovrimpressione */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm ${
                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status === 'PENDING' ? 'In Attesa' : booking.status === 'CONFIRMED' ? 'Approvata' : 'Annullata'}
              </span>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-medium text-coastal-900 mb-1">{booking.yacht?.name}</h3>
            <p className="text-sm text-coastal-500 font-light mb-4">{booking.yacht?.port_location}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-coastal-600 font-light">
                <Calendar className="w-4 h-4 text-coastal-400" />
                <span>{booking.start_date} <span className="mx-1">→</span> {booking.end_date}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-coastal-100">
                <span className="text-coastal-500 font-light">Totale</span>
                <span className="text-lg font-medium text-coastal-900">€{booking.total_price}</span>
              </div>
            </div>

            {/* Azioni Dinamiche (Il Gateway verso Stripe) */}
            <div className="mt-auto">
              {booking.status === "CONFIRMED" ? (
                // Collegamento alla Sua pagina di checkout esistente, passando l'ID della prenotazione!
                <Link 
                  href={`/checkout/${booking.id}`} 
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gold text-coastal-900 hover:bg-gold-light rounded-xl font-medium transition-colors shadow-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  Procedi al Pagamento
                </Link>
              ) : booking.status === "PENDING" ? (
                <div className="w-full py-3 px-4 bg-coastal-50 text-coastal-500 rounded-xl text-center text-sm font-light border border-coastal-100">
                  In attesa di conferma dall&apos;armatore
                </div>
              ) : (
                <div className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-light border border-red-100">
                  Questa richiesta è stata declinata
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}