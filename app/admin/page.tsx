import { prisma } from '@/app/lib/prisma';

async function getStats() {
    // In a real app we would catch errors here
    try {
        const collectionsCount = await prisma.collection.count();
        const usersCount = await prisma.user.count();
        const qrCount = await prisma.qRCode.count();
        return { collectionsCount, usersCount, qrCount };
    } catch (e) {
        return { collectionsCount: 0, usersCount: 0, qrCount: 0 };
    }
}

export default async function AdminDashboard() {
    const { collectionsCount, usersCount, qrCount } = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Collections" value={collectionsCount} icon="🏛️" color="bg-indigo-50 text-indigo-600" />
                <StatCard title="Total Users" value={usersCount} icon="👥" color="bg-pink-50 text-pink-600" />
                <StatCard title="Active QR Codes" value={qrCount} icon="📱" color="bg-emerald-50 text-emerald-600" />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${color} text-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 font-medium text-sm">{title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
        </div>
    )
}
