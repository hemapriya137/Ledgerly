import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_testing", {
  apiVersion: "2024-04-10" as any,
  typescript: true,
});
