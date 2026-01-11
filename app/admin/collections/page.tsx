'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Collection {
    id: string;
    name: string;
    category: string;
    audioInd?: string;
    audioEng?: string;
    qrCode?: { code: string };
    image?: string;
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCollections(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Collections</h1>
                    <p className="text-slate-500 mt-1">Manage museum and keraton items</p>
                </div>
                <Link href="/admin/collections/new">
                    <Button>+ Add New Collection</Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">Audio</th>
                                <th className="px-6 py-4">QR Code</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {collections.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        No collections found. Start by adding one.
                                    </td>
                                </tr>
                            )}
                            {collections.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded text-xs border ${item.audioInd ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>ID</span>
                                            <span className={`px-2 py-0.5 rounded text-xs border ${item.audioEng ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>EN</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                        {item.qrCode?.code ? (
                                            <span className="truncate block w-24" title={item.qrCode.code}>
                                                {item.qrCode.code.substring(0, 8)}...
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
