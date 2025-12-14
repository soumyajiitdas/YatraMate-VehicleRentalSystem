import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const configs = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            iconColor: 'text-green-500',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-secondary-50',
            borderColor: 'border-secondary-500',
            textColor: 'text-secondary-800',
            iconColor: 'text-secondary-500',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-accent-50',
            borderColor: 'border-accent-500',
            textColor: 'text-accent-800',
            iconColor: 'text-accent-500',
        },
        info: {
            icon: Info,
            bgColor: 'bg-primary-50',
            borderColor: 'border-primary-500',
            textColor: 'text-primary-800',
            iconColor: 'text-primary-500',
        },
    };

    const config = configs[type] || configs.info;
    const Icon = config.icon;

    return (
        <div
            className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border-l-4 rounded-lg shadow-lg pointer-events-auto
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
        min-w-[320px] max-w-md
        `}
            role="alert"
            data-testid={`toast-${type}`}
        >
            <div className="flex items-start gap-3 p-4">
                <Icon className={`${config.iconColor} shrink-0 mt-0.5`} size={20} />
                <p className="flex-1 text-sm font-medium leading-relaxed">
                    {message}
                </p>
                <button
                    onClick={handleClose}
                    className={`${config.iconColor} hover:opacity-70 transition-opacity shrink-0`}
                    aria-label="Close notification"
                    data-testid="toast-close-button"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
