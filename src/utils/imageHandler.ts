import { promises as fs } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'checklists')

// Ensure upload directory exists
export async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR)
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true })
    }
}

// Save base64 image to file and return the API route path
export async function saveBase64Image(base64Data: string, prefix: string = 'img'): Promise<string> {
    if (!base64Data || !base64Data.includes(',')) {
        throw new Error('Invalid base64 data')
    }

    await ensureUploadDir()

    // Extract the file extension from base64 data
    const mimeMatch = base64Data.match(/data:image\/([a-zA-Z]*);base64,/)
    const extension = mimeMatch ? mimeMatch[1] : 'png'
    
    // Generate unique filename
    const filename = `${prefix}_${randomUUID()}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)
    
    // Extract base64 data without the data URL prefix
    const base64Content = base64Data.split(',')[1]
    
    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Content, 'base64')
    await fs.writeFile(filepath, buffer)
    
    // Return the API route path for serving the image
    return `/api/uploads/checklists/${filename}`
}

// Save multiple base64 images from an array
export async function saveBase64Images(base64Array: string[], prefix: string = 'img'): Promise<string[]> {
    if (!Array.isArray(base64Array) || base64Array.length === 0) {
        return []
    }

    const promises = base64Array.map(base64Data => saveBase64Image(base64Data, prefix))
    return Promise.all(promises)
}

// Delete image file using API route
export async function deleteImageFile(imagePath: string): Promise<void> {
    if (!imagePath) return
    
    try {
        // If it's an API route path, convert to file path
        if (imagePath.startsWith('/api/uploads/')) {
            const relativePath = imagePath.replace('/api/uploads/', '')
            const fullPath = join(process.cwd(), 'public', 'uploads', relativePath)
            await fs.unlink(fullPath)
        } else {
            // Legacy support for direct public paths
            const fullPath = join(process.cwd(), 'public', imagePath)
            await fs.unlink(fullPath)
        }
    } catch (error) {
        // File might not exist, log but don't throw
        console.warn(`Failed to delete image file: ${imagePath}`, error)
    }
}

// Delete multiple image files
export async function deleteImageFiles(imagePaths: string[]): Promise<void> {
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
        return
    }

    const promises = imagePaths.map(path => deleteImageFile(path))
    await Promise.all(promises)
}

// Parse image paths from database (could be string or array)
export function parseImagePaths(imageData: any): string[] {
    if (!imageData) return []
    
    if (typeof imageData === 'string') {
        try {
            const parsed = JSON.parse(imageData)
            return Array.isArray(parsed) ? parsed : [parsed]
        } catch {
            return [imageData]
        }
    }
    
    return Array.isArray(imageData) ? imageData : [imageData]
}

// Helper function to convert old public paths to API routes (for migration)
export function convertToApiPath(imagePath: string): string {
    if (imagePath.startsWith('/api/uploads/')) {
        return imagePath // Already an API path
    }
    
    if (imagePath.startsWith('/uploads/')) {
        return `/api${imagePath}`
    }
    
    return imagePath
} 