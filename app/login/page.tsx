'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Login failed');
            }

            router.push('/admin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Masuk ke Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Masukkan detail akun anda untuk mengelola E-Tourism Sumenep
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@sumenep.go.id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Masuk Sekarang
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        &copy; 2024 Pemerintah Kabupaten Sumenep. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative h-full w-full bg-slate-900">
                <div className="absolute inset-0 bg-slate-900/20 z-10" />

                <img
                    src="/login-bg.png"
                    alt="Keraton Sumenep"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-end p-12 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
                    <div className="text-white space-y-2">
                        <h2 className="text-3xl font-bold">Wisata Sumenep</h2>
                        <p className="text-lg text-slate-200 max-w-md">
                            Menjelajahi keindahan sejarah dan budaya Kabupaten Sumenep, Madura.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
