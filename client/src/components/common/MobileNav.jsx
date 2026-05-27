import { Link, useLocation } from 'react-router-dom';
import { House, CarFront, BadgeIndianRupee, ClipboardList, UserPlus } from 'lucide-react';

const MobileNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: House },
        { path: '/vehicles', label: 'Fleet', icon: CarFront },
        { path: '/bookings', label: 'Trips', icon: ClipboardList },
        { path: '/pricing', label: 'Pricing', icon: BadgeIndianRupee },
        { path: '/vendor', label: 'Vendors', icon: UserPlus },
    ];

    return (
        <nav
            className="md:hidden fixed bottom-3 left-3 right-3 bg-white/85 backdrop-blur-2xl text-ink-900 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] z-50 border border-red-600/30"
            data-testid="mobile-nav"
        >
            <div className="flex justify-around items-center h-18 px-3 relative">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                            className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
                        >
                            <div
                                className={`p-1.5 rounded-xl transition-all duration-300 ${active
                                        ? 'bg-primary-500 text-white scale-110 shadow-[0_8px_20px_-4px_rgba(255,87,34,0.6)]'
                                        : 'text-ink-400 hover:text-ink-600 hover:bg-ink-50'
                                    }`}
                            >
                                <Icon className="w-5.5 h-5.5" strokeWidth={active ? 2.5 : 2} />
                            </div>
                            <span
                                className={`text-[10px] mt-0.7 font-bold tracking-wide uppercase ${active ? 'text-primary-600' : 'text-ink-500'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;