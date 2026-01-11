'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // blank means no change
        role: 'VISITOR',
    });

    useEffect(() => {
        fetch(`/api/users/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('User not found');
                    router.push('/admin/users');
                    return;
                }
                setFormData({
                    name: data.name,
                    email: data.email,
                    password: '', // Don't show hash
                    role: data.role,
                });
                setInitialLoading(false);
            })
            .catch(err => {
                console.error(err);
                setInitialLoading(false);
            });
    }, [params.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${params.id}`, {
                method: 'PUT',
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

    if (initialLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit User</h1>

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
                        label="New Password (Optional)"
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
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
                        <Button type="submit" isLoading={loading}>Update User</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
