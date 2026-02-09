'use client';

import Link from 'next/link';
import { DarkModeToggle } from '@/features/theme';
import { Sidebar } from './Sidebar';

export function Header() {
    return (
        <header
            className="fixed top-0 left-[5%] right-[5%] z-10 
        bg-white dark:bg-gray-800 text-black dark:text-white 
        border-b-[2px] border-slate-200 dark:border-slate-600"
        >
            <nav
                className="container px-4 py-2  justify-between 
                items-center flex"
            >
                <Link href={'/'} className="text-xl font-semibold">
                    Minhyun
                </Link>
                <div className="flex gap-5">
                    <Sidebar />

                    <DarkModeToggle />
                </div>
            </nav>
        </header>
    );
}
