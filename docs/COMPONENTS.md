# 컴포넌트 가이드

이 문서는 프로젝트에서 사용되는 컴포넌트 패턴과 사용법을 설명합니다.

## 컴포넌트 구조

### Feature 컴포넌트

각 feature의 컴포넌트는 다음 패턴을 따릅니다:

```
features/{feature-name}/
├── components/
│   ├── {Feature}List.tsx      # 목록 컴포넌트
│   ├── {Feature}Form.tsx      # 폼 컴포넌트
│   ├── {Feature}Content.tsx   # 컨텐츠 래퍼
│   └── {Feature}Detail.tsx    # 상세 컴포넌트
└── index.ts
```

## Server Actions 연동 패턴

### 목록 컴포넌트 패턴

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getItems } from '@/app/actions/item';  // Server Action import
import { Item } from '@/entities/item';

export const ItemList = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems();  // Server Action 호출
                setItems(data);
            } catch (err) {
                setError('데이터를 불러오는데 실패했습니다');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                    불러오는 중...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400">{error}</div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                    항목이 없습니다
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <ItemCard key={item.id} item={item} />
            ))}
        </div>
    );
};
```

### 폼 컴포넌트 패턴 (Server Actions 연동)

React Hook Form + Zod + Server Actions:

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { createItem, updateItem } from '@/app/actions/item';  // Server Actions
import { Item } from '@/entities/item';

// 1. Zod 스키마 정의
const formSchema = z.object({
    title: z.string()
        .min(1, '제목을 입력해주세요')
        .max(100, '제목은 100자 이하로 입력해주세요'),
    content: z.string()
        .min(10, '내용을 10자 이상 입력해주세요'),
    slug: z.string()
        .min(1, 'URL 경로를 입력해주세요')
        .regex(/^[a-z0-9-]+$/, '영문 소문자, 숫자, 하이픈만 사용 가능합니다'),
    published: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

// 2. Props 인터페이스
interface ItemFormProps {
    item?: Item;              // 수정 모드일 때 기존 데이터
    onComplete?: () => void;  // 완료 콜백
}

// 3. 컴포넌트
export const ItemForm = ({ item, onComplete }: ItemFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!item;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: item?.title || '',
            content: item?.content || '',
            slug: item?.slug || '',
            published: item?.published || false,
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        try {
            if (isEditMode) {
                await updateItem({ ...data, id: item.id });
                alert('수정되었습니다!');
            } else {
                await createItem(data);
                form.reset();
                alert('생성되었습니다!');
            }
            onComplete?.();
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* 제목 필드 */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    제목 <span className="text-red-500">*</span>
                </label>
                <input
                    {...form.register('title')}
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="제목을 입력하세요"
                />
                {form.formState.errors.title && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.title.message}
                    </span>
                )}
            </div>

            {/* URL 경로 필드 */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    URL 경로 <span className="text-red-500">*</span>
                </label>
                <input
                    {...form.register('slug')}
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="my-first-post"
                />
                {form.formState.errors.slug && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.slug.message}
                    </span>
                )}
            </div>

            {/* 내용 필드 */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...form.register('content')}
                    rows={15}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
                    placeholder="내용을 작성하세요 (Markdown 지원)"
                />
                {form.formState.errors.content && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.content.message}
                    </span>
                )}
            </div>

            {/* 체크박스 */}
            <label className="flex items-center gap-2">
                <input
                    {...form.register('published')}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                    바로 게시
                </span>
            </label>

            {/* 제출 버튼 */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                         text-white font-medium rounded-md transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {isSubmitting
                    ? isEditMode ? '수정 중...' : '작성 중...'
                    : isEditMode ? '수정하기' : '작성하기'}
            </button>
        </form>
    );
};
```

### 상세 컴포넌트 패턴

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getItemBySlug, incrementViews } from '@/app/actions/item';
import { Item } from '@/entities/item';

interface ItemDetailProps {
    slug: string;
}

