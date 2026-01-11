import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '_' + file.name.replaceAll(' ', '_');

    // Ensure uploads dir exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
}
