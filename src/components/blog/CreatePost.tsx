// pages/admin/create.tsx

import PostForm from './PostForm';

export function CreatePost() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-8">새 포스트 작성</h1>
            <PostForm />
        </div>
    );
}
