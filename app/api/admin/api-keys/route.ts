import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

export async function GET(request: Request) {
    try {
        const apiKeys = await prisma.apiKey.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(apiKeys);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Generate a random 32-character hex string as the key
        const key = crypto.randomBytes(16).toString('hex');

        const newKey = await prisma.apiKey.create({
            data: {
                name,
                key,
                isActive: true
            }
        });

        return NextResponse.json(newKey);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
    }
}
