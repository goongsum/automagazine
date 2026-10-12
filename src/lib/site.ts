import settings from '../settings/site.json';

/** 사이트 전역 설정. 값은 src/settings/site.json 한 곳에서 관리합니다. */
export const site = settings;
export type SiteSettings = typeof settings;

export function absoluteUrl(path: string): string {
  return new URL(path, site.siteUrl).toString();
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * 고정 페이지 본문에서 {{company}}, {{youthOfficer}} 같은 표기를
 * site.json의 값으로 바꿉니다. 알 수 없는 이름은 그대로 둡니다.
 */
export function fillSiteTokens(html: string): string {
  const values = settings as unknown as Record<string, unknown>;
  return html.replace(/\{\{\s*([a-zA-Z]+)\s*\}\}/g, (match, key: string) => {
    const value = values[key];
    return typeof value === 'string' ? escapeHtml(value) : match;
  });
}
