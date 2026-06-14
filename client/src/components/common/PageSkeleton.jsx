import { useLocation } from 'react-router-dom';

const PageSkeleton = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    if (isHome) {
        return (
            <div className="min-h-screen bg-[#fafaf7] animate-pulse overflow-hidden">
                {/* Hero Section Skeleton */}
                <section className="relative pt-10 pb-24 sm:pt-16 lg:pt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Status pill */}
                        <div className="w-64 h-8 bg-neutral-200 rounded-full mb-8" />
                        
                        {/* Mega headline */}
                        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="h-16 sm:h-20 bg-neutral-200 rounded-2xl w-3/4" />
                                <div className="h-16 sm:h-20 bg-neutral-200 rounded-2xl w-1/2" />
                            </div>
                            <div className="lg:col-span-4 space-y-5">
                                <div className="h-24 bg-neutral-200 rounded-xl w-full" />
                                <div className="flex gap-3">
                                    <div className="h-14 bg-neutral-200 rounded-full w-36" />
                                    <div className="h-14 bg-neutral-200 rounded-full w-36" />
                                </div>
                            </div>
                        </div>

                        {/* Hero image collage skeleton */}
                        <div className="grid grid-cols-12 gap-3 sm:gap-5 mt-6">
                            <div className="col-span-12 sm:col-span-7 h-72 sm:h-[420px] bg-neutral-200 rounded-3xl" />
                            <div className="col-span-12 sm:col-span-5 grid grid-rows-2 gap-3 sm:gap-5">
                                <div className="bg-neutral-200 rounded-3xl h-full min-h-[140px] sm:min-h-[200px]" />
                                <div className="bg-neutral-200 rounded-3xl h-full min-h-[140px] sm:min-h-[200px]" />
                            </div>
                        </div>

                        {/* Stat strip skeleton */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white border border-neutral-100 rounded-2xl h-28" />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] animate-pulse">
            {/* Generic Header Skeleton */}
            <div className="bg-neutral-200 h-64 w-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Content Skeleton */}
                <div className="space-y-8">
                    {/* Title */}
                    <div className="h-10 bg-neutral-200 rounded-xl w-1/3" />

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl border border-neutral-100 p-4">
                                <div className="h-48 bg-neutral-200 rounded-2xl mb-4" />
                                <div className="space-y-3">
                                    <div className="h-6 bg-neutral-200 rounded-lg w-3/4" />
                                    <div className="h-4 bg-neutral-200 rounded-lg w-1/2" />
                                    <div className="h-4 bg-neutral-200 rounded-lg w-full" />
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
