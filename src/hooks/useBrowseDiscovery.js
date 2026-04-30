import { useMemo } from 'react';
import { getCatalogSnapshot } from '../lib/selectors/getCatalogSnapshot';

const CATEGORY_TAXONOMY = [
  'Cinematic', 'Vertical', 'Animation', 'Music Video', 'Trailer', 'Commercial', 'Product Video', 'Experimental',
  'Sci-Fi', 'Horror', 'Comedy', 'Drama', 'Fantasy', 'Suspense', 'Thriller', 'Historical',
  'Romance', 'Mystery', 'Urban', 'Workplace', 'Campus / Youth', 'Rebirth / Return', 'Palace / Period',
];

const SORT_OPTIONS = [
  'Featured', 'Newest', 'Trending', 'Most Watched', 'Most Completed', 'Highest Rated',
  'Recently Updated', 'Free Preview', 'Subscription Included', 'Paid Unlock',
];

const QUICK_FILTERS = ['Free Preview', 'Full Access', 'Paid Unlock', 'Trending', 'New This Week', 'Commercial Ready', 'Creator Showcase'];
const HOT_KEYWORDS = [
  'cinematic ai short',
  'vertical trailer',
  'ai music video',
  'experimental short',
  'product video',
  'commercial ai video',
  'animation short',
  'creator showcase',
];

function textIncludes(text, query) {
  return (text || '').toLowerCase().includes(query);
}

function scoreMatch({ item, creatorName, query }) {
  if (!query) return 0;
  const tags = Array.isArray(item.tags) ? item.tags.join(' ') : '';
  const monetization = item.monetization || {};
  let score = 0;
  if (textIncludes(item.title, query)) score += 5;
  if (textIncludes(tags, query)) score += 4;
  if (textIncludes(creatorName, query)) score += 4;
  if (textIncludes(item.synopsis, query)) score += 3;
  if (textIncludes(item.category, query)) score += 2;
  if (textIncludes(item.contentFormat, query)) score += 2;
  if (textIncludes(item.creatorName, query)) score += 2;
  if (textIncludes(JSON.stringify(monetization), query)) score += 1;
  return score;
}

function inferContentType(item) {
  const monetization = item.monetization || {};
  const hasPreview = (monetization.freePreviewEpisodes || []).length > 0;
  const hasSubAccess = Boolean(monetization.subscriptionAccess?.proViewer || monetization.subscriptionAccess?.premiumViewer);
  if (hasPreview) return 'Free Preview';
  if (hasSubAccess) return 'Subscription Included';
  return 'Paid Unlock';
}

function matchesCommercialReady(item) {
  const text = `${item.title || ''} ${item.category || ''} ${(item.tags || []).join(' ')} ${item.synopsis || ''}`.toLowerCase();
  return text.includes('commercial') || text.includes('product') || text.includes('brand') || text.includes('promo');
}

function matchesCreatorShowcase(item) {
  const text = `${item.title || ''} ${(item.tags || []).join(' ')} ${item.synopsis || ''}`.toLowerCase();
  return text.includes('creator') || text.includes('showcase') || text.includes('experimental') || text.includes('cinematic');
}

export function useBrowseDiscovery(platform, filters) {
  return useMemo(() => {
    const catalog = getCatalogSnapshot(platform);
    const creators = platform?.creators || [];
    const creatorById = Object.fromEntries(creators.map((creator) => [creator.id, creator]));
    const keyword = (filters.query || '').trim().toLowerCase();
    const activeCategory = filters.category || 'All';
    const activeQuick = filters.quickFilter || 'All';

    const seriesWithMeta = catalog.allSeries.map((item) => {
      const creatorName = creatorById[item.creatorId]?.studioName || 'Independent creator';
      const contentType = inferContentType(item);
      const qualityScore = (item.monetization?.episodeUnlockPriceUsd || 0) * 40 + (item.tags?.length || 0) * 8;
      const watchScore = (item.id?.length || 1) * 11 + (item.createdAt || '').replace(/-/g, '').slice(-2) * 2;
      return {
        ...item,
        creatorName,
        contentType,
        watchScore,
        completeScore: Math.max(35, 88 - (item.status === 'pending_review' ? 22 : 0)),
        ratingScore: Math.min(4.9, 3.8 + qualityScore / 100),
        updatedAt: item.createdAt,
        matchScore: scoreMatch({ item, creatorName, query: keyword }),
      };
    });

    const searched = seriesWithMeta.filter((item) => {
      if (!keyword) return true;
      return item.matchScore > 0;
    });

    const categoryFiltered = searched.filter((item) => {
      if (activeCategory === 'All') return true;
      return item.category === activeCategory || (item.tags || []).includes(activeCategory);
    });

    const quickFiltered = categoryFiltered.filter((item) => {
      if (activeQuick === 'All') return true;
      if (activeQuick === 'Free Preview') return item.contentType === 'Free Preview';
      if (activeQuick === 'Full Access') return item.contentType === 'Subscription Included';
      if (activeQuick === 'Paid Unlock') return item.contentType === 'Paid Unlock';
      if (activeQuick === 'Trending') return catalog.trending.some((trend) => trend.id === item.id);
      if (activeQuick === 'New This Week') return item.createdAt >= '2026-04-11';
      if (activeQuick === 'Commercial Ready') return matchesCommercialReady(item);
      if (activeQuick === 'Creator Showcase') return matchesCreatorShowcase(item);
      return true;
    });

    const sorted = [...quickFiltered].sort((a, b) => {
      switch (filters.sort) {
        case 'Newest':
        case 'Recently Updated':
          return (b.updatedAt || '').localeCompare(a.updatedAt || '');
        case 'Trending':
          return b.watchScore - a.watchScore;
        case 'Most Watched':
          return b.watchScore - a.watchScore;
        case 'Most Completed':
          return b.completeScore - a.completeScore;
        case 'Highest Rated':
          return b.ratingScore - a.ratingScore;
        case 'Free Preview':
          return (a.contentType === 'Free Preview' ? -1 : 1);
        case 'Subscription Included':
          return (a.contentType === 'Subscription Included' ? -1 : 1);
        case 'Paid Unlock':
          return (a.contentType === 'Paid Unlock' ? -1 : 1);
        case 'Featured':
        default:
          return b.matchScore - a.matchScore || b.watchScore - a.watchScore;
      }
    });

    const suggestions = seriesWithMeta
      .filter((item) => keyword && item.matchScore > 0)
      .slice(0, 5)
      .map((item) => item.title);
    const fallbackRecommendations = catalog.trending.slice(0, 3);
    const activeFilters = [
      keyword ? `Search: ${filters.query}` : '',
      activeCategory !== 'All' ? `Category: ${activeCategory}` : '',
      filters.sort ? `Sort: ${filters.sort}` : '',
      activeQuick !== 'All' ? `Quick: ${activeQuick}` : '',
    ].filter(Boolean);

    return {
      catalog,
      categories: ['All', ...CATEGORY_TAXONOMY],
      sortOptions: SORT_OPTIONS,
      quickFilters: ['All', ...QUICK_FILTERS],
      hotKeywords: HOT_KEYWORDS,
      suggestions,
      activeFilters,
      result: sorted,
      fallbackRecommendations,
    };
  }, [filters.category, filters.query, filters.quickFilter, filters.sort, platform]);
}
