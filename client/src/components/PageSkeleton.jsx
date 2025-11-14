const PageSkeleton = () => {
    return (
        <div className="min-h-screen bg-neutral-50 animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="bg-linear-to-r from-neutral-300 to-neutral-400 h-96 w-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Content Skeleton */}
                <div className="space-y-8">
                    {/* Title */}
                    <div className="h-8 bg-neutral-300 rounded w-1/3" />

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-card p-6">
                                <div className="h-48 bg-neutral-300 rounded-xl mb-4" />
                                <div className="space-y-3">
                                    <div className="h-6 bg-neutral-300 rounded w-3/4" />
                                    <div className="h-4 bg-neutral-300 rounded w-1/2" />
                                    <div className="h-4 bg-neutral-300 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageSkeleton;
