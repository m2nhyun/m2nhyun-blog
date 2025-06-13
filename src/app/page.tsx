import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero Section */}
            <section className="text-center py-12">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    Minhyun&apos;s Blog
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    프론트엔드 개발과 기술에 대한 이야기를 나누는 공간입니다.
                    새로운 것을 배우고 경험을 공유합니다.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/blog"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        블로그 보기
                    </Link>
                    <Link
                        href="/portfolio"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        포트폴리오
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid gap-8 md:grid-cols-3">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        기술 블로그
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        개발 경험과 학습한 내용을 정리합니다
                    </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl mb-4">💻</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        프로젝트 쇼케이스
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        다양한 프로젝트와 포트폴리오를 소개합니다
                    </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        소통의 공간
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        방명록을 통해 의견을 나누어요
                    </p>
                </div>
            </section>

            {/* Recent Posts Preview */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
                    최근 포스트
                </h2>
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        첫 번째 포스트를 작성해보세요!
                    </p>
                    <Link
                        href="/blog"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        블로그로 이동 →
                    </Link>
                </div>
            </section>
        </div>
    );
}
