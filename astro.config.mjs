// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 사이트 주소 등은 src/settings/site.json 한 곳에서 관리합니다.
const site = JSON.parse(readFileSync(new URL('./src/settings/site.json', import.meta.url), 'utf-8'));

/** 사이트맵 <lastmod>에 넣을 기사별 최종 수정 시각 (기사 주소 → 날짜) */
function articleLastModified() {
  const dir = new URL('./src/content/articles/', import.meta.url);
  const map = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const text = readFileSync(new URL(file, dir), 'utf-8');
    /** @param {string} key */
    const pick = (key) => text.match(new RegExp(`^${key}:\\s*['"]?([^'"\\n]+?)['"]?\\s*$`, 'm'))?.[1];
    const date = new Date(pick('updatedDate') || pick('pubDate') || '');
    if (!Number.isNaN(date.valueOf())) {
      map.set(new URL(`/article/${file.replace(/\.md$/, '')}/`, site.siteUrl).href, date.toISOString());
    }
  }
  return map;
}

const lastModified = articleLastModified();

export default defineConfig({
  site: site.siteUrl,
  integrations: [
    sitemap({
      filter: (page) => !/\/(search|404)\/?$/.test(page),
      serialize(item) {
        const lastmod = lastModified.get(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
