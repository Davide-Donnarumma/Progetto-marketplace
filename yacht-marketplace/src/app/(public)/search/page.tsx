"use client";

import { Suspense } from "react";
import { useSearchBoats } from "@/hooks/useSearchBoats";
import { useSearchStore } from "@/store/useSearchStore";
import { SlidersHorizontal, Users, Ruler, Star, Anchor } from "lucide-react";

// ============================================================================
// COMPONENTE PRINCIPALE DI RICERCA (Logica e UI)
// ============================================================================
function SearchContent() {
  const { results, isLoading, error } = useSearchBoats();
  const { filters, setFilters } = useSearchStore();

  return (
    <div className="min-h-screen bg-coastal-50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* ==================================================================
            SIDEBAR FILTRI (Zustand State)
            ================================================================== */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-coastal-100 sticky top-28">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-coastal-100">
              <SlidersHorizontal className="text-gold w-5 h-5" />
              <h2 className="text-lg font-medium text-coastal-900">Filtra Flotta</h2>
            </div>

            <div className="space-y-6">
              {/* Filtro Date */}
              <div>
                <label className="block text-sm font-medium text-coastal-700 mb-2">Date di Navigazione</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg border border-coastal-200 text-coastal-800 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                    value={filters.startDate || ""}
                    onChange={(e) => setFilters({ startDate: e.target.value || null })}
                  />
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg border border-coastal-200 text-coastal-800 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                    value={filters.endDate || ""}
                    onChange={(e) => setFilters({ endDate: e.target.value || null })}
                  />
                </div>
              </div>

              {/* Filtro Prezzo Massimo */}
              <div>
                <label className="block text-sm font-medium text-coastal-700 mb-2">
                  Prezzo Max: € {filters.maxPrice >= 999999 ? "Illimitato" : filters.maxPrice}
                </label>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  className="w-full accent-gold"
                  value={filters.maxPrice >= 999999 ? 20000 : filters.maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters({ maxPrice: val === 20000 ? 999999 : val });
                  }}
                />
              </div>

              {/* Filtro Capacità Ospiti */}
              <div>
                <label className="block text-sm font-medium text-coastal-700 mb-2">Ospiti Minimi ({filters.minGuests})</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  className="w-full accent-gold"
                  value={filters.minGuests}
                  onChange={(e) => setFilters({ minGuests: Number(e.target.value) })}
                />
              </div>

              {/* Filtro Lunghezza */}
              <div>
                <label className="block text-sm font-medium text-coastal-700 mb-2">Lunghezza Min. ({filters.minLength}m)</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  className="w-full accent-gold"
                  value={filters.minLength}
                  onChange={(e) => setFilters({ minLength: Number(e.target.value) })}
                />
              </div>

              {/* Filtro Lusso (Tier) */}
              <div>
                <label className="block text-sm font-medium text-coastal-700 mb-2">Categoria Lusso (Min {filters.minLuxuryTier}★)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  className="w-full accent-gold"
                  value={filters.minLuxuryTier}
                  onChange={(e) => setFilters({ minLuxuryTier: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================================
            GRIGLIA RISULTATI
            ================================================================== */}
        <main className="flex-1">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
              {error}
            </div>
          )}

          {isLoading ? (
            /* Skeleton Loading State Elegante */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-coastal-100" />
              ))}
            </div>
          ) : results.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 text-center border border-coastal-100 flex flex-col items-center justify-center h-80">
              <Anchor className="w-12 h-12 text-coastal-300 mb-4 stroke-[1.5]" />
              <h3 className="text-xl font-medium text-coastal-900 mb-2">Nessuno yacht disponibile</h3>
              <p className="text-coastal-500 font-light">Provi a modificare i filtri o le date di navigazione per ampliare la ricerca.</p>
            </div>
          ) : (
            /* Card Imbarcazioni */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((yacht) => (
                <div key={yacht.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-coastal-100 group cursor-pointer">
                  <div className="relative h-56 bg-coastal-200 overflow-hidden">
                    {/* Immagine dell'imbarcazione allineata al database */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ 
                        backgroundImage: yacht.image_url
                          ? `url('${yacht.image_url}')` 
                          : "url('https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000')" 
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-coastal-900 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      {yacht.luxury_tier}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-coastal-900 line-clamp-1">{yacht.name}</h3>
                      <span className="text-lg font-medium text-coastal-900">€{yacht.price_per_day}</span>
                    </div>
                    <p className="text-sm text-coastal-500 mb-4 font-light">{yacht.port_location}</p>
                    <div className="flex items-center gap-4 text-sm text-coastal-600 border-t border-coastal-100 pt-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-coastal-400" />
                        <span>{yacht.passenger_capacity} Ospiti</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ruler className="w-4 h-4 text-coastal-400" />
                        <span>{yacht.length_meters}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// WRAPPER DI PAGINA CON SUSPENSE (Prevenzione errori Build Next.js)
// ============================================================================
export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-coastal-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Anchor className="w-8 h-8 text-gold mb-4 animate-bounce" />
            <p className="text-coastal-500 font-light tracking-widest uppercase text-sm">Inizializzazione flotta...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}