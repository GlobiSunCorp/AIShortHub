import { createStripeCheckoutSession } from '../stripeClient';

export async function startViewerCheckout({ plan, user }) {
  return createStripeCheckoutSession({
    checkoutType: 'viewer_subscription',
    planId: plan.id,
    successUrl: `${window.location.origin}/checkout/success`,
    cancelUrl: `${window.location.origin}/checkout/cancel`,
    customerEmail: user?.email,
  });
}

export async function startCreatorPlanCheckout({ plan, user }) {
  return createStripeCheckoutSession({
    checkoutType: 'creator_plan',
    planId: plan.id,
    successUrl: `${window.location.origin}/checkout/success`,
    cancelUrl: `${window.location.origin}/checkout/cancel`,
    customerEmail: user?.email,
  });
}

export async function startAddonCheckout({ service, user, orderId }) {
  return createStripeCheckoutSession({
    checkoutType: 'addon_purchase',
    addonId: service.id,
    orderId,
    successUrl: `${window.location.origin}/checkout/success`,
    cancelUrl: `${window.location.origin}/checkout/cancel`,
    customerEmail: user?.email,
  });
}
