# 컴포넌트 가이드

이 문서는 프로젝트에서 사용되는 컴포넌트 패턴과 사용법을 설명합니다.

## 컴포넌트 구조

### Feature 컴포넌트

각 feature의 컴포넌트는 다음 패턴을 따릅니다:

```
features/{feature-name}/
├── components/
│   ├── {Feature}List.tsx    # 목록 컴포넌트
│   ├── {Feature}Form.tsx    # 폼 컴포넌트
│   ├── {Feature}Content.tsx # 컨텐츠 래퍼
│   └── {Feature}Detail.tsx  # 상세 컴포넌트
└── index.ts
```

## UI 패턴

### 목록 컴포넌트 패턴

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getItems } from '../services/itemService';
import { Item } from '@/entities/item';

export const ItemList = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems();
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

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorMessage message={error} />;
    if (items.length === 0) return <EmptyState />;

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <ItemCard key={item.id} item={item} />
            ))}
        </div>
    );
};
```

### 폼 컴포넌트 패턴

React Hook Form과 Zod를 사용한 폼 패턴:

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

// 1. 스키마 정의
const formSchema = z.object({
    title: z.string()
        .min(1, '제목을 입력해주세요')
        .max(100, '제목은 100자 이하로 입력해주세요'),
    content: z.string()
        .min(1, '내용을 입력해주세요'),
    email: z.string()
        .email('올바른 이메일 형식이 아닙니다')
        .optional()
        .or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

// 2. 컴포넌트
interface FormProps {
    onComplete?: () => void;
    initialData?: Partial<FormData>;
}

export const ItemForm = ({ onComplete, initialData }: FormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || '',
            email: initialData?.email || '',
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            await createItem(data);
            form.reset();
            onComplete?.();
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 필드들 */}
            <FormField
                label="제목"
                required
                error={form.formState.errors.title?.message}
            >
                <input {...form.register('title')} />
            </FormField>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : '저장'}
            </button>
        </form>
    );
};
```

## 공통 UI 컴포넌트

### Button

```typescript
import { Button } from '@/shared/ui';

<Button variant="primary">저장</Button>
<Button variant="secondary">취소</Button>
<Button variant="danger">삭제</Button>
<Button disabled loading>로딩 중...</Button>
```

### Skeleton (로딩 상태)

```typescript
import { Skeleton } from '@/shared/ui';

// 텍스트 스켈레톤
<Skeleton className="h-4 w-32" />

// 이미지 스켈레톤
<Skeleton className="h-48 w-full rounded-lg" />

// 아바타 스켈레톤
<Skeleton className="h-10 w-10 rounded-full" />
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
8. 반응형

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
import { ExternalLink, Github, Moon, Sun } from 'lucide-react';

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
