import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS, TOPIC_IDS } from './lib/categories';

// 관리자 화면(Decap CMS)은 비워 둔 칸을 "" 또는 null로 저장하므로 없는 값으로 취급합니다.
const blankToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);
const optionalString = z.preprocess(blankToUndefined, z.string().optional());
const stringList = z.preprocess((value) => value ?? [], z.array(z.string()));

/** 기사: src/content/articles/*.md — 파일 이름이 기사 주소(/article/파일이름/)가 됩니다. */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    subtitle: optionalString,
    category: z.enum(CATEGORY_IDS),
    topics: z.preprocess((value) => value ?? [], z.array(z.enum(TOPIC_IDS))),
    author: reference('authors'),
    pubDate: z.coerce.date(),
    updatedDate: z.preprocess(blankToUndefined, z.coerce.date().optional()),
    image: optionalString,
    imageAlt: optionalString,
    imageCaption: optionalString,
    description: optionalString,
    tags: stringList,
    headline: z.boolean().default(false),
    sponsored: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** 기자: src/content/authors/*.json — slug가 기자 페이지 주소(/reporter/slug/)가 됩니다. */
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    role: z.string().default('기자'),
    email: optionalString,
    bio: optionalString,
    photo: optionalString,
  }),
});

/** 고정 페이지: 회사소개·기사제보·개인정보처리방침·청소년보호정책·이용약관 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
  }),
});

export const collections = { articles, authors, pages };
