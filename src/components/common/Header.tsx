// import Link from 'next/link';
// // import Image from 'next/image';

// export function Header() {
//   return (
//     <>
//       {/* <header className="px-5">
//         <div className="flex justify-between border-b px-5 items-center h-14 sticky">
//           <Link href={'/'}>
//             <div className="text-3xl">Minhyun</div>
//           </Link>{' '}
//           <div className="flex gap-2 text-lg">
//           </div>
//         </div>
//       </header> */}
//       <header className="fixed top-0 left-[50%] translate-x-[-50%] flex justify-between items-center w-full h-14 border-b border-border bg-white">
//         <div className="flex items-center gap-4">
//           <div>
//             <Link href={'/'}>Minhyun</Link>
//           </div>
//         </div>
//         <div className="flex gap-2.5">
//           <div>다크모드</div>
//           <div>깃헙</div>
//           <Link href="/mypage"></Link>
//         </div>
//       </header>
//     </>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DarkModeToggle } from '../theme';
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
