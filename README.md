# 오토매거진 (AutoMagazine)

카케어·디테일링 전문 인터넷신문 **오토매거진** 웹사이트입니다. 운영: 준앤컴퍼니 유한회사

- **Astro** 정적 사이트 → **Cloudflare Pages** 배포
- 기사는 `src/content/articles/` 의 **마크다운 파일**로 관리
- 브라우저용 관리자 화면 **`/admin/`** (Decap CMS, Git 기반)에서 기사 작성과 사진 업로드
- 모바일 우선 반응형, 사이트 내 검색, RSS, 사이트맵, NewsArticle 구조화 데이터

---

## 1. 폴더 구조

```
automagazine/
├─ astro.config.mjs            # Astro 설정 (사이트 주소는 site.json에서 읽음)
├─ functions/api/              # Cloudflare Pages Functions: 관리자 GitHub 로그인
│  ├─ auth.js                  #   /api/auth     로그인 시작
│  └─ callback.js              #   /api/callback 로그인 완료
├─ public/
│  ├─ admin/                   # 관리자 화면 (Decap CMS)
│  │  ├─ index.html
│  │  ├─ config.yml            #   편집 화면 구성 (기사·기자·고정 페이지·사이트 설정)
│  │  └─ preview.css
│  ├─ images/uploads/          # 관리자에서 올린 사진
│  ├─ images/logo.png, og-default.jpg
│  └─ _headers                 # 캐시·보안 헤더
└─ src/
   ├─ settings/
   │  ├─ site.json             # ★ 제호·등록번호·발행인·편집인·청소년보호책임자·주소·연락처
   │  └─ ads.json              # 광고 슬롯
   ├─ content/
   │  ├─ articles/*.md         # 기사
   │  ├─ authors/*.json        # 기자
   │  └─ pages/*.md            # 회사소개·기사제보·개인정보처리방침·청소년보호정책·이용약관
   ├─ content.config.ts        # 기사·기자·페이지 항목 정의
   ├─ lib/                     # 카테고리·분야 정의, 날짜 형식, 기사 조회 함수
   ├─ layouts/  components/  styles/
   └─ pages/                   # 주소별 페이지
```

## 2. 페이지 구성

| 주소 | 내용 |
| --- | --- |
| `/` | 헤드라인, 서브 헤드라인, 최신 기사, 카테고리별 기사, 광고 영역 |
| `/articles/` | 전체기사 (12건씩 페이지 나눔) |
| `/category/news/` · `guide` · `review` · `interview` · `education` | 뉴스 / 시공 가이드 / 제품 리뷰 / 인터뷰 / 교육·행사 |
| `/topic/coating/` 등 | 분야별: 세차·광택·유리막코팅·PPF·틴팅·실내크리닝·신제품·업계 소식 |
| `/article/{기사ID}/` | 기사: 제목, 부제, 기자명, 입력·수정 일시, 대표 이미지, 본문, 키워드, 관련 기사 |
| `/reporter/`, `/reporter/{id}/` | 기자 목록, 기자별 기사 목록 |
| `/search/?q=검색어` | 사이트 내 검색 |
| `/about/` `/tip/` `/privacy/` `/youth-policy/` `/terms/` | 회사소개, 기사제보, 개인정보처리방침, 청소년보호정책, 이용약관 |
| `/rss.xml` | RSS (최근 50건, 전문 포함) |
| `/sitemap-index.xml`, `/news-sitemap.xml`, `/robots.txt` | 사이트맵, 구글 뉴스 사이트맵, robots |
| `/admin/` | 관리자 화면 |

## 3. 설정 바꾸기 (하단 법정 표기 등)

제호, 등록번호, 등록일, 발행일, 발행인, 편집인, 청소년보호책임자, 주소, 연락처, 사업자등록번호는
**`src/settings/site.json` 한 곳**에서 바꿉니다. 관리자 화면의 **사이트 설정 → 발행 정보·연락처**에서도 고칠 수 있습니다.

- 지금은 등록 전이라 `(임시)`, `(등록 예정)` 값이 들어 있습니다.
- 바꾼 값은 모든 페이지 하단과 회사소개·개인정보처리방침·청소년보호정책·이용약관 본문에 함께 반영됩니다.
  (고정 페이지 본문의 `{{company}}`, `{{youthOfficer}}` 같은 표기가 자동으로 채워집니다.)
