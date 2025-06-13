'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { createPost, updatePost } from '../services/postService';
import { Post } from '@/entities/post';

const postFormSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요'),
    slug: z.string().min(1, 'URL 경로를 입력해주세요'),
    content: z.string().min(10, '내용을 10자 이상 입력해주세요'),
    excerpt: z.string().optional(),
    tags: z.string().optional(),
    category: z.string().optional(),
    featured: z.boolean(),
    published: z.boolean(),
});

type PostFormData = z.infer<typeof postFormSchema>;

interface PostFormProps {
    post?: Post;
    onComplete?: () => void;
}

export const PostForm = ({ post, onComplete }: PostFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!post;

    const form = useForm<PostFormData>({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            excerpt: post?.excerpt || '',
            tags: post?.tags?.join(', ') || '',
            category: post?.category || '',
            featured: post?.featured || false,
            published: post?.published || false,
        },
    });

    // slug 유효성 검사 함수
    const validateSlug = (slug: string): boolean => {
        return /^[a-z0-9-]+$/.test(slug);
    };

    const onSubmit = async (data: PostFormData) => {
        setIsSubmitting(true);

        try {
            // slug 유효성 검사
            if (!validateSlug(data.slug)) {
                alert(
                    'URL 경로는 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.',
                );
                setIsSubmitting(false);
                return;
            }

            const tags = data.tags
                ? data.tags
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                : [];

            const postData = {
                title: data.title,
                content: data.content,
                slug: data.slug,
                excerpt: data.excerpt,
                tags,
                category: data.category,
                featured: data.featured,
                published: data.published,
            };

            if (isEditMode) {
                await updatePost({ ...postData, id: post.id });
                alert('포스트가 수정되었습니다!');
            } else {
                await createPost(postData);
                form.reset({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    tags: '',
                    category: '',
                    featured: false,
                    published: false,
                });
                alert('포스트가 생성되었습니다!');
            }

            onComplete?.();
        } catch (error) {
            console.error('Error saving post:', error);
            alert(
                isEditMode
                    ? '포스트 수정 중 오류가 발생했습니다.'
                    : '포스트 생성 중 오류가 발생했습니다.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
        >
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
                    placeholder="포스트 제목을 입력하세요"
                />
                {form.formState.errors.title && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.title.message}
                    </span>
                )}
            </div>

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
                    placeholder="my-first-blog-post"
                />
                {form.formState.errors.slug && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.slug.message}
                    </span>
                )}
                <span className="text-xs text-gray-500">URL에 사용됩니다:</span>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    요약 (선택)
                </label>
                <input
                    {...form.register('excerpt')}
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="포스트 요약을 입력하세요"
                />
            </div>

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
                    placeholder="포스트 내용을 작성하세요 (Markdown 지원)"
                />
                {form.formState.errors.content && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.content.message}
                    </span>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        태그
                    </label>
                    <input
                        {...form.register('tags')}
                        type="text"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="React, TypeScript, Next.js"
                    />
                    <span className="text-xs text-gray-500">
                        쉼표(,)로 구분하여 입력
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        카테고리
                    </label>
                    <select
                        {...form.register('category')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">카테고리 선택</option>
                        <option value="frontend">프론트엔드</option>
                        <option value="backend">백엔드</option>
                        <option value="devops">DevOps</option>
                        <option value="general">일반</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input
                        {...form.register('featured')}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                        주요 포스트로 설정
                    </span>
                </label>

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
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                         text-white font-medium rounded-md transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {isSubmitting
                    ? isEditMode
                        ? '수정 중...'
                        : '작성 중...'
                    : isEditMode
                      ? '포스트 수정'
                      : '포스트 작성'}
            </button>
        </form>
    );
};
