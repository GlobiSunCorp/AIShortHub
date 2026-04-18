import { normalizeArray, normalizeTimestamp, pickFirst } from './utils';

export function normalizePayment(payment = {}) {
  const id = pickFirst(payment, ['id'], '');
  if (!id) return null;
  return {
    ...payment,
    id,
    profileId: pickFirst(payment, ['profileId', 'profile_id'], ''),
    createdAt: normalizeTimestamp(payment),
    renewAt: pickFirst(payment, ['renewAt', 'renew_at'], null),
    status: pickFirst(payment, ['status'], 'pending'),
    amount: Number(pickFirst(payment, ['amount'], 0)),
  };
}

export function normalizePayout(payout = {}) {
  const id = pickFirst(payout, ['id'], '');
  if (!id) return null;
  return {
    ...payout,
    id,
    creatorId: pickFirst(payout, ['creatorId', 'creator_id'], ''),
    createdAt: normalizeTimestamp(payout),
    status: pickFirst(payout, ['status'], 'pending'),
    netAmount: Number(pickFirst(payout, ['netAmount', 'net_amount'], 0)),
  };
}

export function normalizePaymentList(items) {
  return normalizeArray(items, normalizePayment);
}

export function normalizePayoutList(items) {
  return normalizeArray(items, normalizePayout);
}