export const ItemDetail = ({ slug }: ItemDetailProps) => {
    const [item, setItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItemBySlug(slug);

                if (!data) {
                    setError('항목을 찾을 수 없습니다.');
                    return;
                }

                setItem(data);
                // 조회수 증가 (비동기, 에러 무시)
                incrementViews(data.id);
            } catch (err) {
                console.error('Error loading item:', err);
                setError('항목을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                    불러오는 중...
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {error || '항목을 찾을 수 없습니다'}
                </h1>
                <button
                    onClick={() => router.push('/items')}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    ← 목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <article className="max-w-4xl mx-auto">
            <button
                onClick={() => router.push('/items')}
                className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
            >
                ← 목록으로
            </button>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {item.title}
            </h1>

            <div className="prose dark:prose-invert max-w-none">
                {item.content}
            </div>
        </article>
    );
};
```

## 날짜 포맷팅 유틸리티

```typescript
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
```

## 공통 UI 컴포넌트

### Skeleton (로딩 상태)

```typescript
// shared/ui/Skeleton.tsx
interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
    );
};

// 사용 예시
<Skeleton className="h-4 w-32" />           // 텍스트
<Skeleton className="h-48 w-full rounded-lg" />  // 이미지
<Skeleton className="h-10 w-10 rounded-full" /> // 아바타
```

### Button

```typescript
// shared/ui/Button.tsx
interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
}

export const Button = ({
    children,
    variant = 'primary',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
}: ButtonProps) => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2';

    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {loading ? '로딩 중...' : children}
        </button>
    );
};
```

## 스타일링 규칙

### Tailwind CSS 클래스 순서

1. 레이아웃 (display, position)
2. 크기 (width, height)
3. 마진/패딩
4. 테두리
5. 배경
6. 텍스트
7. 상태 (hover, focus)
8. 반응형/다크모드

```typescript
<div className="
    flex flex-col          // 레이아웃
    w-full max-w-md        // 크기
    p-6 mb-4               // 패딩/마진
    border border-gray-200 // 테두리
    bg-white               // 배경
    text-gray-900          // 텍스트
    hover:shadow-lg        // 상태
    dark:bg-gray-800       // 다크모드
    md:flex-row            // 반응형
">
```

### 다크모드 지원

모든 컴포넌트는 다크모드를 지원해야 합니다:

```typescript
<div className="
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    border-gray-200 dark:border-gray-700
">
```

## 아이콘

Lucide React를 사용합니다:

```typescript
import { ExternalLink, Github, Moon, Sun, Menu } from 'lucide-react';

<Github className="w-4 h-4" />
<ExternalLink className="w-5 h-5" />
```

## 접근성

- 모든 `<img>`에 `alt` 속성 필수
- 폼 필드에 `label` 연결
- 버튼에 명확한 텍스트 또는 `aria-label`
- 키보드 네비게이션 지원

```typescript
// 좋은 예
<button aria-label="메뉴 열기">
    <Menu className="w-5 h-5" />
</button>

// 나쁜 예
<button>
    <Menu className="w-5 h-5" />
</button>
```

## 실제 컴포넌트 예시

### BlogList 컴포넌트

```typescript
// features/blog-post/components/BlogList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts } from '@/app/actions/post';
import { Post } from '@/entities/post';

export const BlogList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPosts(true)
            .then(setPosts)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <LoadingState />;
    if (posts.length === 0) return <EmptyState />;

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

const PostCard = ({ post }: { post: Post }) => (
    <article className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg
                        bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100
                          hover:text-blue-600 dark:hover:text-blue-400">
                {post.title}
            </h2>
        </Link>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
            {post.excerpt}
        </p>
    </article>
);
```

### GuestbookForm 컴포넌트

```typescript
// features/guestbook/components/GuestbookForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { createGuestbookEntry } from '@/app/actions/guestbook';

const formSchema = z.object({
    nickname: z.string().min(1, '닉네임을 입력해주세요').max(20),
    message: z.string().min(1, '메시지를 입력해주세요').max(500),
});

type FormData = z.infer<typeof formSchema>;

interface GuestbookFormProps {
    onSuccess?: () => void;
}

export const GuestbookForm = ({ onSuccess }: GuestbookFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { nickname: '', message: '' },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            await createGuestbookEntry(data);
            form.reset();
            onSuccess?.();
            alert('메시지가 등록되었습니다!');
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input
                {...form.register('nickname')}
                placeholder="닉네임"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            />
            <textarea
                {...form.register('message')}
                placeholder="메시지를 남겨주세요"
                rows={3}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
                {isSubmitting ? '등록 중...' : '등록'}
            </button>
        </form>
    );
};
```
