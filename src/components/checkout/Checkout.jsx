import api from "../../api/api";
/**
 * Starts a Paystack checkout for a plan.
 *
 * Expects a Django endpoint that calls Paystack's /transaction/initialize
 * with your SECRET key (never expose it in React) and returns
 * { authorization_url }. Paystack then shows its hosted payment page
 * (card, M-Pesa, mobile money) and redirects back to your callback URL.
 *
 * Plans: "trial" | "pro" | "employer_post"
 */
export async function startCheckout(plan, navigate) {
  try {
    const { data } = await api.post("/billing/checkout/", { plan });

    if (!data?.authorization_url) {
      throw new Error("Payment link missing from checkout response.");
    }

    window.location.assign(data.authorization_url);
  } catch (error) {
    // Not signed in yet: create the account first, then resume checkout.
    if (error?.response?.status === 401) {
      navigate(`/register?plan=${encodeURIComponent(plan)}`);
      return;
    }
    throw error;
  }
}