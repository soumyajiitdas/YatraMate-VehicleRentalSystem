const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
    const sizeClasses = {
        small: 'h-6 w-6 border-2',
        medium: 'h-12 w-12 border-3',
        large: 'h-16 w-16 border-4',
    };

    const spinner = (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClasses[size]} border-primary-600 border-t-transparent rounded-full animate-spin`}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                <div className="text-center">
                    {spinner}
                    <p className="mt-4 text-neutral-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
