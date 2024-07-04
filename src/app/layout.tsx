// import type { Metadata } from 'next';
// // import { Inter } from "next/font/google";
// import './globals.css';
// import { Header, Sidebar } from '@/components';

// // const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'MinHyun_Blog',
//   description: 'next app',
// };

// export default function BaseLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head></head>
//       <body className="w-full h-screeen bg-slate-50">
//         <Header />
//         <Sidebar />
//         <main className="w-full h-full max-w-[640px] bg-white overflow-auto mx-auto pt-[80px]">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Header, Sidebar } from '@/components';
import { ThemeProvider } from '@/components';

export const metadata: Metadata = {
    title: 'My Blog',
    description: 'My personal blog built with Next.js',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <ThemeProvider>
                <body className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
                    <Header />
                    <div className="flex flex-1 mt-14">
                        <Sidebar position="left" />
                        <main
                            className="flex-1 p-4 ml-[360px] mr-[280px] border-t-[2px]
                        border-slate-800 dark:border-slate-300"
                        >
                            {children}
                        </main>
                        <Sidebar position="right" />
                    </div>
                </body>
            </ThemeProvider>
        </html>
    );
}
