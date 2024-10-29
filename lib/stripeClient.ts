import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_NEXT_PUBLISHABLE_KEY || "";
export const getStripe = () => loadStripe(STRIPE_PUBLISHABLE_KEY);
