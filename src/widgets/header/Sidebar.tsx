'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/shared/ui';
import { categories } from '@/shared/constants';

export function Sidebar() {
    const pathname = usePathname();

    const linkStyle =
        'block w-full py-2 px-4 rounded-md transition-colors duration-200 ease-in-out';
    const activeLinkStyle =
        'bg-slate-300 font-medium font-semibold dark:bg-gray-500 ';
    const inactiveLinkStyle =
        'bg-white dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-gray-700';

    return (
        <>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Categories</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem className="flex flex-col gap-2">
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
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </>
    );
}
