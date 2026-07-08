'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'
import { requireUser } from '@/lib/auth-helpers'

const MAX_WIDTH = 1280; // Max width in pixels — large enough to stay sharp when zoomed
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export async function uploadImage(formData: FormData): Promise<string> {
    // Public POST endpoint: require an authenticated user.
    await requireUser()

    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    // Reject oversized uploads before reading the whole buffer into memory.
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large. Maximum size is 5MB.')
    }

    // Validate the declared content type against an image allowlist.
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Unsupported file type. Only PNG, JPEG, WEBP, and GIF images are allowed.')
    }

    const bytes = await file.arrayBuffer()
    const inputBuffer = Buffer.from(bytes)

    // Always re-encode through sharp to a known-safe JPEG. If sharp cannot
    // decode the input it is not a real image, so we REJECT instead of ever
    // persisting the raw, untrusted bytes.
    let buffer: Buffer
    try {
        buffer = await sharp(inputBuffer)
            .resize(MAX_WIDTH, null, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 85 }) // Normalize everything to JPEG
            .toBuffer()
    } catch (err) {
        console.error('Image processing failed, rejecting upload:', err)
        throw new Error('Invalid or corrupt image file.')
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (error) {
        // Ignore error if directory already exists
    }

    // Generate unique filename (UUID only to prevent encoding/path issues on Production)
    const filename = `${randomUUID()}.jpg`
    const filepath = join(uploadDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    return `/api/uploads/${filename}`
}
