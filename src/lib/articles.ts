import { getCollection, type CollectionEntry } from 'astro:content';
import { stripMarkdown, truncate } from './text';

export type Article = CollectionEntry<'articles'>;
export type Author = CollectionEntry<'authors'>;

export const PAGE_SIZE = 12;

/** 공개된 기사를 최신순으로 가져옵니다. (draft: true인 기사는 제외) */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getAuthors(): Promise<Map<string, Author>> {
  const authors = await getCollection('authors');
  return new Map(authors.map((a) => [a.id, a]));
}

export const articleUrl = (article: Article) => `/article/${article.id}/`;
export const reporterUrl = (id: string) => `/reporter/${id}/`;

/** 요약문: description → 부제 → 본문 앞부분 순으로 사용 */
export function getSummary(article: Article, length = 120): string {
  const { description, subtitle } = article.data;
  if (description) return description;
  if (subtitle) return subtitle;
  return truncate(stripMarkdown(article.body), length);
}

/** 같은 카테고리·분야·키워드가 겹치는 순으로 관련 기사를 고릅니다. */
export function getRelatedArticles(article: Article, all: Article[], count = 4): Article[] {
  const tags = new Set(article.data.tags);
  const topics = new Set(article.data.topics);
  const scored = all
    .filter((a) => a.id !== article.id)
    .map((a) => {
      let score = 0;
      if (a.data.category === article.data.category) score += 2;
      score += a.data.topics.filter((t) => topics.has(t)).length * 2;
      score += a.data.tags.filter((t) => tags.has(t)).length;
      return { a, score };
    })
    .sort((x, y) => y.score - x.score || y.a.data.pubDate.valueOf() - x.a.data.pubDate.valueOf());
  return scored.slice(0, count).map(({ a }) => a);
}

/** 메인 헤드라인: headline 지정 기사 우선, 없으면 최신 기사 */
export function pickHeadlines(all: Article[], count = 4): Article[] {
  const flagged = all.filter((a) => a.data.headline);
  const rest = all.filter((a) => !a.data.headline);
  return [...flagged, ...rest].slice(0, count);
}
