import { createStripeCheckoutSession } from '../stripeClient';

function buildCheckoutUrls(checkoutType, extraParams = {}) {
  const params = new URLSearchParams({ type: checkoutType, ...extraParams });
  return {
    successUrl: `${window.location.origin}/checkout/success?${params.toString()}`,
    cancelUrl: `${window.location.origin}/checkout/cancel?${params.toString()}`,
  };
}

export async function startViewerCheckout({ plan, user }) {
  return createStripeCheckoutSession({
    checkoutType: 'viewer_subscription',
    planId: plan.id,
    ...buildCheckoutUrls('viewer_subscription', { plan: plan.id, target: '/profile' }),
    customerEmail: user?.email,
  });
}

export async function startCreatorPlanCheckout({ plan, user }) {
  return createStripeCheckoutSession({
    checkoutType: 'creator_plan',
    planId: plan.id,
    ...buildCheckoutUrls('creator_plan', { plan: plan.id, target: '/creator#overview' }),
    customerEmail: user?.email,
  });
}

export async function startAddonCheckout({ service, user, orderId }) {
  return createStripeCheckoutSession({
    checkoutType: 'addon_purchase',
    addonId: service.id,
    orderId,
    ...buildCheckoutUrls('addon_purchase', { addon: service.id, orderId, target: `/services/${orderId}` }),
    customerEmail: user?.email,
  });
}
