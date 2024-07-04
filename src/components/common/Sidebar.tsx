'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components';

const categories = [
    { name: 'Blog', path: '/blog' },
    { name: 'Information', path: '/information' },
    { name: 'Portfolio', path: '/portfolio' },
];

const socialLinks = [
    { name: 'Github', url: 'https://github.com/m2nhyun' },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/%EB%AF%BC%ED%98%84-%EA%B9%80-ba92012b3/',
    },
    { name: 'Instagram', url: 'https://www.instagram.com/m2n.__.hyun/' },
];

export function Sidebar({ position }: { position: 'left' | 'right' }) {
    const pathname = usePathname();

    const linkStyle =
        'block w-full py-2 px-4 rounded-md transition-colors duration-200 ease-in-out';
    const activeLinkStyle = 'bg-slate-200 dark:bg-gray-700 font-medium';
    const inactiveLinkStyle =
        'bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700';

    return (
        <aside
            className={`fixed top-14 ${position === 'left' ? 'left-[5%] w-60' : 'right-[5%] w-40'} 
                h-auto overflow-y-auto p-4  bg-white dark:bg-gray-900 
                text-black dark:text-white mt-5 border-[2px] rounded-xl border-slate-900
                dark:border-slate-100`}
        >
            {position === 'left' ? (
                <Card className="bg-white dark:bg-gray-900 border-none shadow-none">
                    <CardHeader className="p-4 h-16">
                        <CardTitle className="text-xl font-bold pl-3 text-black dark:text-white">
                            Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {categories.map((category) => (
                            <Link
                                key={category.path}
                                href={category.path}
                                className={`${linkStyle} ${
                                    pathname === category.path
                                        ? activeLinkStyle
                                        : inactiveLinkStyle
                                }`}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                        Links
                    </h2>
                    <div className="flex flex-col space-y-2">
                        {socialLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-black dark:text-slate-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
