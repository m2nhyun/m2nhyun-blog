# 태스크 인덱스

> **이 파일 하나로 모든 작업을 시작할 수 있습니다.**
> 태스크 번호를 찾고 → "읽어야 할 파일"을 Claude에게 전달하세요.

---

## 사용법

```
[태스크 번호]번 작업을 시작합니다.
먼저 다음 파일들을 읽어주세요:
[해당 태스크의 읽어야 할 파일 목록 복사]
```

---

## 🔴 P0 - 당장 필요

### TASK-001: 관리자 대시보드 CRUD 완성
| 항목 | 내용 |
|------|------|
| **설명** | 포스트/방명록/포트폴리오 관리 UI 구현 |
| **난이도** | 중간 |
| **상태** | ✅ 완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/features/auth/components/AdminContent.tsx
src/app/actions/post.ts
src/app/actions/guestbook.ts
src/app/actions/portfolio.ts
src/entities/post/types.ts
```

---

### TASK-002: 에러 핸들링 통합
| 항목 | 내용 |
|------|------|
| **설명** | 글로벌 에러 바운더리 & Server Action 에러 처리 |
| **난이도** | 작음 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/app/error.tsx
src/app/layout.tsx
```

---

## 🟡 P1 - 중요

### TASK-003: 마크다운 에디터 추가
| 항목 | 내용 |
|------|------|
| **설명** | 포스트 작성 시 마크다운 에디터 & 미리보기 |
| **난이도** | 큼 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/features/blog-post/components/PostForm.tsx
src/entities/post/types.ts
src/app/admin/posts/new/page.tsx
```

---

### TASK-004: 이미지 업로드 기능
| 항목 | 내용 |
|------|------|
| **설명** | Firebase Storage 연동, 포스트/포트폴리오 이미지 업로드 |
| **난이도** | 중간 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/shared/lib/firebase/config.ts
src/features/blog-post/components/PostForm.tsx
```

---

### TASK-005: SEO 최적화
| 항목 | 내용 |
|------|------|
| **설명** | 동적 메타데이터, OG 태그, JSON-LD |
| **난이도** | 중간 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/app/layout.tsx
src/app/sitemap.ts
src/app/blog/[slug]/page.tsx
src/app/blog/page.tsx
```

---

### TASK-006: 댓글 기능 추가
| 항목 | 내용 |
|------|------|
| **설명** | 블로그 포스트 댓글 (새 feature) |
| **난이도** | 큼 |
| **상태** | ⬜ 미구현 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
docs/ARCHITECTURE.md
src/features/blog-post/ (전체 구조 참고)
src/app/actions/post.ts (패턴 참고)
src/entities/post/types.ts (패턴 참고)
```

**새로 만들 파일:**
```
src/entities/comment/types.ts
src/entities/comment/index.ts
src/app/actions/comment.ts
src/features/comment/components/CommentList.tsx
src/features/comment/components/CommentForm.tsx
src/features/comment/index.ts
```

---

### TASK-007: 검색 기능
| 항목 | 내용 |
|------|------|
| **설명** | 블로그 포스트 제목/내용/태그 검색 |
| **난이도** | 중간 |
| **상태** | ⬜ 미구현 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/app/actions/post.ts
src/features/blog-post/components/BlogList.tsx
src/app/blog/page.tsx
```

---

### TASK-008: 카테고리/태그 필터링
| 항목 | 내용 |
|------|------|
| **설명** | 블로그 목록에서 카테고리/태그 필터 |
| **난이도** | 작음 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/features/blog-post/components/BlogList.tsx
src/app/actions/post.ts
src/shared/constants/data.ts
```

---

## 🟢 P2 - 코드 품질

### TASK-009: 커스텀 훅 추출
| 항목 | 내용 |
|------|------|
| **설명** | usePosts, useGuestbook 등 로직 분리 |
| **난이도** | 중간 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/features/blog-post/components/BlogList.tsx
src/features/guestbook/components/GuestbookList.tsx
src/features/portfolio/components/PortfolioContent.tsx
```

**새로 만들 파일:**
```
src/features/blog-post/hooks/usePosts.ts
src/features/guestbook/hooks/useGuestbook.ts
src/features/portfolio/hooks/usePortfolio.ts
```

---

### TASK-010: 로딩 UI 개선
| 항목 | 내용 |
|------|------|
| **설명** | 스켈레톤 UI 통일, 페이지별 로딩 |
| **난이도** | 작음 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
src/shared/ui/Skeleton.tsx
src/app/loading.tsx
src/app/blog/loading.tsx
```

---

### TASK-011: 테스트 코드 작성
| 항목 | 내용 |
|------|------|
| **설명** | Jest/Vitest 설정 & 유닛/컴포넌트 테스트 |
| **난이도** | 큼 |
| **상태** | ⬜ 미구현 |

**읽어야 할 파일:**
```
docs/QUICK_REF.md
package.json
src/app/actions/post.ts
src/features/blog-post/components/BlogList.tsx
```

---

### TASK-012: 문서 정리 (SERVICES.md 업데이트)
| 항목 | 내용 |
|------|------|
| **설명** | 기존 문서와 실제 코드 동기화 |
| **난이도** | 작음 |
| **상태** | ⬜ 미완료 |

**읽어야 할 파일:**
```
docs/SERVICES.md
docs/QUICK_REF.md
src/app/actions/post.ts
```

---

## ⚪ P3 - 나중에

### TASK-013: 다국어 지원 (i18n)
**읽어야 할 파일:** `docs/QUICK_REF.md`, `src/app/layout.tsx`

### TASK-014: PWA 지원
**읽어야 할 파일:** `docs/QUICK_REF.md`, `next.config.mjs`, `public/`

### TASK-015: RSS 피드
**읽어야 할 파일:** `docs/QUICK_REF.md`, `src/app/actions/post.ts`

### TASK-016: 조회수/좋아요 기능 완성
**읽어야 할 파일:** `docs/QUICK_REF.md`, `src/app/actions/post.ts`, `src/features/blog-post/components/BlogDetail.tsx`

### TASK-017: 관련 포스트 추천
**읽어야 할 파일:** `docs/QUICK_REF.md`, `src/features/blog-post/components/BlogDetail.tsx`

---

## 완료된 태스크

| 번호 | 작업 | 완료일 | PR |
|------|------|--------|-----|
| TASK-001 | 관리자 대시보드 CRUD 완성 | 2026-02-09 | - |

---

## 빠른 복사용 템플릿

### Claude에게 전달할 메시지
```
TASK-XXX 작업을 시작합니다.

먼저 다음 파일들을 읽어주세요:
- docs/QUICK_REF.md
- [나머지 파일들...]

그 후 작업을 진행해주세요.
```

### 태스크 완료 시 체크리스트
- [ ] 코드 작성 완료
- [ ] 린트 통과 (`npm run lint`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 수동 테스트 완료
- [ ] TASK_INDEX.md 상태 업데이트
