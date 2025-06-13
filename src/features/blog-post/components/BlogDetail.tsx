import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// TODO: entities/post에서 타입 import 예정
interface BlogDetailProps {
    params: { slug: string };
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'content/blog');

    // 디렉토리가 존재하지 않는 경우 빈 배열 반환
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => ({
            slug: fileName.replace(/\.md$/, ''),
        }));
}

export async function BlogDetail({ params }: BlogDetailProps) {
    try {
        const fullPath = path.join(
            process.cwd(),
            'content/blog',
            `${params.slug}.md`,
        );

        if (!fs.existsSync(fullPath)) {
            return (
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        포스트를 찾을 수 없습니다
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        요청하신 포스트가 존재하지 않습니다.
                    </p>
                </div>
            );
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const processedContent = await remark().use(html).process(content);
        const contentHtml = processedContent.toString();

        return (
            <article className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {data.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {data.date && (
                            <time dateTime={data.date}>
                                {new Date(data.date).toLocaleDateString(
                                    'ko-KR',
                                )}
                            </time>
                        )}
                        {data.author && <span>작성자: {data.author}</span>}
                    </div>

                    {data.tags && Array.isArray(data.tags) && (
                        <div className="flex flex-wrap gap-2">
                            {data.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 
                                             text-blue-800 dark:text-blue-200 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none
                             prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                             prose-p:text-gray-700 dark:prose-p:text-gray-300
                             prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                             prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </article>
        );
    } catch (error) {
        console.error('Error loading blog post:', error);

        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                    오류가 발생했습니다
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    포스트를 불러오는 중 문제가 발생했습니다.
                </p>
            </div>
        );
    }
}
