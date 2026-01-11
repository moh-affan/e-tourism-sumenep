'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';




export default function NewCollectionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        image: '',
        narrative: '',
    });
    const [imageInputMode, setImageInputMode] = useState<'UPLOAD' | 'URL'>('UPLOAD');

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
        <div className="max-w-2xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Collection</h1>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Basic Information</h3>
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
                        <Input
                            label="Category"
                            placeholder="e.g. Keraton, Museum"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 ml-1">Collection Image</label>

                            <div className="flex space-x-6 text-sm mb-2 px-1">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        checked={imageInputMode === 'UPLOAD'}
                                        onChange={() => setImageInputMode('UPLOAD')}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className={`group-hover:text-indigo-600 transition-colors ${imageInputMode === 'UPLOAD' ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>Upload Image</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        checked={imageInputMode === 'URL'}
                                        onChange={() => setImageInputMode('URL')}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className={`group-hover:text-indigo-600 transition-colors ${imageInputMode === 'URL' ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>External URL</span>
                                </label>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {imageInputMode === 'UPLOAD' ? (
                                    <div className="space-y-3">
                                        <FileUpload
                                            label="Upload Collection Image"
                                            onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                        />
                                        {formData.image && (
                                            <div className="text-sm text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-100 flex items-center space-x-2">
                                                <span className="text-green-500">✓</span>
                                                <span className="truncate flex-1">{formData.image}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Input
                                        label="Image URL"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="bg-white"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Narrative Section */}
                    <div className="space-y-6 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Narrative</h3>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 ml-1">Narrative Text (Long)</label>
                            <textarea
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                rows={8}
                                value={formData.narrative}
                                onChange={e => setFormData({ ...formData, narrative: e.target.value })}
                                placeholder="Enter specific narrative or detailed story here..."
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end space-x-4 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Create Collection</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
