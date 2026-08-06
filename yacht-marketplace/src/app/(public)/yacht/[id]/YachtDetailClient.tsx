"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Ruler, Star, MapPin, Anchor } from "lucide-react";
import { Database } from "@/types/database.types";
import BookingWidget from "@/components/BookingWidget";

type Yacht = Database["public"]["Tables"]["yachts"]["Row"];

export default function YachtDetailClient({ yacht }: { yacht: Yacht }) {
  return (
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Pulsante per tornare alla ricerca */}
      <div className="mb-8">
        <Link href="/search" className="inline-flex items-center text-sm font-medium text-coastal-500 hover:text-coastal-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Torna ai risultati
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* ==================================================================
            COLONNA PRINCIPALE (Immagine e Dettagli)
            ================================================================== */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hero Image */}
          <div className="relative w-full h-125 rounded-3xl overflow-hidden bg-coastal-200 border border-coastal-100">
            <Image 
              src={yacht.image_url || "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000"} 
              alt={yacht.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-coastal-900 flex items-center gap-2 shadow-sm">
              <Star className="w-4 h-4 text-gold fill-gold" />
              {yacht.luxury_tier === 3 ? "Superyacht" : yacht.luxury_tier === 2 ? "Luxury" : "Premium"}
            </div>
          </div>

          {/* Intestazione */}
          <div>
            <h1 className="text-4xl font-light text-coastal-900 mb-4">{yacht.name}</h1>
            <div className="flex items-center text-coastal-500 gap-2 mb-6">
              <MapPin className="w-5 h-5" />
              <span className="text-lg font-light">{yacht.port_location}</span>
            </div>
          </div>

          <hr className="border-coastal-200" />

          {/* Specifiche Tecniche */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-coastal-400 text-sm flex items-center gap-2"><Users className="w-4 h-4" /> Capacità</span>
              <span className="text-lg font-medium text-coastal-900">{yacht.passenger_capacity} Ospiti</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-coastal-400 text-sm flex items-center gap-2"><Ruler className="w-4 h-4" /> Lunghezza</span>
              <span className="text-lg font-medium text-coastal-900">{yacht.length_meters} metri</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-coastal-400 text-sm flex items-center gap-2"><Anchor className="w-4 h-4" /> Categoria</span>
              <span className="text-lg font-medium text-coastal-900">Livello {yacht.luxury_tier}</span>
            </div>
          </div>

          <hr className="border-coastal-200" />

          <div>
            <h2 className="text-2xl font-light text-coastal-900 mb-4">L&apos;Esperienza</h2>
            <p className="text-coastal-600 leading-relaxed font-light whitespace-pre-wrap">
              {yacht.description}
            </p>
          </div>
        </div>

        {/* ==================================================================
            COLONNA LATERALE (Modulo Prenotazione Interattivo)
            ================================================================== */}
        <aside className="lg:col-span-1">
          <BookingWidget yachtId={yacht.id} pricePerDay={yacht.price_per_day} />
        </aside>

      </div>
    </div>
  );
}