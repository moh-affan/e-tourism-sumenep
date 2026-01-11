'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/collections', label: 'Collections', icon: '🏛️' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
];

export const AppSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        // Ideally call API to logout/clear cookie
        document.cookie = 'token=; Max-Age=0; path=/;';
        router.push('/login');
    };

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
            <div className="p-8 border-b border-slate-100">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    E-Tourism Sumenep
                </h2>
                <p className="text-sm text-slate-500 mt-1">Management Portal</p>
            </div>
            <nav className="flex-1 p-6 space-y-2">
                {links.map(link => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className="mr-3 text-lg">{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-6 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-medium"
                >
                    <span className="mr-3">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    )
}
