import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { billingCycle = "monthly" } = await req.json();
    const isYearly = billingCycle === "yearly";

    // Check if real Stripe secret key is present
    const hasRealStripe =
      process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes("placeholder");

    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (hasRealStripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Ledgerly Pro (${isYearly ? "Annual" : "Monthly"})`,
                description: "Unlimited clients, custom invoice branding, high-res PDF generation",
              },
              unit_amount: isYearly ? 19000 : 1900,
              recurring: {
                interval: isYearly ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/settings?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
        cancel_url: `${appUrl}/settings?canceled=true`,
        metadata: {
          userId: user.id,
        },
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Demo / Test Mode: automatically upgrade user to Pro and redirect
      await prisma.user.update({
        where: { id: user.id },
        data: { isPro: true },
      });

      return NextResponse.json({
        url: `${appUrl}/settings?upgraded=true&mode=demo`,
        mockSuccess: true,
      });
    }
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
