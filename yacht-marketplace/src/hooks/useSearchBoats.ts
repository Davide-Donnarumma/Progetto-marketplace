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

  // Idratazione Iniziale
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

  // Debouncing e Chiamata RPC
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

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

      try {
        const { data, error: supabaseError } = await supabase.rpc(
          "search_available_yachts",
          {
            p_start_date: filters.startDate || undefined,
            p_end_date: filters.endDate || undefined,
            p_min_length: filters.minLength,
            p_min_guests: filters.minGuests,
            p_min_luxury_tier: filters.minLuxuryTier,
            p_min_price: filters.minPrice,
            p_max_price: filters.maxPrice,
          },
        );

        if (supabaseError) throw supabaseError;
        setResults(data || []);
      } catch (err) {
        console.error("Errore critico durante il fetching della RPC:", err);
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
