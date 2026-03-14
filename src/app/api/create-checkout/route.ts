import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { routeKey: "create-checkout", maxRequests: 10, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "STRIPE_NOT_CONFIGURED" }, { status: 503 });
  }

  try {
    const { returnUrl } = (await request.json()) as { returnUrl?: string };

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "GBP Optimization Report" },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      success_url: `${returnUrl || request.nextUrl.origin + "/audit"}?payment=success`,
      cancel_url: `${returnUrl || request.nextUrl.origin + "/audit"}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[create-checkout]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
