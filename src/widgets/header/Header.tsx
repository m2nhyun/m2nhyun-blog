'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DarkModeToggle } from '@/features/theme';
import { Sidebar } from './Sidebar';

export function Header() {
    const [opacity, setOpacity] = useState(0);
    console.log(opacity);

    useEffect(() => {
        const handleScroll = () => {
            const newOpacity = Math.min(window.scrollY / 100, 0.8);
            setOpacity(newOpacity);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
