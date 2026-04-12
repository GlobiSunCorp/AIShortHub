const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT;

export async function createStripeCheckoutSession(payload) {
  if (!endpoint) {
    return {
      mode: 'mock',
      url: `/checkout/success?mock=1&type=${payload.checkoutType}`,
      message: 'Stripe endpoint is missing, using mock checkout.',
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to create Stripe checkout session');
  return response.json();
}
