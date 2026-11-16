
import api from "../../api/api";
import Swal from "sweetalert2";

/**
 * Start Paystack checkout for a selected plan.
 *
 * Plans: "trial" | "pro" | "employer_post"
 */
export async function startCheckout(plan, navigate) {
  const signinUrl = `/signin?plan=${encodeURIComponent(plan)}`;

  // Display SweetAlert when authentication is required.
  const requireSignIn = async () => {
    const result = await Swal.fire({
      icon: "info",
      title: "Sign In Required",
      html: `
        <p style="color:#64748b;font-size:15px;line-height:1.7">
          Please sign in to your Quantahire account
          to continue with your selected plan.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Sign In",
      cancelButtonText: "Not Now",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      reverseButtons: true,
      allowOutsideClick: true,
      customClass: {
        popup: "rounded-2xl",
      },
    });

    if (result.isConfirmed) {
      navigate(signinUrl);
    }
  };

  // 1. Check if the user has an access token.
  const token =
    localStorage.getItem("access") ||
    sessionStorage.getItem("access");

  if (!token) {
    await requireSignIn();
    return;
  }

  // 2. Initialize checkout through Django.
  try {
    const { data } = await api.post("/billing/checkout/", {
      plan,
    });

    if (!data?.authorization_url) {
      throw new Error(
        "Payment link missing from checkout response."
      );
    }

    // 3. Redirect to Paystack hosted checkout.
    window.location.assign(data.authorization_url);
  } catch (error) {
    // Token expired, revoked, or invalid.
    if ([401, 403].includes(error?.response?.status)) {
      localStorage.removeItem("access");
      sessionStorage.removeItem("access");

      await requireSignIn();
      return;
    }

    // Other errors: payment server, network, etc.
    await Swal.fire({
      icon: "error",
      title: "Checkout Failed",
      text:
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Unable to start checkout. Please try again.",
      confirmButtonColor: "#2563EB",
    });
  }
}
