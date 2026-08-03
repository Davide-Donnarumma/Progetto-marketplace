"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Anchor, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Flusso di Registrazione
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: 'GUEST', // Ruolo predefinito alla registrazione
            },
            emailRedirectTo: `${window.location.origin}/callback`,
          },
        });

        if (signUpError) throw signUpError;
        
        // Autenticazione andata a buon fine, reindirizzamento alla griglia di ricerca
        router.push("/search");
        router.refresh();

      } else {
        // Flusso di Accesso
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        router.push("/search");
        router.refresh();
      }
    } catch (err) {
      console.error("Errore di autenticazione:", err);
      
      // Controllo di tipo rigoroso richiesto da TypeScript
      if (err instanceof Error) {
        // Traduzione degli errori più comuni per migliorare l'esperienza utente
        if (err.message.includes("Invalid login")) {
          setError("Credenziali non valide. Verifichi l'indirizzo email e la password.");
        } else if (err.message.includes("already registered")) {
          setError("Questo indirizzo email è già registrato nel sistema.");
        } else if (err.message.includes("Password should be at least")) {
          setError("La password deve contenere almeno 6 caratteri.");
        } else {
          setError(err.message || "Si è verificato un errore imprevisto.");
        }
      } else {
        setError("Si è verificato un errore critico di sistema.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coastal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <Anchor className="w-12 h-12 text-gold mx-auto stroke-[1.5]" />
        </Link>
        <h2 className="mt-6 text-3xl font-light text-coastal-900 tracking-tight">
          {isSignUp ? "Creazione Account" : "Accesso Riservato"}
        </h2>
        <p className="mt-2 text-sm text-coastal-500 font-light">
          {isSignUp ? "Entri a far parte della nostra flotta esclusiva." : "Bentornato a bordo."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-coastal-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-coastal-700 mb-1">Nome</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-coastal-300" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      required={isSignUp}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-coastal-200 rounded-lg focus:ring-gold focus:border-gold sm:text-sm text-coastal-900 placeholder-coastal-300"
                      placeholder="Il Suo Nome"
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-coastal-700 mb-1">Cognome</label>
                  <input
                    type="text"
                    name="lastName"
                    required={isSignUp}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-coastal-200 rounded-lg focus:ring-gold focus:border-gold sm:text-sm text-coastal-900 placeholder-coastal-300"
                    placeholder="Il Suo Cognome"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-coastal-700 mb-1">Indirizzo Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-coastal-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-coastal-200 rounded-lg focus:ring-gold focus:border-gold sm:text-sm text-coastal-900 placeholder-coastal-300"
                  placeholder="email@esempio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-coastal-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-coastal-300" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-coastal-200 rounded-lg focus:ring-gold focus:border-gold sm:text-sm text-coastal-900 placeholder-coastal-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-coastal-900 bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSignUp ? (
                "Crea il Suo Account"
              ) : (
                "Accedi"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm font-medium text-coastal-500 hover:text-coastal-900 transition-colors"
            >
              {isSignUp
                ? "Dispone già di un account? Acceda."
                : "Non dispone di un account? Si registri ora."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}