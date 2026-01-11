import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { validateApiKey } from '@/app/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await validateApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = (await params).id;
        const collection = await prisma.collection.findUnique({
            where: { id },
            include: {
                qrCode: true
            }
        });

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        return NextResponse.json(collection);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
    }
}
