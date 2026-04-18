import { normalizeArray, pickFirst } from './utils';

export function normalizeCreator(creator = {}) {
  const id = pickFirst(creator, ['id'], '');
  if (!id) return null;
  return {
    ...creator,
    id,
    profileId: pickFirst(creator, ['profileId', 'profile_id'], ''),
    defaultTakeRate: Number(pickFirst(creator, ['defaultTakeRate', 'platformTakeRate'], 0.2)),
    platformTakeRate: Number(pickFirst(creator, ['platformTakeRate', 'defaultTakeRate'], 0.2)),
    studioName: pickFirst(creator, ['studioName', 'studio_name'], 'Unknown Studio'),
  };
}

export function normalizeCreatorList(items) {
  return normalizeArray(items, normalizeCreator);
}
