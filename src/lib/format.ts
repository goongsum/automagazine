const TIME_ZONE = 'Asia/Seoul';

const partsFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function kstParts(date: Date) {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(date).map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  return parts;
}

/** 2026.10.12 */
export function formatDate(date: Date): string {
  const p = kstParts(date);
  return `${p.year}.${p.month}.${p.day}`;
}

/** 2026.10.12 09:15 */
export function formatDateTime(date: Date): string {
  const p = kstParts(date);
  return `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

/** 2026-10-12T09:15:00+09:00 (메타태그·구조화 데이터용) */
export function toKstIso(date: Date): string {
  const p = kstParts(date);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+09:00`;
}
