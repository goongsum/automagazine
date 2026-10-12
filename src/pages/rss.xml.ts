import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { articleUrl, getArticles, getAuthors, getSummary } from '../lib/articles';
import { getCategory } from '../lib/categories';
import { site, absoluteUrl } from '../lib/site';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 본문 속 /images/... 같은 상대 주소를 절대 주소로 바꿉니다. */
const absolutize = (html: string) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${absoluteUrl('/')}`);

export const GET: APIRoute = async () => {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);

  return rss({
    title: `${site.siteName} - ${site.tagline}`,
    description: site.description,
    site: site.siteUrl,
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      media: 'http://search.yahoo.com/mrss/',
    },
    customData: `<language>ko</language><copyright>Copyright © ${escapeXml(site.siteName)}</copyright>`,
    items: articles.slice(0, 50).map((article) => {
      const author = authors.get(article.data.author.id)?.data.name ?? site.siteName;
      const { image } = article.data;
      return {
        title: article.data.title,
        link: articleUrl(article),
        pubDate: article.data.pubDate,
        description: getSummary(article, 200),
        content: absolutize(article.rendered?.html ?? ''),
        categories: [getCategory(article.data.category).name, ...article.data.tags],
        customData: [
          `<dc:creator>${escapeXml(author)}</dc:creator>`,
          image ? `<media:content url="${escapeXml(absoluteUrl(image))}" medium="image" />` : '',
        ].join(''),
      };
    }),
  });
};
