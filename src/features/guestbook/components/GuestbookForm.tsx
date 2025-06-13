'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

const guestbookFormSchema = z.object({
    name: z
        .string()
        .min(1, '이름을 입력해주세요')
        .max(50, '이름은 50자 이하로 입력해주세요'),
    message: z
        .string()
        .min(1, '메시지를 입력해주세요')
        .max(500, '메시지는 500자 이하로 입력해주세요'),
    email: z
        .string()
        .email('올바른 이메일 형식이 아닙니다')
        .optional()
        .or(z.literal('')),
});

type GuestbookFormData = z.infer<typeof guestbookFormSchema>;

interface GuestbookFormProps {
    onComplete?: () => void;
}

export const GuestbookForm = ({ onComplete }: GuestbookFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<GuestbookFormData>({
        resolver: zodResolver(guestbookFormSchema),
        defaultValues: {
            name: '',
            message: '',
            email: '',
        },
    });

    const onSubmit = async (data: GuestbookFormData) => {
        setIsSubmitting(true);

        try {
            // TODO: services에서 방명록 저장 API 호출
            console.log('Guestbook data:', data);

            form.reset();
            onComplete?.();

            alert('방명록이 등록되었습니다!');
        } catch (error) {
            console.error('Error submitting guestbook:', error);
            alert('방명록 등록 중 오류가 발생했습니다.');
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
                    이름 <span className="text-red-500">*</span>
                </label>
                <input
                    {...form.register('name')}
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름을 입력하세요"
                />
                {form.formState.errors.name && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.name.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    이메일 (선택)
                </label>
                <input
                    {...form.register('email')}
                    type="email"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일 주소 (선택사항)"
                />
                {form.formState.errors.email && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    메시지 <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...form.register('message')}
                    rows={6}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="방명록에 남길 메시지를 작성하세요"
                />
                {form.formState.errors.message && (
                    <span className="text-sm text-red-500">
                        {form.formState.errors.message.message}
                    </span>
                )}
                <span className="text-xs text-gray-500">
                    {form.watch('message')?.length || 0}/500자
                </span>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                         text-white font-medium rounded-md transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {isSubmitting ? '등록 중...' : '방명록 등록'}
            </button>
        </form>
    );
};
