'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash } from 'lucide-react';

interface ApiKey {
    id: string;
    name: string;
    key: string; // The full key is visible here, in prod maybe hide it
    isActive: boolean;
    createdAt: string;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchKeys = () => {
        setLoading(true);
        fetch('/api/admin/api-keys')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setKeys(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName) return;
        setIsCreating(true);

        try {
            const res = await fetch('/api/admin/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            });
            if (res.ok) {
                setNewKeyName(''); // Reset input
                fetchKeys(); // Refresh list
            } else {
                alert('Failed to create key');
            }
        } catch (error) {
            alert('Error creating key');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Revoke this API Key? Mobile apps using it will stop working immediately.')) return;

        try {
            const res = await fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchKeys();
            } else {
                alert('Failed to delete key');
            }
        } catch (e) {
            alert('Error deleting key');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
                    <p className="text-slate-500 mt-1">Manage access for mobile applications</p>
                </div>
            </div>

            {/* Create New Key Form */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Generate New Key</h3>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Key Name (e.g. Android v1.0)"
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={isCreating} isLoading={isCreating}>
                        Generate Key
                    </Button>
                </form>
            </div>

            {/* Keys List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Key</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {keys.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                    No active keys found.
                                </td>
                            </tr>
                        )}
                        {keys.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                <td className="px-6 py-4 font-mono text-xs bg-slate-50 p-1 rounded border border-slate-200 inline-block mt-2 ml-4 mb-2 mr-4 select-all">
                                    {item.key}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Revoke Key"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
