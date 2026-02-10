'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DarkModeToggle } from '@/features/theme';
import { Sidebar } from './Sidebar';

const navLinks = [
    { href: '/blog', label: 'Blog' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/guestbook', label: 'Guestbook' },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                    Minhyun
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors ${
                                pathname === link.href ||
                                pathname.startsWith(link.href + '/')
                                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <DarkModeToggle />
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden items-center gap-3">
                    <Sidebar />
                    <DarkModeToggle />
                </div>
            </nav>
        </header>
    );
}
