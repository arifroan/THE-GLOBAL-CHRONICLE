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

export interface Article {
  id: string;
  category: NewsCategory;
  region: Region;
  country: string;
  city: string;
  source: string; // e.g. "Reuters", "Associated Press", "AFP", "BBC", "Kyodo News"
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
    | 'sports'
    | 'health'
    | 'space'
    | 'infrastructure';
  imageUrl?: string;
  isFactChecked: boolean;
  shares: number;
  views: number;
  translations: Record<Language, ArticleTranslation>;
  tags: string[];
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
