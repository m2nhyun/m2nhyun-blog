import Link from 'next/link';
import { getPosts } from '@/app/actions/post';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
    const recentPosts = await getPosts(true).then((posts) => posts.slice(0, 3));

    return (
        <div className="max-w-4xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="py-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    김민현
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-xl">
                    프론트엔드 개발자. React, TypeScript, Next.js를 주로
                    다룹니다. 배운 것을 기록하고, 만든 것을 공유합니다.
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/blog"
                        className="px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        블로그 보기
                    </Link>
                    <Link
                        href="/portfolio"
                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                        포트폴리오
                    </Link>
                </div>
            </section>

            {/* Quick Links */}
            <section className="grid gap-4 md:grid-cols-3">
                <Link
                    href="/blog"
                    className="group p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                        블로그
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        개발 경험과 학습 내용을 정리합니다
                    </p>
                </Link>

                <Link
                    href="/portfolio"
                    className="group p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                        포트폴리오
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        진행한 프로젝트들을 소개합니다
                    </p>
                </Link>

                <Link
                    href="/guestbook"
                    className="group p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                        방명록
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        방문해주셔서 감사합니다
                    </p>
                </Link>
            </section>

            {/* Recent Posts */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        최근 포스트
                    </h2>
                    <Link
                        href="/blog"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        전체 보기 →
                    </Link>
                </div>

                {recentPosts.length > 0 ? (
                    <div className="space-y-4">
                        {recentPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="block p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {post.excerpt || post.content.slice(0, 100)}
                                </p>
                                <time className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                                    {new Date(
                                        post.createdAt,
                                    ).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 py-8 text-center">
                        아직 작성된 포스트가 없습니다.
                    </p>
                )}
            </section>
        </div>
    );
}
