import { AppSidebar } from '@/components/AppSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <AppSidebar />
            <main className="flex-1 overflow-x-hidden p-8 md:p-12">
                {children}
            </main>
        </div>
    );
}
