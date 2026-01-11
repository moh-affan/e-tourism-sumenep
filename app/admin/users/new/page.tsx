'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VISITOR',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push('/admin/users');
            } else {
                const d = await res.json();
                alert(d.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New User</h1>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 ml-1">Role</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="VISITOR">Visitor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4 flex items-center justify-end space-x-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Create User</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
