'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const loginFormSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
    onComplete?: () => void;
}

export const LoginForm = ({ onComplete }: LoginFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);

        try {
            // TODO: Firebase Auth 로그인 로직 구현
            console.log('Login data:', data);

            onComplete?.();

            alert('로그인이 완료되었습니다!');
        } catch (error) {
            console.error('Error during login:', error);
            alert('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    관리자 로그인
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    블로그 관리를 위해 로그인해주세요
                </p>
            </div>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        이메일
                    </label>
                    <input
                        {...form.register('email')}
                        type="email"
                        className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="이메일을 입력하세요"
                    />
                    {form.formState.errors.email && (
                        <span className="text-sm text-red-500">
                            {form.formState.errors.email.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        비밀번호
                    </label>
                    <div className="relative">
                        <input
                            {...form.register('password')}
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="비밀번호를 입력하세요"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                     text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <span className="text-sm text-red-500">
                            {form.formState.errors.password.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                             text-white font-medium rounded-md transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isSubmitting ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
};
