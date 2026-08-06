"use client";

import { use, useEffect, useState, FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Anchor, Lock, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Inizializzazione esterna di Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ============================================================================
// COMPONENTE FORM DI PAGAMENTO (Figlio di Elements)
// ============================================================================
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "La transazione non è andata a buon fine.");
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-sm text-base font-medium text-coastal-900 bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors disabled:opacity-70"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" /> Conferma e Autorizza
          </span>
        )}
      </button>
    </form>
  );
}

// ============================================================================
// PAGINA PRINCIPALE DI CHECKOUT
// ============================================================================
export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // Modifica Cruciale: L'ID nella barra degli indirizzi ora è quello della prenotazione
  const bookingId = resolvedParams.id;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }), // Inviamo l'ID della prenotazione al server
        });
        
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Impossibile inizializzare il pagamento.");
        }
      } catch {
        setError("Errore di rete. Verifichi la Sua connessione.");
      }
    };

    initializePayment();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-coastal-50 pt-24 pb-12 px-6">
      <div className="max-w-xl mx-auto">
        
        <div className="text-center mb-10">
          <Link href="/trips" className="inline-block mb-4">
            <Anchor className="w-10 h-10 text-gold mx-auto stroke-[1.5]" />
          </Link>
          <h1 className="text-3xl font-light text-coastal-900 tracking-tight">Checkout Sicuro</h1>
          <p className="mt-2 text-sm text-coastal-500 font-light">
            Transazione protetta tramite protocollo crittografato SSL.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-coastal-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-gold-light via-gold to-gold-light" />
          
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-coastal-100">
            <ShieldCheck className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-lg font-medium text-coastal-900">Autorizzazione di Pagamento</h2>
              <p className="text-sm text-coastal-500 font-light">Gestito da Stripe Payments</p>
            </div>
          </div>

          {error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
              {error}
            </div>
          ) : clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#D4AF37', 
                    colorBackground: '#ffffff',
                    colorText: '#0f172a',
                    colorDanger: '#ef4444',
                    fontFamily: 'system-ui, sans-serif',
                    borderRadius: '12px',
                  }
                }
              }}
            >
              <CheckoutForm /> 
            </Elements>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
              <p className="text-sm text-coastal-500 font-light">Connessione al gateway finanziario in corso...</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}