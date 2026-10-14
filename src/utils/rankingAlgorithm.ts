import { Article, RankedArticle, AlgorithmWeights, RankingScoreBreakdown } from '../types/news';

export const DEFAULT_ALGORITHM_WEIGHTS: AlgorithmWeights = {
  recency: 0.35,
  authority: 0.35,
  engagement: 0.30,
};

/**
 * Calculates the ranking score breakdown and composite score for a news article.
 * @param article The news article with metadata
 * @param weights Configurable weights for recency, authority, and engagement
 * @param referenceTime Current time or latest article timestamp
 */
export function calculateArticleScore(
  article: Article,
  weights: AlgorithmWeights = DEFAULT_ALGORITHM_WEIGHTS,
  referenceTime: Date = new Date()
): RankingScoreBreakdown {
  const articleTime = new Date(article.timestamp).getTime();
  const refTime = referenceTime.getTime();
  const diffHours = Math.max(0, (refTime - articleTime) / (1000 * 60 * 60));

  // 1. Recency Score (Exponential half-life decay over 24 hours, min 20, max 100)
  // Decay formula: 100 * exp(-diffHours / 28)
  const recencyScore = Math.max(
    15,
    Math.min(100, Math.round(100 * Math.exp(-diffHours / 30)))
  );

  // 2. Source Authority Score (Normalized baseline from verified wire tier)
  const authorityScore = Math.max(50, Math.min(100, Math.round(article.sourceAuthority || 85)));

  // 3. User Engagement Velocity Score (Views + Shares + Bookmarks)
  // Scaled log-linearly so articles with 80k views & 4k shares reach 90-98, while lower engagement sits around 40-60
  const viewsVal = article.views || 10000;
  const sharesVal = article.shares || 1000;
  const bookmarksVal = article.bookmarksCount || Math.round(sharesVal * 0.4);

  const rawEngagement = (viewsVal / 1000) * 0.6 + (sharesVal / 100) * 1.5 + bookmarksVal * 0.05;
  const engagementScore = Math.max(25, Math.min(100, Math.round(rawEngagement)));

  // 4. Composite Total Score (Weighted Sum)
  const total =
    weights.recency * recencyScore +
    weights.authority * authorityScore +
    weights.engagement * engagementScore;

  const totalScore = Math.round(total * 10) / 10;

  return {
    recencyScore,
    authorityScore,
    engagementScore,
    totalScore,
    hoursAgo: Math.round(diffHours * 10) / 10,
  };
}

/**
 * Ranks all articles from various global sources using the multi-factor aggregation algorithm.
 */
export function rankArticles(
  articles: Article[],
  weights: AlgorithmWeights = DEFAULT_ALGORITHM_WEIGHTS,
  referenceTime: Date = new Date()
): RankedArticle[] {
  const scored = articles.map((article) => ({
    ...article,
    ranking: calculateArticleScore(article, weights, referenceTime),
  }));

  // Sort descending by total composite score
  scored.sort((a, b) => b.ranking.totalScore - a.ranking.totalScore);

  // Assign 1-indexed rank
  return scored.map((item, index) => ({
    ...item,
    ranking: {
      ...item.ranking,
      rank: index + 1,
    },
  }));
}

/**
 * Returns specifically the Top 10 aggregated articles prominently for the portal homepage.
 */
export function getTop10AggregatedArticles(
  articles: Article[],
  weights: AlgorithmWeights = DEFAULT_ALGORITHM_WEIGHTS
): RankedArticle[] {
  return rankArticles(articles, weights).slice(0, 10);
}

/**
 * Source list extraction
 */
export function getDistinctSources(articles: Article[]): { name: string; authority: number; count: number }[] {
  const map = new Map<string, { authority: number; count: number }>();
  articles.forEach((a) => {
    const existing = map.get(a.source) || { authority: a.sourceAuthority, count: 0 };
    existing.count++;
    map.set(a.source, existing);
  });

  return Array.from(map.entries())
    .map(([name, data]) => ({ name, authority: data.authority, count: data.count }))
    .sort((a, b) => b.count - a.count);
}
