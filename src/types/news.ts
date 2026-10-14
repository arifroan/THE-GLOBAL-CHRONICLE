export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'zh'
  | 'ar'
  | 'hi'
  | 'pt'
  | 'ru';

export interface LanguageConfig {
  code: Language;
  name: string;
  localName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  speechLang: string;
}

export type NewsCategory =
  | 'all'
  | 'world'
  | 'politics'
  | 'business'
  | 'tech'
  | 'science'
  | 'climate'
  | 'culture'
  | 'entertainment'
  | 'sports'
  | 'health'
  | 'opinion';

export type Region =
  | 'all'
  | 'europe'
  | 'asia-pacific'
  | 'north-america'
  | 'latin-america'
  | 'middle-east'
  | 'africa';

export interface ArticleTranslation {
  title: string;
  subtitle: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  pullQuote?: {
    quote: string;
    speaker: string;
  };
}

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export interface ArticleSentiment {
  type: SentimentType;
  score: number; // -1.0 to +1.0
  positiveCount: number;
  negativeCount: number;
  highlightWords: string[];
}

export interface TriSourcePerspective {
  bbc?: string;
  alJazeera?: string;
  cnn?: string;
}

export interface NeutralityAudit {
  neutralityScore: number; // e.g. 99 (percentage 0-100)
  multiSourceCorroboration: boolean;
  perspectives: TriSourcePerspective;
  editorialStandards: string;
  unbiasedVerdict: string;
}

export interface Article {
  id: string;
  category: NewsCategory;
  region: Region;
  country: string;
  city: string;
  source: string; // e.g. "The Global Chronicles AI Bureau", "Reuters", "BBC News", etc.
  sourceAuthority: number; // 0-100 rating based on verification standards and wire tier
  author: string;
  authorRole: string;
  timestamp: string; // ISO string
  readTimeMinutes: number;
  importance: 'lead' | 'breaking' | 'featured' | 'standard';
  imageCategory:
    | 'diplomacy'
    | 'finance'
    | 'tech'
    | 'climate'
    | 'science'
    | 'culture'
    | 'entertainment'
    | 'sports'
    | 'health'
    | 'space'
    | 'infrastructure';
  imageUrl?: string;
  isFactChecked: boolean;
  shares: number;
  views: number;
  commentsCount?: number;
  bookmarksCount?: number;
  translations: Record<Language, ArticleTranslation>;
  tags: string[];
  sentiment?: ArticleSentiment;
  // Real-time AI synchronization and tri-source attributes
  isAiSynchronized?: boolean;
  lastSyncedAt?: string;
  neutralityAudit?: NeutralityAudit;
  primarySources?: string[];
  sourceUrl?: string;
}

export interface RankingScoreBreakdown {
  recencyScore: number; // 0 - 100
  authorityScore: number; // 0 - 100
  engagementScore: number; // 0 - 100
  totalScore: number; // 0 - 100
  rank?: number;
  hoursAgo: number;
}

export interface RankedArticle extends Article {
  ranking: RankingScoreBreakdown;
}

export interface AlgorithmWeights {
  recency: number; // default 0.35
  authority: number; // default 0.35
  engagement: number; // default 0.30
}

export interface UserFeedConfig {
  selectedCategories: NewsCategory[];
  selectedSources: string[];
  keywordFilter: string;
  minScore: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  market: 'US' | 'EU' | 'Asia' | 'Commodity' | 'FX';
}

export interface BureauClock {
  city: string;
  country: string;
  timezone: string;
  weather: string;
  tempC: number;
  marketOpen: boolean;
}

export interface DigestSubscription {
  email: string;
  frequency: 'morning' | 'evening' | 'both';
  topics: string[];
  language: Language;
  subscribedAt: string;
}

