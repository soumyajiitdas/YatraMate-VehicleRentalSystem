const VehicleCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-56 bg-neutral-300" />

            {/* Content Skeleton */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-neutral-300 rounded w-1/2" />
                    <div className="h-6 bg-neutral-300 rounded-full w-16" />
                </div>

                <div className="space-y-3 mb-4">
                    <div className="h-4 bg-neutral-300 rounded w-3/4" />
                    <div className="h-4 bg-neutral-300 rounded w-1/2" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="h-8 bg-neutral-300 rounded w-1/3" />
                    <div className="h-10 bg-neutral-300 rounded-xl w-1/3" />
                </div>
            </div>
        </div>
    );
};

export default VehicleCardSkeleton;
