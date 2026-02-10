'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import {
    createPortfolioItem,
    updatePortfolioItem,
} from '@/app/actions/portfolio';
import { PortfolioItem } from '@/entities/portfolio-item';

const portfolioFormSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요'),
    description: z.string().min(10, '설명을 10자 이상 입력해주세요'),
    technologies: z.string().min(1, '기술 스택을 입력해주세요'),
    category: z.enum(['web', 'mobile', 'desktop', 'library', 'design']),
    status: z.enum(['completed', 'in-progress', 'planned']),
    githubUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    featured: z.boolean(),
    order: z.number().min(0),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

type PortfolioFormData = z.infer<typeof portfolioFormSchema>;

interface PortfolioFormProps {
    item?: PortfolioItem;
    onComplete?: () => void;
}

const categoryLabels: Record<PortfolioItem['category'], string> = {
    web: '웹',
    mobile: '모바일',
    desktop: '데스크톱',
    library: '라이브러리',
    design: '디자인',
};

const statusLabels: Record<PortfolioItem['status'], string> = {
    completed: '완료',
    'in-progress': '진행 중',
    planned: '계획됨',
};

export const PortfolioForm = ({ item, onComplete }: PortfolioFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!item;

    const form = useForm<PortfolioFormData>({
        resolver: zodResolver(portfolioFormSchema),
        defaultValues: {
            title: item?.title || '',
            description: item?.description || '',
            technologies: item?.technologies?.join(', ') || '',
            category: item?.category || 'web',
            status: item?.status || 'completed',
            githubUrl: item?.githubUrl || '',
            liveUrl: item?.liveUrl || '',
            demoUrl: item?.demoUrl || '',
            featured: item?.featured || false,
            order: item?.order || 0,
            startDate: item?.startDate || '',
            endDate: item?.endDate || '',
        },
    });

    const onSubmit = async (data: PortfolioFormData) => {
        setIsSubmitting(true);

        try {
            const technologies = data.technologies
                .split(',')
                .map((tech) => tech.trim())
                .filter(Boolean);

            const portfolioData = {
                title: data.title,
                description: data.description,
                technologies,
                category: data.category,
                status: data.status,
                githubUrl: data.githubUrl || undefined,
                liveUrl: data.liveUrl || undefined,
                demoUrl: data.demoUrl || undefined,
                featured: data.featured,
                order: data.order,
                startDate: data.startDate || undefined,
                endDate: data.endDate || undefined,
            };

            if (isEditMode) {
                await updatePortfolioItem({ ...portfolioData, id: item.id });
                alert('포트폴리오가 수정되었습니다!');
            } else {
                await createPortfolioItem(portfolioData);
                form.reset({
                    title: '',
                    description: '',
                    technologies: '',
                    category: 'web',
                    status: 'completed',
                    githubUrl: '',
                    liveUrl: '',
                    demoUrl: '',
                    featured: false,
                    order: 0,
                    startDate: '',
                    endDate: '',
                });
                alert('포트폴리오가 추가되었습니다!');
            }

            onComplete?.();
        } catch (error) {
            console.error('Error saving portfolio:', error);
            alert(
                isEditMode
                    ? '포트폴리오 수정 중 오류가 발생했습니다.'
                    : '포트폴리오 추가 중 오류가 발생했습니다.',
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
                    프로젝트명 <span className="text-red-500">*</span>
                </label>
                <input
                    {...form.register('title')}
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    placeholder="프로젝트 이름을 입력하세요"
                />
                {form.formState.errors.title && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.title.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...form.register('description')}
                    rows={5}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 resize-y"
                    placeholder="프로젝트 설명을 입력하세요"
                />
                {form.formState.errors.description && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.description.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    기술 스택 <span className="text-red-500">*</span>
                </label>
                <input
                    {...form.register('technologies')}
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    placeholder="React, TypeScript, Next.js"
                />
                <span className="text-xs text-gray-500">
                    쉼표(,)로 구분하여 입력
                </span>
                {form.formState.errors.technologies && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.technologies.message}
                    </span>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        카테고리
                    </label>
                    <select
                        {...form.register('category')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    >
                        {Object.entries(categoryLabels).map(
                            ([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ),
                        )}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        상태
                    </label>
                    <select
                        {...form.register('status')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    >
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        GitHub URL
                    </label>
                    <input
                        {...form.register('githubUrl')}
                        type="url"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        placeholder="https://github.com/..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        라이브 URL
                    </label>
                    <input
                        {...form.register('liveUrl')}
                        type="url"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        placeholder="https://..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        데모 URL
                    </label>
                    <input
                        {...form.register('demoUrl')}
                        type="url"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        placeholder="https://..."
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        시작일
                    </label>
                    <input
                        {...form.register('startDate')}
                        type="date"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        종료일
                    </label>
                    <input
                        {...form.register('endDate')}
                        type="date"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        순서
                    </label>
                    <input
                        {...form.register('order', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    />
                </div>
            </div>

            <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input
                        {...form.register('featured')}
                        type="checkbox"
                        className="w-4 h-4 text-gray-600 dark:text-gray-300 border-gray-300 rounded focus:ring-gray-400 dark:focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                        주요 프로젝트로 표시
                    </span>
                </label>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200
                         text-white dark:text-gray-900 font-medium rounded-md transition-colors duration-200
                         disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
                {isSubmitting
                    ? isEditMode
                        ? '수정 중...'
                        : '추가 중...'
                    : isEditMode
                      ? '포트폴리오 수정'
                      : '포트폴리오 추가'}
            </button>
        </form>
    );
};
