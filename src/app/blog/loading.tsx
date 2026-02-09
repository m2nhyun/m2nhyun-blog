import { PostListSkeleton } from '@/shared/ui';

export default function BlogLoading() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-4" />
                <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
            </div>
            <PostListSkeleton />
        </div>
    );
}
