import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

export async function GET(request: Request) {
    try {
        const collections = await prisma.collection.findMany({
            include: {
                qrCode: true,
            },
        });
        return NextResponse.json(collections);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, category, location, image } = body;

        // Transaction to create collection and qr code
        const result = await prisma.$transaction(async (tx) => {
            const collection = await tx.collection.create({
                data: {
                    name,
                    description,
                    category,
                    location,
                    image,
                }
            });

            // Generate a hash based on collection ID and secret/salt
            const hash = crypto.createHash('sha256').update(collection.id + Date.now().toString()).digest('hex');

            const qrCode = await tx.qRCode.create({
                data: {
                    code: hash,
                    collectionId: collection.id
                }
            });

            return { ...collection, qrCode };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Create collection error:', error);
        return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
    }
}
