export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
            </div>
        </div>
    );
}
