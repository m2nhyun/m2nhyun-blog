'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from '@/components';
import { categories } from '@/data';

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
            {/* <aside
                className={`fixed top-14 left-[5%] w-60'
                h-auto overflow-y-auto p-4  bg-white dark:bg-gray-900 
                text-black dark:text-white mt-5 border-[2px] rounded-xl border-slate-900
                dark:border-slate-100`}
            >
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
            </aside> */}
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Categories</MenubarTrigger>
                    <MenubarContent
                    //         className="bg-white dark:bg-gray-900
                    // text-black dark:text-white border-[2px] rounded-xl border-slate-900
                    // dark:border-slate-100"
                    >
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
