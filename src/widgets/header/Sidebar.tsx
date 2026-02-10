'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/shared/ui';

const mobileLinks = [
    { href: '/blog', label: 'Blog' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/guestbook', label: 'Guestbook' },
    { href: '/resume', label: 'Resume' },
    { href: '/information', label: 'Information' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <Menubar className="border-0 bg-transparent p-0">
            <MenubarMenu>
                <MenubarTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                    <Menu className="w-5 h-5" />
                </MenubarTrigger>
                <MenubarContent align="end" className="min-w-[160px]">
                    {mobileLinks.map((link) => (
                        <MenubarItem key={link.href} asChild>
                            <Link
                                href={link.href}
                                className={`block w-full px-3 py-2 text-sm rounded-md ${
                                    pathname === link.href ||
                                    pathname.startsWith(link.href + '/')
                                        ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {link.label}
                            </Link>
                        </MenubarItem>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
