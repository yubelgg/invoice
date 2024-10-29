import { headers } from "next/headers";
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  console.log("webhooks");
  const body = await request.text();
  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    console.log("sig verifying");
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log("sig successful");
  } catch (error) {
    console.log("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed":
      const invoiceId = session.metadata?.invoiceId;

      if (invoiceId) {
        // update invoice status
        //
        // send confirmation email

        console.log(`Payment successful for invoice: ${invoiceId}`);
      }
      break;

    case "payment_intent.payment_failed":
      console.log("Payment failed:", session.id);
      break;
  }

  return NextResponse.json({ received: true });
}
