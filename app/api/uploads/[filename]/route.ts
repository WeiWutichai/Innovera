import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Validate filename to prevent directory traversal attacks
    if (!filename || filename.includes('..') || filename.includes('/')) {
        return new NextResponse('Invalid filename', { status: 400 });
    }

    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    // Check if file exists
    if (!existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    try {
        const fileBuffer = await readFile(filePath);

        // Determine content type based on extension
        const extension = filename.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';

        if (extension === 'jpg' || extension === 'jpeg') {
            contentType = 'image/jpeg';
        } else if (extension === 'png') {
            contentType = 'image/png';
        } else if (extension === 'gif') {
            contentType = 'image/gif';
        } else if (extension === 'webp') {
            contentType = 'image/webp';
        } else if (extension === 'pdf') {
            contentType = 'application/pdf';
        }

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error reading file:', error);
        return new NextResponse('Error reading file', { status: 500 });
    }
}
