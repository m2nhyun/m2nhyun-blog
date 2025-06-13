'use client';

// components/PostForm.tsx
import { createPost } from '@/apis';
import { useState } from 'react';

export default function PostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const slug = title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            await createPost({
                title,
                content,
                slug,
                tags,
            });

            // 폼 초기화
            setTitle('');
            setContent('');
            setTags([]);

            alert('포스트가 생성되었습니다!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('포스트 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">내용</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    rows={10}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">
                    태그 (쉼표로 구분)
                </label>
                <input
                    type="text"
                    value={tags.join(', ')}
                    onChange={(e) =>
                        setTags(
                            e.target.value.split(',').map((tag) => tag.trim()),
                        )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
                포스트 작성
            </button>
        </form>
    );
}
