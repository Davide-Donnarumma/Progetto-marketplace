import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // 1. Estrazione dei dati inviati dal browser
    const body = await request.json();
    const { yachtId, days } = body;

    if (!yachtId || !days || days < 1) {
      return NextResponse.json(
        { error: "Dati mancanti o non validi" },
        { status: 400 },
      );
    }

    // 2. Verifica dell'autenticazione tramite Supabase (Protezione Rotta)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorizzato. Effettui l'accesso." },
        { status: 401 },
      );
    }

    // 3. Recupero SICURO del prezzo dal database (Prevenzione frodi)
    const { data: yacht, error: dbError } = await supabase
      .from("yachts")
      .select("price_per_day, name")
      .eq("id", yachtId)
      .single();

    if (dbError || !yacht) {
      return NextResponse.json(
        { error: "Imbarcazione non trovata" },
        { status: 404 },
      );
    }

    // 4. Calcolo dell'importo totale in centesimi (formato matematico richiesto da Stripe)
    const amountInCents = Math.round(yacht.price_per_day * days * 100);

    // 5. Creazione del Payment Intent su Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      // Abilita i metodi di pagamento automatici (Carte, Apple Pay, Google Pay)
      automatic_payment_methods: {
        enabled: true,
      },
      // I metadati ci serviranno per identificare la transazione nel Webhook finale
      metadata: {
        yachtId: yachtId,
        userId: user.id,
        days: days.toString(),
      },
    });

    // 6. Restituzione della chiave temporanea (client_secret) al frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Errore critico in fase di generazione pagamento:", error);
    return NextResponse.json(
      { error: "Si è verificato un errore interno durante l'elaborazione" },
      { status: 500 },
    );
  }
}
