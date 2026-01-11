'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewCollectionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        location: '',
        image: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push('/admin/collections');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Collection</h1>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 ml-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <Input
                            label="Category"
                            placeholder="e.g. Keraton, Museum"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                        <Input
                            label="Location"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        label="Image URL (Optional)"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />

                    <div className="pt-4 flex items-center justify-end space-x-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Create Collection</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
