const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads (store in memory)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // List of supported image extensions and MIME types
        const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic', '.heif', '.tiff', '.tif', '.bmp', '.svg'];
        const supportedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'image/avif', 'image/heic', 'image/heif', 'image/tiff',
            'image/bmp', 'image/svg+xml', 'image/x-icon'
        ];

        const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        const isImageMime = file.mimetype.startsWith('image/') || supportedMimeTypes.includes(file.mimetype);
        const isImageExtension = supportedExtensions.includes(fileExtension);

        // Accept if either MIME type indicates image OR file extension is a known image format
        if (isImageMime || isImageExtension) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Image Converter API' });
});

// Main conversion endpoint
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'No image file provided. Please upload an image using the "image" field.'
            });
        }

        console.log(`Converting image: ${req.file.originalname} (${req.file.mimetype})`);

        // Convert image to PNG using Sharp with RGBA format (required by OpenAI)
        const pngBuffer = await sharp(req.file.buffer)
            .ensureAlpha() // Ensure alpha channel is present (RGB -> RGBA)
            .png()
            .toBuffer();

        // Convert to base64
        const base64Image = pngBuffer.toString('base64');

        // Return the converted image
        res.json({
            success: true,
            originalFormat: req.file.mimetype,
            convertedFormat: 'image/png',
            colorSpace: 'RGBA', // OpenAI compatible format
            originalSize: req.file.size,
            convertedSize: pngBuffer.length,
            base64: base64Image,
            note: 'Output format is RGBA PNG, compatible with OpenAI Vision API'
        });

    } catch (error) {
        console.error('Error converting image:', error);
        res.status(500).json({
            error: 'Failed to convert image',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }

    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: 'Only image files are allowed!' });
    }

    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Image Converter API is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Convert endpoint: POST http://localhost:${PORT}/convert`);
});
