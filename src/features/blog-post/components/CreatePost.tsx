import { PostForm } from './PostForm';

export const CreatePost = () => {
    const handlePostComplete = () => {
        // TODO: 포스트 작성 완료 후 처리 로직
        // 예: 블로그 목록 페이지로 리다이렉트
        console.log('Post creation completed');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    새 포스트 작성
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    새로운 블로그 포스트를 작성해보세요. Markdown 문법을
                    지원합니다.
                </p>
            </div>
            <PostForm onComplete={handlePostComplete} />
        </div>
    );
};
