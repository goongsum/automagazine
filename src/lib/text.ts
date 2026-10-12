/** 마크다운을 검색·요약용 일반 텍스트로 바꿉니다. */
export function stripMarkdown(markdown: string = ''): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_~`|]/g, '')
    .replace(/\{\{\s*[a-zA-Z]+\s*\}\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}
