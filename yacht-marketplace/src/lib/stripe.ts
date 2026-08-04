import Stripe from "stripe";

// Verifica rigorosa della presenza della chiave segreta
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY non è configurata nel file .env.local");
}

// Inizializzazione dell'istanza con la versione API esatta richiesta dall'SDK
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-07-29.dahlia",
  typescript: true,
  appInfo: {
    name: "Yacht Marketplace",
    version: "1.0.0",
  },
});
