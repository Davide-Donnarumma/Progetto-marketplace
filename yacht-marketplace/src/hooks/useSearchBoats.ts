import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

type Yacht = Database["public"]["Tables"]["yachts"]["Row"];

export function useSearchBoats() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useSearchStore();

  const [results, setResults] = useState<Yacht[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Idratazione Iniziale dallo URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setFilters({
      startDate: params.get("startDate") || null,
      endDate: params.get("endDate") || null,
      minLength: Number(params.get("minLength")) || 0,
      minGuests: Number(params.get("minGuests")) || 1,
      minLuxuryTier: Number(params.get("minLuxuryTier")) || 1,
      minPrice: Number(params.get("minPrice")) || 0,
      maxPrice: Number(params.get("maxPrice")) || 999999,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debouncing e Chiamata al Database tramite Query Dinamica
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      // 1. Aggiornamento dell'URL per la condivisibilità
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      if (filters.minLength > 0)
        params.set("minLength", filters.minLength.toString());
      if (filters.minGuests > 1)
        params.set("minGuests", filters.minGuests.toString());
      if (filters.minLuxuryTier > 1)
        params.set("minLuxuryTier", filters.minLuxuryTier.toString());
      if (filters.minPrice > 0)
        params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice < 999999)
        params.set("maxPrice", filters.maxPrice.toString());

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      // 2. Costruzione ed Esecuzione della Query Supabase
      try {
        let query = supabase.from("yachts").select("*");

        // Applichiamo i filtri solo se l'utente li ha modificati
        if (filters.minLength > 0) {
          query = query.gte("length_meters", filters.minLength);
        }
        if (filters.minGuests > 1) {
          query = query.gte("passenger_capacity", filters.minGuests);
        }
        if (filters.minLuxuryTier > 1) {
          query = query.gte("luxury_tier", filters.minLuxuryTier);
        }
        if (filters.minPrice > 0) {
          query = query.gte("price_per_day", filters.minPrice);
        }
        if (filters.maxPrice < 999999) {
          query = query.lte("price_per_day", filters.maxPrice);
        }

        /* 
          Nota sulle date: Il filtraggio per data (startDate, endDate) 
          richiederà in futuro l'interrogazione di una tabella "bookings" 
          per verificare le sovrapposizioni. Al momento, applichiamo i 
          filtri strutturali e commerciali.
        */

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        setResults(data || []);
      } catch (err) {
        console.error("Errore critico durante il fetching della flotta:", err);
        setError(
          "Si è verificato un errore durante la ricerca delle imbarcazioni. La preghiamo di riprovare.",
        );
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, pathname, router, supabase]);

  return { results, isLoading, error };
}
