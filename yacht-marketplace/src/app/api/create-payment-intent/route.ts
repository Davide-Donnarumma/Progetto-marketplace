import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

// Inizializzazione sicura di Stripe lato server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Identificativo prenotazione mancante" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Interroghiamo la tabella bookings per estrarre l'importo totale
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Prenotazione non trovata nel sistema" },
        { status: 404 },
      );
    }

    // Stripe richiede che gli importi siano calcolati nell'unità base della valuta (centesimi per l'Euro)
    const amountInCents = Math.round(booking.total_price * 100);

    // Creazione del Payment Intent con i metadati per la riconciliazione contabile
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_id: booking.id,
        yacht_id: booking.yacht_id,
        guest_id: booking.guest_id,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Errore di connessione con il provider di pagamento" },
      { status: 500 },
    );
  }
}
