import { getCreatorPlan, getViewerPlan } from '../data/monetization';

export const DEMO_ROLE_OPTIONS = [
  { value: 'guest', label: 'Guest', role: 'guest', viewerPlan: 'free', creatorPlan: null },
  { value: 'member_free', label: 'Member / Free', role: 'member', viewerPlan: 'free', creatorPlan: null },
  { value: 'member_pro_viewer', label: 'Member / Pro Viewer', role: 'member', viewerPlan: 'pro_viewer', creatorPlan: null },
  { value: 'member_premium_viewer', label: 'Member / Premium Viewer', role: 'member', viewerPlan: 'premium_viewer', creatorPlan: null },
  { value: 'creator_basic', label: 'Creator / Basic', role: 'creator', viewerPlan: 'pro_viewer', creatorPlan: 'creator_basic' },
  { value: 'creator_pro', label: 'Creator / Pro', role: 'creator', viewerPlan: 'pro_viewer', creatorPlan: 'creator_pro' },
  { value: 'creator_studio', label: 'Creator / Studio', role: 'creator', viewerPlan: 'premium_viewer', creatorPlan: 'studio' },
  { value: 'admin', label: 'Admin', role: 'admin', viewerPlan: 'premium_viewer', creatorPlan: 'studio' },
];

export function formatViewerPlanLabel(planId) {
  return getViewerPlan(planId).name;
}

export function formatCreatorPlanLabel(planId) {
  return getCreatorPlan(planId).name.replace('Creator ', '');
}

export function getStatusLabel(userState, membershipTier, _userTier, creatorPlan) {
  if (userState === 'guest') return 'Status: Guest';
  if (userState === 'admin') return 'Status: Admin';
  if (userState === 'member') return `Status: Member / ${formatViewerPlanLabel(membershipTier)}`;
  if (userState === 'creator') return `Status: Creator / ${formatCreatorPlanLabel(creatorPlan)}`;
  return 'Status: Guest';
}
