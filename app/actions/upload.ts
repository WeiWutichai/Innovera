'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const MAX_WIDTH = 420; // Max width in pixels

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)

    // Resize image if it's larger than MAX_WIDTH
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (metadata.width && metadata.width > MAX_WIDTH) {
            buffer = await image
                .resize(MAX_WIDTH, null, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();
        }
    } catch (err) {
        // If sharp fails (e.g., unsupported format), use original buffer
        console.warn('Image resize failed, using original:', err);
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (error) {
        // Ignore error if directory already exists
    }

    // Generate unique filename (always save as .jpg after resize)
    const filteredName = file.name.replace(/\\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '')
    const baseName = filteredName.replace(/\\.[^.]+$/, '') // Remove original extension
    const filename = `${randomUUID()}-${baseName}.jpg`
    const filepath = join(uploadDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    return `/uploads/${filename}`
}
