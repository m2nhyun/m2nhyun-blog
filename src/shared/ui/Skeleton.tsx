interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
    );
};

export const PostCardSkeleton = () => {
    return (
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    );
};

export const PostListSkeleton = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-32 mb-6" />
            {[1, 2, 3].map((i) => (
                <PostCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const GuestbookCardSkeleton = () => {
    return (
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
};

export const GuestbookListSkeleton = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-40 mb-6" />
            {[1, 2, 3].map((i) => (
                <GuestbookCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const PortfolioCardSkeleton = () => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <Skeleton className="aspect-video w-full" />
            <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export const PortfolioGridSkeleton = () => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <PortfolioCardSkeleton key={i} />
            ))}
        </div>
    );
};
