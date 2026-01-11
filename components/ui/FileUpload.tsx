'use client';

import React, { useRef, useState } from 'react';
import { Button } from './Button';

interface FileUploadProps {
    label: string;
    onUploadComplete: (url: string) => void;
    accept?: string;
    className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onUploadComplete, accept = 'audio/*', className = '' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onUploadComplete(data.url);
        } catch (err) {
            setError('Failed to upload file');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
            <div className="flex items-center space-x-3">
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                    size="sm"
                >
                    {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <span className="text-sm text-slate-500 truncate max-w-xs">{fileName || 'No file chosen'}</span>
            </div>
            {error && <p className="mt-1 text-sm text-red-600 ml-1">{error}</p>}
        </div>
    );
};
