import { prisma } from '@/app/lib/prisma';

export async function validateApiKey(request: Request): Promise<boolean> {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) return false;

    const keyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey }
    });

    return !!(keyRecord && keyRecord.isActive);
}
