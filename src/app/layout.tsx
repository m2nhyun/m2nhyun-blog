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
import { Footer, Header, Sidebar } from '@/components';
import { ThemeProvider } from '@/components';

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
            <ThemeProvider>
                <body className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
                    <Header />
                    <div className="flex flex-1 mt-14">
                        <main className="flex-1 p-4 mx-auto max-w-[640px] ">
                            {children}
                        </main>
                    </div>
                </body>
                <footer className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white items-center">
                    <Footer />
                </footer>
            </ThemeProvider>
        </html>
    );
}
