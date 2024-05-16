import type { Metadata } from 'next';
// import { Inter } from "next/font/google";
import './globals.css';
import { Header, Sidebar } from '@/components';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MinHyun_Blog',
  description: 'next app',
};

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className="p-4">
        <Header />
        <Sidebar />
        <main className="ml-auto mr-auto max-w-xl pt-2 pl-10">{children}</main>
      </body>
    </html>
  );
}
