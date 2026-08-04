"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Anchor, Mail, Lock, User as UserIcon, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Gestione Autenticazione Tradizionale (Email/Password)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: 'GUEST',
            },
            emailRedirectTo: `${window.location.origin}/callback`,
          },
        });

        if (signUpError) throw signUpError;
        
        // Messaggio di conferma per la verifica Email
        setSuccessMessage("Registrazione completata! Abbiamo inviato un link di verifica al Suo indirizzo email. Per favore, controlli la Sua casella di posta.");

      } else {
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
      if (err instanceof Error) {
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

  // 2. Gestione Autenticazione OAuth (Social Login)
  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      if (err instanceof Error) {
        setError(`Si è verificato un errore durante l'accesso con ${provider}: ${err.message}`);
      }
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
          
          {/* Pulsanti Social Login */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-coastal-200 rounded-full shadow-sm bg-white text-sm font-medium text-coastal-700 hover:bg-coastal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continua con Google
            </button>
            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-transparent rounded-full shadow-sm bg-black text-sm font-medium text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M16.365 21.444c-1.343 1.4-2.899 1.343-4.148.694-1.258-.65-2.909-.694-4.241 0-1.249.65-2.695.748-4.049-.694-3.18-3.414-5.498-10.155-2.227-14.777 1.55-2.187 3.824-3.565 6.195-3.606 1.706-.033 3.35 1.144 4.408 1.144 1.058 0 3.072-1.42 5.122-1.211 2.164.212 4.143 1.282 5.253 3.109-4.57 2.822-3.844 9.176 1.066 11.206-1.026 2.585-2.651 5.434-4.229 7.025-1.579 1.591-3.159 1.542-3.159 1.542zM15.111 6.367c.875-1.045 1.464-2.511 1.306-3.957-1.254.05-2.774.845-3.678 1.91-.799.932-1.488 2.441-1.301 3.849 1.401.109 2.802-.756 3.673-1.802z" />
              </svg>
              Continua con Apple
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-coastal-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-coastal-400 font-light">O proceda tramite email</span>
            </div>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* Form Tradizionale (Nascosto se la registrazione è appena avvenuta) */}
          {!successMessage && (
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
                        placeholder="Nome"
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
                      placeholder="Cognome"
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
                  "Registrati con Email"
                ) : (
                  "Accedi"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMessage(null);
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