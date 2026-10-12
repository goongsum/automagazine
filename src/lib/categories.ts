/**
 * 카테고리(기사 분류)와 분야(주제 태그) 정의.
 * id는 URL에 쓰이므로 바꾸면 기존 주소가 달라집니다.
 * 항목을 추가·변경하면 public/admin/config.yml의 선택지도 함께 맞춰 주세요.
 */
export const CATEGORY_IDS = ['news', 'guide', 'review', 'interview', 'education'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: 'news', name: '뉴스', description: '카케어·디테일링 업계 소식과 신제품 뉴스' },
  { id: 'guide', name: '시공 가이드', description: '세차·광택·유리막코팅·PPF·틴팅·실내크리닝 시공 노하우' },
  { id: 'review', name: '제품 리뷰', description: '케미컬·장비·필름 등 카케어 제품 리뷰와 비교' },
  { id: 'interview', name: '인터뷰', description: '디테일러와 업계 사람들의 이야기' },
  { id: 'education', name: '교육·행사', description: '교육 과정, 세미나, 전시회와 업계 행사 소식' },
];

export const TOPIC_IDS = [
  'wash',
  'polish',
  'coating',
  'ppf',
  'tinting',
  'interior',
  'new-product',
  'industry',
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export interface Topic {
  id: TopicId;
  name: string;
}

export const TOPICS: Topic[] = [
  { id: 'wash', name: '세차' },
  { id: 'polish', name: '광택' },
  { id: 'coating', name: '유리막코팅' },
  { id: 'ppf', name: 'PPF' },
  { id: 'tinting', name: '틴팅' },
  { id: 'interior', name: '실내크리닝' },
  { id: 'new-product', name: '신제품' },
  { id: 'industry', name: '업계 소식' },
];

export function getCategory(id: string): Category {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`알 수 없는 카테고리: ${id}`);
  return category;
}

export function getTopic(id: string): Topic {
  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) throw new Error(`알 수 없는 분야: ${id}`);
  return topic;
}

export const categoryUrl = (id: string) => `/category/${id}/`;
export const topicUrl = (id: string) => `/topic/${id}/`;
