export function getBillingSummarySnapshot({ platform, creatorId, membership }) {
  const earnings = (platform.creatorEarnings || []).find((item) => item.creatorId === creatorId) || {};
  const singleVideoSales = Number(earnings.singleVideoSales ?? earnings.episodeUnlockSales ?? 0);
  const gross = Number(earnings.advertisingRevenue || 0) + Number(earnings.subscriptionShare || 0) + Number(earnings.singleTitleSales || 0) + singleVideoSales;
  const deductions = Number(earnings.addOnServiceCosts || 0) + Number(earnings.platformCommission || 0);

  return {
    viewer: {
      plan: membership?.tier || 'free',
      unlocks: membership?.tier === 'free' ? 'Trailer, teaser, and preview videos' : 'Member AI shorts catalog + plan perks',
      stillPaid: 'Some titles, special cuts, or single-video unlocks can still be separately priced by the creator.',
    },
    creator: {
      monthlyFeeCovers: 'Studio tools, upload quota, review workflow, analytics, and operational support.',
      commissionRule: 'Commission applies only after creator revenue exists in the cycle.',
      gross,
      deductions,
      netPayout: Number(earnings.netEarnings || Math.max(gross - deductions, 0)),
      lines: [
        ['Advertising revenue', Number(earnings.advertisingRevenue || 0)],
        ['Subscription pool share', Number(earnings.subscriptionShare || 0)],
        ['Title sales', Number(earnings.singleTitleSales || 0)],
        ['Single-video sales', singleVideoSales],
        ['Add-on expenses', -Number(earnings.addOnServiceCosts || 0)],
        ['Platform commission', -Number(earnings.platformCommission || 0)],
      ],
    },
  };
}
