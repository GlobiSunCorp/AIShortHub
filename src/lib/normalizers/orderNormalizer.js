import { normalizeArray, normalizeTimestamp, pickFirst } from './utils';

export function normalizeOrder(order = {}) {
  const id = pickFirst(order, ['id'], '');
  if (!id) return null;
  return {
    ...order,
    id,
    requesterId: pickFirst(order, ['requesterId', 'requester_id'], ''),
    createdAt: normalizeTimestamp(order),
    updatedAt: pickFirst(order, ['updatedAt', 'updated_at'], ''),
    serviceType: pickFirst(order, ['serviceType', 'service_type'], 'Unknown service'),
    reviewNote: pickFirst(order, ['reviewNote', 'review_note', 'admin_note'], ''),
    status: pickFirst(order, ['status'], 'pending'),
  };
}

export function normalizeOrderList(items) {
  return normalizeArray(items, normalizeOrder);
}
