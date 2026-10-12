import type { APIRoute } from 'astro';
import { articleUrl, getArticles } from '../lib/articles';
import { toKstIso } from '../lib/format';
import { site, absoluteUrl } from '../lib/site';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * 구글 뉴스 사이트맵: 최근 2일 안에 발행된 기사만 넣습니다.
 * 정적 사이트이므로 '최근 2일'은 마지막 빌드 시점 기준입니다.
 */
export const GET: APIRoute = async () => {
  const since = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = (await getArticles()).filter((a) => a.data.pubDate.valueOf() >= since).slice(0, 1000);

  const urls = recent
    .map(
      (a) => `  <url>
    <loc>${absoluteUrl(articleUrl(a))}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.siteName)}</news:name>
        <news:language>ko</news:language>
      </news:publication>
      <news:publication_date>${toKstIso(a.data.pubDate)}</news:publication_date>
      <news:title>${escapeXml(a.data.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
