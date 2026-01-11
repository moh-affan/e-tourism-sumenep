'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

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
    const [selectedQr, setSelectedQr] = useState<string | null>(null);

    const fetchCollections = () => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCollections(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCollections();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting item');
        }
    };

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
                                            <button
                                                onClick={() => setSelectedQr(item.qrCode!.code)}
                                                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                <span>{item.qrCode.code.substring(0, 8)}...</span>
                                                <span className="text-sm">🔍</span>
                                            </button>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <Link href={`/admin/collections/${item.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* QR Modal */}
            {selectedQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedQr(null)}>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-auto text-center space-y-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900">QR Code Identity</h3>
                        <div className="bg-slate-50 p-6 rounded-2xl inline-block border border-slate-100">
                            <QRCodeSVG value={selectedQr} size={200} />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl break-all font-mono text-xs text-slate-500 border border-slate-100">
                            {selectedQr}
                        </div>
                        <Button className="w-full" onClick={() => setSelectedQr(null)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
