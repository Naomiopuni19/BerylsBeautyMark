// Thin wrapper around Paystack Inline JS, loaded via the script tag in
// index.html. This is the fast, client side confirmed version, see the
// README note about adding server side verification before real launch.

export function payWithPaystack({ email, amountGHS, metadata, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment could not start, please refresh the page and try again.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(amountGHS * 100), // Paystack expects the smallest currency unit
    currency: "GHS",
    metadata: metadata || {},
    callback: (response) => onSuccess(response),
    onClose: () => onClose && onClose(),
  });

  handler.openIframe();
}