import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { ThemeProvider } from '@/features/theme';

export const metadata: Metadata = {
    title: 'Blog',
    description: '김민현의 블로그',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <ThemeProvider>
                    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
                        <Header />
                        <div className="flex flex-1 mt-14">
                            <main className="flex-1 p-4 mx-auto max-w-[640px]">
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
