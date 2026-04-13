import { createStripeCheckoutSession } from '../stripeClient';

function buildCheckoutUrls(checkoutType) {
  return {
    successUrl: `${window.location.origin}/checkout/success?type=${checkoutType}`,
    cancelUrl: `${window.location.origin}/checkout/cancel?type=${checkoutType}`,
  };
}

export async function startViewerCheckout({ plan, user }) {
  return createStripeCheckoutSession({
    checkoutType: 'viewer_subscription',
    planId: plan.id,
    ...buildCheckoutUrls('viewer_subscription'),
    customerEmail: user?.email,
  });
}

export async function startCreatorPlanCheckout({ plan, user }) {
  return createStripeCheckoutSession({
    checkoutType: 'creator_plan',
    planId: plan.id,
    ...buildCheckoutUrls('creator_plan'),
    customerEmail: user?.email,
  });
}

export async function startAddonCheckout({ service, user, orderId }) {
  return createStripeCheckoutSession({
    checkoutType: 'addon_purchase',
    addonId: service.id,
    orderId,
    ...buildCheckoutUrls('addon_purchase'),
    customerEmail: user?.email,
  });
}
