"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2, Anchor } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AddYachtPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [length, setLength] = useState(""); 
  const [luxuryTier, setLuxuryTier] = useState(""); 
  const [portLocation, setPortLocation] = useState(""); 
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utente non autenticato. Sessione scaduta.");
      if (!image) throw new Error("È obbligatorio caricare una fotografia dell'imbarcazione.");

      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('yacht_images')
        .upload(filePath, image, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error("Errore durante il caricamento dell'immagine nel server.");

      const { data: publicUrlData } = supabase.storage
        .from('yacht_images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('yachts')
        .insert({
          name: name,
          description: description,
          price_per_day: parseFloat(price),
          passenger_capacity: parseInt(capacity),
          length_meters: parseFloat(length),
          luxury_tier: parseInt(luxuryTier),
          port_location: portLocation,
          image_url: publicUrlData.publicUrl,
          host_id: user.id 
        });

      if (insertError) throw new Error("Errore DB: " + insertError.message);

      router.push('/host/dashboard');
      router.refresh();

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Si è verificato un errore critico imprevisto.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/host/dashboard" className="inline-flex items-center text-sm font-medium text-coastal-500 hover:text-coastal-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Torna alla Flotta
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-coastal-100 overflow-hidden">
        <div className="p-8 border-b border-coastal-100 bg-coastal-50/50">
          <h2 className="text-2xl font-light text-coastal-900 flex items-center gap-3">
            <Anchor className="w-6 h-6 text-gold" /> Registrazione Nuova Imbarcazione
          </h2>
          <p className="text-coastal-500 mt-2 text-sm">
            Inserisca i dettagli tecnici e commerciali per pubblicare il Suo yacht sulla piattaforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-coastal-900">Nome dell&apos;Imbarcazione</label>
              <input 
                type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="es. Ferretti 780"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-coastal-900">Porto di Stazionamento</label>
              <input 
                type="text" required
                value={portLocation} onChange={(e) => setPortLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="es. Marina di Capri"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-coastal-900">Capacità (Ospiti)</label>
              <input 
                type="number" required min="1"
                value={capacity} onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="es. 12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-coastal-900">Lunghezza (Metri)</label>
              <input 
                type="number" required min="1" step="0.1"
                value={length} onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="es. 22.5"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-coastal-900">Categoria Lusso</label>
              <select 
                required
                value={luxuryTier} onChange={(e) => setLuxuryTier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              >
                <option value="" disabled>Selezioni una categoria</option>
                <option value="1">Premium (Livello 1)</option>
                <option value="2">Luxury (Livello 2)</option>
                <option value="3">Superyacht (Livello 3)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-coastal-900">Descrizione Dettagliata</label>
            <textarea 
              required rows={4}
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              placeholder="Descriva le peculiarità del Suo yacht, i comfort a bordo e l'esperienza offerta..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-coastal-900">Tariffa Giornaliera (€)</label>
            <input 
              type="number" required min="1" step="0.01"
              value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-coastal-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="es. 1500"
            />
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-sm font-medium text-coastal-900 mb-2 block">Fotografia Principale</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-coastal-200 border-dashed rounded-2xl cursor-pointer bg-coastal-50 hover:bg-coastal-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-coastal-400 mb-3" />
                <p className="mb-2 text-sm text-coastal-600">
                  <span className="font-semibold text-gold">Clicchi per caricare</span> o trascini il file
                </p>
                <p className="text-xs text-coastal-400">PNG, JPG o WEBP (MAX. 5MB)</p>
              </div>
              <input 
                type="file" className="hidden" accept="image/*" required
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              />
            </label>
            {image && <p className="text-sm text-green-600 mt-2">File selezionato: {image.name}</p>}
          </div>

          <div className="pt-6 border-t border-coastal-100 flex justify-end">
            <button 
              type="submit" disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 bg-coastal-900 hover:bg-coastal-800 text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Elaborazione in corso...</>
              ) : (
                "Pubblica Imbarcazione"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}