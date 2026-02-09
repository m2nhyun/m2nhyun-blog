import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { ThemeProvider } from '@/features/theme';

export const metadata: Metadata = {
    title: {
        default: '김민현 블로그 | Minhyun Blog',
        template: '%s | 김민현 블로그',
    },
    description:
        '프론트엔드 개발자 김민현의 기술 블로그입니다. React, TypeScript, Next.js 등 웹 개발 관련 글을 공유합니다.',
    keywords: [
        '프론트엔드',
        '개발자',
        'React',
        'TypeScript',
        'Next.js',
        '블로그',
        '웹개발',
    ],
    authors: [{ name: '김민현', url: 'https://m2nhyun-blog.vercel.app' }],
    creator: '김민현',
    publisher: '김민현',
    metadataBase: new URL('https://m2nhyun-blog.vercel.app'),
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: 'https://m2nhyun-blog.vercel.app',
        siteName: '김민현 블로그',
        title: '김민현 블로그 | Minhyun Blog',
        description:
            '프론트엔드 개발자 김민현의 기술 블로그입니다. React, TypeScript, Next.js 등 웹 개발 관련 글을 공유합니다.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: '김민현 블로그',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '김민현 블로그 | Minhyun Blog',
        description: '프론트엔드 개발자 김민현의 기술 블로그입니다.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var isDark = localStorage.getItem('darkMode') === 'true';
                                    if (isDark) {
                                        document.documentElement.classList.add('dark');
                                    }
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body className="flex flex-col min-h-screen">
                <ThemeProvider>
                    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
                        <Header />
                        <div className="flex flex-1 mt-14">
                            <main className="flex-1 p-4 w-full">
                                {children}
                            </main>
                        </div>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
