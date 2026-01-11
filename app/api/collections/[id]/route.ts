import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const collection = await prisma.collection.findUnique({
            where: { id },
            include: { qrCode: true }
        });
        if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(collection);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const body = await request.json();
        const { name, description, category, image, audioInd, audioEng } = body;

        const updated = await prisma.collection.update({
            where: { id },
            data: {
                name,
                description,
                category,
                image,
                audioInd,
                audioEng,
            }
        });
        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        // QRCode cascade delete handled by foreign key if set, assuming Prisma schema has onDelete: Cascade
        await prisma.collection.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
