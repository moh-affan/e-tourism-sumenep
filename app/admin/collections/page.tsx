'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Edit, Image, Trash } from 'lucide-react';

interface Collection {
    id: string;
    name: string;
    category: string;
    narrative?: string;
    qrCode?: { code: string };
    image?: string;
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQr, setSelectedQr] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCollections = (pageInfo = 1) => {
        setLoading(true);
        fetch(`/api/collections?page=${pageInfo}&limit=10`)
            .then(res => res.json())
            .then(data => {
                if (data.data && Array.isArray(data.data)) {
                    setCollections(data.data);
                    setTotalPages(data.pagination.totalPages);
                } else if (Array.isArray(data)) {
                    // Fallback for older API response if needed
                    setCollections(data);
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCollections(page);
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting item');
        }
    };

    useEffect(() => {
        fetchCollections(page);
    }, [page]);



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
                                <th className="px-6 py-4">Narrative</th>
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
                                        <p className="text-xs text-slate-500 line-clamp-2 max-w-xs" title={item.narrative}>
                                            {item.narrative || '-'}
                                        </p>
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
                                        <Link
                                            href={`/admin/collections/${item.id}`}
                                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit />
                                        </Link>
                                        {item.image && (
                                            <button
                                                onClick={() => setSelectedImage(item.image!)}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="View Image"
                                            >
                                                <Image />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {collections.length > 0 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
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

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
                    <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto text-center space-y-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900">Image Preview</h3>
                        <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={selectedImage}
                                alt="Collection Preview"
                                className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
                            />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl break-all font-mono text-xs text-slate-500 border border-slate-100">
                            {selectedImage}
                        </div>
                        <Button className="w-full" onClick={() => setSelectedImage(null)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
