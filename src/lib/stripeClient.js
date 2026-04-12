export async function createStripeCheckoutSession({ priceId, email }) {
  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT;

  if (!endpoint) {
    return {
      mode: 'mock',
      url: `/pricing?mockCheckout=1&priceId=${priceId}&email=${encodeURIComponent(email || '')}`,
      message: 'Stripe endpoint is missing, using mock checkout.',
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, email }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Stripe checkout session');
  }

  return response.json();
}
