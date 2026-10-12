import type { APIRoute } from 'astro';
import { articleUrl, getArticles, getAuthors, getSummary } from '../lib/articles';
import { getCategory, getTopic } from '../lib/categories';
import { formatDateTime } from '../lib/format';
import { stripMarkdown, truncate } from '../lib/text';

/** 사이트 내 검색용 인덱스 (/search/ 페이지가 불러옵니다) */
export const GET: APIRoute = async () => {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);
  const index = articles.map((article) => ({
    url: articleUrl(article),
    title: article.data.title,
    subtitle: article.data.subtitle ?? '',
    category: getCategory(article.data.category).name,
    author: authors.get(article.data.author.id)?.data.name ?? '',
    date: formatDateTime(article.data.pubDate),
    image: article.data.image ?? '',
    keywords: [...article.data.tags, ...article.data.topics.map((t) => getTopic(t).name)].join(' '),
    summary: getSummary(article, 100),
    text: truncate(stripMarkdown(article.body), 3000),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
