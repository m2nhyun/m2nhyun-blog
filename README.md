# Minhyun Blog

Next.js + Firebase 기반 개인 블로그

## 기술 스택

| 항목 | 기술 |
|------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **아키텍처** | Feature-Sliced Design (FSD) |
| **데이터 레이어** | Next.js Server Actions |
| **백엔드** | Firebase Admin SDK |
| **인증** | Firebase Auth (Client SDK) |
| **스타일링** | Tailwind CSS |
| **언어** | TypeScript |
| **폼 관리** | React Hook Form + Zod |

## 프로젝트 구조

```
src/
├── app/
│   ├── actions/         # Server Actions (데이터 CRUD)
│   │   ├── post.ts
│   │   ├── guestbook.ts
│   │   └── portfolio.ts
│   ├── blog/            # 블로그 페이지
│   ├── guestbook/       # 방명록 페이지
│   ├── portfolio/       # 포트폴리오 페이지
│   └── admin/           # 관리자 페이지
├── widgets/             # 복합 UI 블록
│   ├── header/          # Header, Sidebar
│   └── footer/          # Footer
├── features/            # 기능별 UI 컴포넌트
│   ├── blog-post/       # BlogList, BlogDetail, PostForm
│   ├── guestbook/       # GuestbookForm, GuestbookList
│   ├── portfolio/       # PortfolioContent
│   ├── auth/            # LoginForm, AdminContent
│   └── theme/           # ThemeProvider, DarkModeToggle
├── entities/            # 타입 정의
│   ├── post/
│   ├── guestbook-entry/
│   ├── portfolio-item/
│   └── user/
└── shared/              # 공통 코드
    ├── lib/firebase/    # Firebase Admin & Client SDK
    ├── ui/              # 공통 UI 컴포넌트
    ├── utils/           # 유틸리티 (cn 등)
    └── constants/       # 상수
```

## 아키텍처

### Server Actions 기반 데이터 레이어

```
[클라이언트 컴포넌트] → [Server Action] → [Firebase Admin SDK] → [Firestore]
```

- **보안**: Firebase Admin SDK가 서버에서만 실행
- **번들 최적화**: Firestore 클라이언트 코드가 번들에 포함되지 않음
- **캐시 관리**: `revalidatePath`로 정밀한 캐시 무효화

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
# 클라이언트 (브라우저 노출)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_UID=...

# 서버 전용 (노출 안됨)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint 검사 |

## 문서

| 문서 | 설명 |
|------|------|
| [TASK_INDEX.md](docs/TASK_INDEX.md) | 전체 태스크 목록 & 작업 시작 가이드 |
| [QUICK_REF.md](docs/QUICK_REF.md) | 빠른 참조 (토큰 최적화용) |
| [CLAUDE_GUIDE.md](docs/CLAUDE_GUIDE.md) | Claude 작업 가이드 |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | FSD 아키텍처 상세 |
| [COMPONENTS.md](docs/COMPONENTS.md) | 컴포넌트 패턴 |
| [SERVICES.md](docs/SERVICES.md) | Server Actions 패턴 |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md) | 개발 환경 설정 |

## 주요 기능

- **블로그**: 포스트 작성/수정/삭제, 카테고리/태그
- **방명록**: 메시지 작성, 관리자 승인
- **포트폴리오**: 프로젝트 소개, 기술 스택
- **다크모드**: 시스템 설정 연동
- **관리자**: Firebase Auth 기반 인증

## Import 규칙

```typescript
// 1. React/Next.js
import { useState } from 'react';

// 2. Server Actions
import { getPosts, createPost } from '@/app/actions/post';

// 3. Entities
import { Post } from '@/entities/post';

// 4. Features
import { BlogList } from '@/features/blog-post';

// 5. Shared
import { cn } from '@/shared/utils';
import { Button } from '@/shared/ui';
```
