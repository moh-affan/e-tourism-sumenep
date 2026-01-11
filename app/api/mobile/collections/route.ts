import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { validateApiKey } from '@/app/lib/auth';

export async function GET(request: Request) {
    if (!await validateApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [collections, total] = await Promise.all([
            prisma.collection.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    image: true,
                    narrative: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.collection.count(),
        ]);

        return NextResponse.json({
            data: collections,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }
}
