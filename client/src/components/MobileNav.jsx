import { Link, useLocation } from 'react-router-dom';
import { House, CarFront, BadgeIndianRupee, ClipboardList, UserPlus} from 'lucide-react';

const MobileNav = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            path: '/',
            label: 'Home',
            icon: (
                <House className="w-6 h-6" />
            ),
        },
        {
            path: '/vehicles',
            label: 'Vehicles',
            icon: (
                <CarFront className="w-6 h-6" />
            ),
        },
        {
            path: '/bookings',
            label: 'Bookings',
            icon: (
                <ClipboardList className="w-6 h-6" />
            ),
        },
        {
            path: '/pricing',
            label: 'Pricing',
            icon: (
                <BadgeIndianRupee className="w-6 h-6" />
            ),
        },
        {
            path: '/vendor',
            label: 'Vendors',
            icon: (
                <UserPlus className="w-6 h-6" />
            ),
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${isActive(item.path)
                                ? 'text-primary-600'
                                : 'text-neutral-600'
                            }`}
                    >
                        <div className={`${isActive(item.path) ? 'scale-110' : ''} transition-transform duration-200`}>
                            {item.icon}
                        </div>
                        <span className={`text-xs mt-1 font-medium ${isActive(item.path) ? 'text-primary-600' : 'text-neutral-600'
                            }`}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
