import { Article, ArticleSentiment, SentimentType, Language } from '../types/news';

// Simple Domain Sentiment Lexicon
export const POSITIVE_LEXICON = new Set([
  'breakthrough',
  'historic',
  'agreement',
  'peace',
  'success',
  'successful',
  'milestone',
  'clean',
  'renewable',
  'solution',
  'growth',
  'record',
  'boost',
  'boosted',
  'prosperity',
  'protect',
  'protection',
  'safeguard',
  'safeguards',
  'consensus',
  'cooperation',
  'collaborate',
  'partnership',
  'advance',
  'advancement',
  'cure',
  'recovery',
  'effective',
  'efficacy',
  'innovative',
  'innovation',
  'sustainable',
  'sustainability',
  'rally',
  'triumph',
  'parity',
  'equal',
  'equity',
  'unite',
  'united',
  'resilient',
  'resilience',
  'opportunity',
  'sovereignty',
  'preserve',
  'preservation',
  'restored',
  'restoration',
  'optimistic',
  'pioneering',
  'gain',
  'gains',
  'surplus',
  'beneficial',
  'thrive',
  'thriving',
  'cheaper',
  'green',
  'accord',
  'rejoice',
  'freedom',
  'liberate',
  'vital',
  'progress',
  'remedy',
  'flourish',
  'flourishing',
  'record-low',
  'positive',
]);

export const NEGATIVE_LEXICON = new Set([
  'crisis',
  'threat',
  'threaten',
  'threatens',
  'decline',
  'collapse',
  'dispute',
  'conflict',
  'violation',
  'violations',
  'crash',
  'drought',
  'risk',
  'risks',
  'damage',
  'war',
  'failure',
  'halt',
  'halted',
  'struggle',
  'struggling',
  'inflation',
  'inflationary',
  'deficit',
  'toll',
  'outbreak',
  'famine',
  'scandal',
  'tariff',
  'tariffs',
  'drop',
  'dropped',
  'loss',
  'losses',
  'danger',
  'dangerous',
  'warn',
  'warning',
  'warns',
  'poverty',
  'penalty',
  'strike',
  'protest',
  'tension',
  'tensions',
  'disruption',
  'disruptions',
  'severe',
  'fatal',
  'tragedy',
  'tragic',
  'sanction',
  'sanctions',
  'negative',
  'cut',
  'cuts',
  'plunge',
  'plunged',
  'emergency',
  'fears',
  'fearing',
]);

/**
 * Analyzes the text content of an article using the sentiment lexicon.
 */
export function analyzeArticleSentiment(article: Article, language: Language = 'en'): ArticleSentiment {
  // Use current language translation if available, fallback to English for standard lexicon matching
  const trans = article.translations[language] || article.translations.en;
  const enTrans = article.translations.en;

  // Combine title, subtitle, summary, and key takeaways for thorough lexicon evaluation
  const combinedText = [
    enTrans.title,
    enTrans.subtitle,
    enTrans.summary,
    ...(enTrans.keyTakeaways || []),
  ]
    .join(' ')
    .toLowerCase();

  // Extract clean word tokens
  const words = combinedText.match(/\b[a-z]{3,}\b/g) || [];

  let positiveCount = 0;
  let negativeCount = 0;
  const matchedPositives = new Set<string>();
  const matchedNegatives = new Set<string>();

  for (const word of words) {
    if (POSITIVE_LEXICON.has(word)) {
      positiveCount++;
      matchedPositives.add(word);
    } else if (NEGATIVE_LEXICON.has(word)) {
      negativeCount++;
      matchedNegatives.add(word);
    }
  }

  // Normalized polarity score (-1.0 to +1.0)
  const totalMatches = positiveCount + negativeCount;
  let score = 0;
  if (totalMatches > 0) {
    score = (positiveCount - negativeCount) / (totalMatches + 1);
  }

  // Classification threshold
  let type: SentimentType = 'Neutral';
  if (score >= 0.15 || (positiveCount >= 3 && positiveCount > negativeCount * 1.5)) {
    type = 'Positive';
  } else if (score <= -0.15 || (negativeCount >= 3 && negativeCount > positiveCount * 1.5)) {
    type = 'Negative';
  } else {
    type = 'Neutral';
  }

  // Collect top highlight keywords
  const highlightWords = [
    ...Array.from(matchedPositives).slice(0, 3),
    ...Array.from(matchedNegatives).slice(0, 2),
  ];

  return {
    type,
    score: Math.round(score * 100) / 100,
    positiveCount,
    negativeCount,
    highlightWords,
  };
}

/**
 * Enriches an array of articles with analyzed sentiment tags.
 */
export function enrichArticlesWithSentiment(articles: Article[]): Article[] {
  return articles.map((article) => {
    if (article.sentiment) return article;
    return {
      ...article,
      sentiment: analyzeArticleSentiment(article),
    };
  });
}
