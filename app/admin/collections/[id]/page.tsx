'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';

type Tab = 'ID' | 'EN';
type InputMode = 'UPLOAD' | 'URL';

export default function EditCollectionPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        image: '',
        audioInd: '',
        audioEng: '',
    });

    const [activeTab, setActiveTab] = useState<Tab>('ID');
    const [inputMode, setInputMode] = useState<Record<Tab, InputMode>>({ ID: 'UPLOAD', EN: 'UPLOAD' });

    useEffect(() => {
        fetch(`/api/collections/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Collection not found');
                    router.push('/admin/collections');
                    return;
                }
                setFormData({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    image: data.image || '',
                    audioInd: data.audioInd || '',
                    audioEng: data.audioEng || '',
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
            const res = await fetch(`/api/collections/${params.id}`, {
                method: 'PUT',
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

    const setAudioUrl = (url: string) => {
        if (activeTab === 'ID') setFormData(prev => ({ ...prev, audioInd: url }));
        else setFormData(prev => ({ ...prev, audioEng: url }));
    }

    const getActiveAudioUrl = () => activeTab === 'ID' ? formData.audioInd : formData.audioEng;

    if (initialLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Collection</h1>

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
                        <Input
                            label="Image URL (Optional)"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    {/* Audio Guide Section */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Audio Guide</h3>

                        <div className="bg-slate-50 p-1 rounded-xl inline-flex mb-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('ID')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'ID' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                🇮🇩 Indonesia
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('EN')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'EN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                🇬🇧 English
                            </button>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex space-x-4 mb-4 text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`mode-${activeTab}`}
                                        checked={inputMode[activeTab] === 'UPLOAD'}
                                        onChange={() => setInputMode(prev => ({ ...prev, [activeTab]: 'UPLOAD' }))}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>Upload File</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`mode-${activeTab}`}
                                        checked={inputMode[activeTab] === 'URL'}
                                        onChange={() => setInputMode(prev => ({ ...prev, [activeTab]: 'URL' }))}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>Direct URL</span>
                                </label>
                            </div>

                            {inputMode[activeTab] === 'UPLOAD' ? (
                                <div className="space-y-2">
                                    <FileUpload
                                        key={activeTab}
                                        label={`Upload ${activeTab === 'ID' ? 'Indonesian' : 'English'} Audio`}
                                        onUploadComplete={setAudioUrl}
                                    />
                                    {getActiveAudioUrl() && (
                                        <p className="text-xs text-green-600 font-medium truncate max-w-sm">✅ Current: {getActiveAudioUrl()}</p>
                                    )}
                                </div>
                            ) : (
                                <Input
                                    label={`URL for ${activeTab === 'ID' ? 'Indonesian' : 'English'} Audio`}
                                    value={getActiveAudioUrl() || ''}
                                    onChange={(e) => setAudioUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end space-x-4 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Update Collection</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
