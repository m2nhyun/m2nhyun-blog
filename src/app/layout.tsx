import type { Metadata } from 'next';
// import { Inter } from "next/font/google";
import './globals.css';
import { Header } from '@/components';

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
      <body className="ml-auto mr-auto max-w-4xl">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