- 도메인을 연결하면 `siteUrl`을 새 주소로 바꿔 주세요. 사이트맵, RSS, 공유 이미지 주소에 쓰입니다.

> ⚠️ 개인정보처리방침·청소년보호정책·이용약관은 일반적인 초안입니다. 실제 운영 방식에 맞게 검토한 뒤 사용하세요.

## 4. 로컬에서 실행하기

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/ 에 정적 파일 생성
npm run preview      # 빌드 결과 미리보기
```

로그인 없이 내 컴퓨터에서 관리자 화면을 쓰려면 터미널 두 개에서 실행합니다.

```bash
npm run dev          # 터미널 1
npm run cms          # 터미널 2 (decap-server: 파일을 직접 수정)
```

그다음 http://localhost:4321/admin/ 에 접속합니다. 저장한 내용은 내 컴퓨터 파일에 바로 쓰이므로 직접 커밋·푸시해야 합니다.

---

## 5. Cloudflare Pages 연결 방법

### 5-1. 준비
이 작업은 `claude/friendly-babbage-mc5byg` 브랜치에 있습니다. **`main` 브랜치에 병합**해 주세요.
관리자 화면은 `main` 브랜치에 기사를 저장하고, Cloudflare는 `main`을 실제 사이트로 배포합니다.

### 5-2. 프로젝트 만들기
1. https://dash.cloudflare.com 로그인 → **Workers & Pages** → **Create** (만들기)
2. **Pages** 탭 → **Connect to Git** (Git에 연결) → GitHub 계정 연결 → 저장소 `goongsum/automagazine` 선택
3. 빌드 설정

   | 항목 | 값 |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | (비워 둠) |
   | Environment variables | `NODE_VERSION` = `22` (저장소의 `.node-version`으로도 지정되어 있음) |

4. **Save and Deploy** → 1~2분 뒤 `https://<프로젝트이름>.pages.dev` 주소로 사이트가 열립니다.
   프로젝트 이름을 `automagazine`으로 하면 `https://automagazine.pages.dev`가 되며, 이는 `site.json`의 기본 주소와 같습니다.
   다른 이름이면 `site.json`의 `siteUrl`을 그 주소로 바꿔 주세요.

이후에는 `main`에 커밋이 올라올 때마다(관리자 화면에서 기사를 발행할 때 포함) 자동으로 다시 배포됩니다.
다른 브랜치나 PR에는 미리보기 주소가 따로 만들어집니다.

### 5-3. 도메인 연결 (선택)
Pages 프로젝트 → **Custom domains** → **Set up a custom domain** 에서 도메인을 추가합니다.
연결한 뒤에는 ① `site.json`의 `siteUrl`, ② 아래 GitHub OAuth App의 주소 두 곳을 새 도메인으로 바꿔 주세요.

---

## 6. 관리자 화면 (기사 작성·사진 업로드)

관리자 화면은 GitHub 계정으로 로그인합니다. 처음 한 번만 아래처럼 설정합니다.

### 6-1. GitHub OAuth App 만들기
1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
   (조직 저장소라면 조직의 Settings → Developer settings에서 만들어도 됩니다.)
2. 입력값

   | 항목 | 값 |
   | --- | --- |
   | Application name | `오토매거진 관리자` |
   | Homepage URL | `https://automagazine.pages.dev` |
   | Authorization callback URL | `https://automagazine.pages.dev/api/callback` |

3. **Register application** → **Client ID**를 복사하고, **Generate a new client secret**으로 Secret을 만들어 복사합니다.

### 6-2. Cloudflare에 키 넣기
Pages 프로젝트 → **Settings** → **Variables and Secrets**(환경 변수) → Production에 추가

| 이름 | 값 | 종류 |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | 복사한 Client ID | Text |
| `GITHUB_CLIENT_SECRET` | 복사한 Client Secret | **Secret (암호화)** |

저장한 뒤 **Deployments**에서 최신 배포를 **Retry deployment**(다시 배포)해야 적용됩니다.

### 6-3. 접속하기
1. `https://automagazine.pages.dev/admin/` 접속
2. **GitHub로 로그인** → 권한 승인
3. 왼쪽 **기사** → **+ 기사**로 작성 → 오른쪽 위 **게시 → 지금 게시**
4. 1~2분 뒤 사이트에 반영됩니다.

