export function getBillingSummarySnapshot({ platform, creatorId, membership }) {
  const earnings = (platform.creatorEarnings || []).find((item) => item.creatorId === creatorId) || {};
  const gross = Number(earnings.advertisingRevenue || 0) + Number(earnings.subscriptionShare || 0) + Number(earnings.singleTitleSales || 0) + Number(earnings.episodeUnlockSales || 0);
  const deductions = Number(earnings.addOnServiceCosts || 0) + Number(earnings.platformCommission || 0);

  return {
    viewer: {
      plan: membership?.tier || 'free',
      unlocks: membership?.tier === 'free' ? 'Preview episodes and trailer' : 'Member catalog + plan perks',
      stillPaid: 'Some titles or finale/episode unlocks can still be separately priced by creator.',
    },
    creator: {
      monthlyFeeCovers: 'Studio tools, upload quota, moderation workflow, analytics, and operational support.',
      commissionRule: 'Commission applies only after creator revenue exists in the cycle.',
      gross,
      deductions,
      netPayout: Number(earnings.netEarnings || Math.max(gross - deductions, 0)),
      lines: [
        ['Advertising revenue', Number(earnings.advertisingRevenue || 0)],
        ['Subscription pool share', Number(earnings.subscriptionShare || 0)],
        ['Title sales', Number(earnings.singleTitleSales || 0)],
        ['Episode unlock sales', Number(earnings.episodeUnlockSales || 0)],
        ['Add-on expenses', -Number(earnings.addOnServiceCosts || 0)],
        ['Platform commission', -Number(earnings.platformCommission || 0)],
      ],
    },
  };
}
