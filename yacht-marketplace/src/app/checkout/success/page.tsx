import Link from "next/link";
import { CheckCircle, Anchor, Calendar, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-coastal-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-coastal-100 p-8 text-center relative overflow-hidden">
        {/* Dettaglio dorato superiore in stile Coastal Elegance */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-gold-light via-gold to-gold-light" />
        
        <div className="flex justify-center mb-6 mt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <CheckCircle className="w-16 h-16 text-green-600 relative z-10 bg-white rounded-full" />
          </div>
        </div>

        <h1 className="text-3xl font-light text-coastal-900 mb-2">Prenotazione Confermata</h1>
        <p className="text-coastal-500 font-light mb-8">
          Il Suo pagamento è stato elaborato con successo e i fondi sono stati temporaneamente bloccati. L&apos;armatore è stato informato della Sua richiesta.
        </p>

        <div className="bg-coastal-50 rounded-2xl p-6 mb-8 border border-coastal-100 text-left">
          <h3 className="font-medium text-coastal-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" /> Riepilogo Sicurezza
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-coastal-200 pb-2">
              <span className="text-coastal-500">Stato Pagamento</span>
              <span className="font-medium text-green-600">Autorizzato</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-coastal-500">Gateway Finanziario</span>
              <span className="font-medium text-coastal-900">Stripe Inc.</span>
            </div>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-coastal-900 hover:bg-coastal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coastal-900 transition-colors"
        >
          Torna alla Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-12 text-center">
        <Anchor className="w-8 h-8 text-gold mx-auto mb-2 opacity-40" />
        <p className="text-xs text-coastal-400">Yacht Marketplace © 2026</p>
      </div>
    </div>
  );
}