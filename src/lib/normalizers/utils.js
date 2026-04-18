export const pickFirst = (obj, keys, fallback = null) => {
  if (!obj) return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
};

export const normalizeTimestamp = (obj) => pickFirst(obj, ['createdAt', 'created_at'], '');

export const normalizeArray = (items, normalizer) => (Array.isArray(items) ? items.map((item) => normalizer(item)).filter(Boolean) : []);
