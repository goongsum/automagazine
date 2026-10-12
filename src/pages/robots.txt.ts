import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/site';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /search/',
    '',
    `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
    `Sitemap: ${absoluteUrl('/news-sitemap.xml')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