### 6-4. 기자 계정 추가
관리자 화면에 로그인하려면 **GitHub 저장소에 쓰기 권한**이 있어야 합니다.
GitHub 저장소 → **Settings** → **Collaborators** → **Add people**로 기자의 GitHub 계정을 추가하세요.
그리고 관리자 화면 **기자** 메뉴에서 기자 정보(이름, 직함, 이메일, 소개)를 등록하면 기사 작성 화면에서 고를 수 있습니다.

### 관리자 화면에서 할 수 있는 일
- **기사**: 제목, 부제, 카테고리, 분야, 기자, 입력·수정 일시, 대표 이미지(+설명), 요약, 키워드, 헤드라인 지정, 기사형 광고 표시, 비공개(초안), 본문(사진 삽입)
- **기자**: 기자 등록·수정
- **고정 페이지**: 회사소개·기사제보·개인정보처리방침·청소년보호정책·이용약관 본문
- **사이트 설정**: 발행 정보·연락처(하단 표기), 광고 관리(배너 이미지·링크·게재 여부)
- 사진은 `public/images/uploads/`에 저장됩니다. 한 장당 5MB까지 올릴 수 있으며, 가로 1200~2000px JPG를 권장합니다.
- 편집장 승인 절차(초안 → 검토 → 발행)가 필요하면 `public/admin/config.yml`의 `publish_mode: editorial_workflow` 주석을 푸세요.

---

## 7. 기사 파일 형식

관리자 화면 대신 파일을 직접 써도 됩니다. 파일 이름이 기사 주소가 됩니다. (`20261012-090000.md` → `/article/20261012-090000/`)
관리자 화면에서 만든 기사는 작성 시각(UTC 기준)으로 파일 이름이 정해집니다.

```markdown
---
title: 기사 제목
subtitle: 부제 (선택)
category: guide            # news | guide | review | interview | education
topics: [coating, polish]  # wash | polish | coating | ppf | tinting | interior | new-product | industry
author: kim-auto           # src/content/authors/ 의 파일 이름
pubDate: 2026-10-10T10:30:00+09:00
updatedDate: 2026-10-11T15:20:00+09:00   # 수정했을 때만
image: /images/uploads/photo.jpg
imageAlt: 사진 설명(대체 텍스트)
imageCaption: 사진 설명·출처
description: 검색·공유용 요약 (선택)
tags: [유리막코팅, 신차관리]
headline: false            # true면 메인 헤드라인 우선
sponsored: false           # 기사형 광고면 true → '광고' 표시
draft: false               # true면 사이트에 안 보임
---

본문 (마크다운)
```

## 8. 광고

- 광고 영역에는 항상 **'광고'** 라벨이 붙고, 기사와 다른 배경·테두리로 구분됩니다.
- 슬롯: 메인 상단, 메인 중단, 사이드, 기사 하단 (`src/settings/ads.json` 또는 관리자 **사이트 설정 → 광고 관리**)
- 게재 중인 광고가 없으면 '광고 문의' 안내가 표시됩니다. (`showPlaceholder`를 끄면 숨김)
- 광고주에게 대가를 받은 기사는 **기사형 광고**를 켜면 기사와 목록에 '광고' 표시가 붙습니다.

## 9. 기사제보 양식

기본 설정에서는 제보 양식을 제출하면 제보 이메일(`tipEmail`)로 보낼 메일 작성 창이 열립니다.
Formspree 같은 폼 수신 서비스를 쓰려면 그 주소를 `site.json`의 `tipFormEndpoint`에 넣으세요.
그러면 양식이 그 주소로 바로 전송됩니다. 이 경우 개인정보처리방침의 위탁 업체 표에 해당 서비스를 추가해야 합니다.

## 10. 검색엔진 등록 (배포 후)

- **구글 서치 콘솔**: 사이트 등록 → Sitemaps에 `sitemap-index.xml`, `news-sitemap.xml` 제출
- **네이버 서치어드바이저**: 사이트 등록 → 사이트맵 `sitemap-index.xml`, RSS `rss.xml` 제출
- 소유 확인용 메타 태그가 필요하면 `src/layouts/BaseLayout.astro`의 `<head>`에 넣으면 됩니다.
