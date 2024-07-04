import { GithubIcon, InstagramIcon, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <>
            <div className="pb-[40px] border-t-2 pt-4 border-slate-600 dark:border-slate-200">
                <div className="flex gap-10 justify-center">
                    <Link
                        href="https://github.com/m2nhyun"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-black dark:text-slate-200"
                    >
                        <GithubIcon />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/%EB%AF%BC%ED%98%84-%EA%B9%80-ba92012b3/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-black dark:text-slate-200"
                    >
                        <InstagramIcon />
                    </Link>
                    <Link
                        href="https://www.instagram.com/m2n.__.hyun/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-black dark:text-slate-200"
                    >
                        <LinkedinIcon />
                    </Link>
                </div>
                <div className="text-xs py-2">Copyright © 2024 MinhyunKim</div>
            </div>
        </>
    );
}
