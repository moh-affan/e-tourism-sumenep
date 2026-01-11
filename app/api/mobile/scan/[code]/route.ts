import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { validateApiKey } from '@/app/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
    if (!await validateApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const code = (await params).code;
        const qrRecord = await prisma.qRCode.findUnique({
            where: { code },
            include: {
                collection: true
            }
        });

        if (!qrRecord || !qrRecord.collection) {
            return NextResponse.json({ error: 'Invalid QR Code' }, { status: 404 });
        }

        return NextResponse.json(qrRecord.collection);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to scan QR' }, { status: 500 });
    }
}
