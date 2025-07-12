# Image Converter API

A simple Node.js API service that converts uploaded images to PNG format and returns them as base64 encoded strings.

## Features

- Single POST endpoint for image conversion
- **Supports all major image formats:**
  - **JPEG/JPG** ✅
  - **PNG** ✅ 
  - **WebP** ✅
  - **AVIF** ✅ (via HEIF support)
  - **HEIC/HEIF** ✅
  - **GIF** ✅
  - **TIFF** ✅
  - **SVG** ✅
  - **BMP** ✅
  - And many more formats supported by Sharp
- Converts to PNG format using Sharp library
- **RGBA format output** - Compatible with OpenAI Vision API
- Returns base64 encoded result
- 10MB file size limit
- Docker support for easy deployment

## API Endpoints

### Health Check
```
GET /health
```
Returns service status.

### Convert Image
```
POST /convert
```
Upload an image file and get it converted to PNG format as base64.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Field name: `image`
- File: Any image file (JPEG, PNG, GIF, WebP, etc.)

**Response:**
```json
{
  "success": true,
  "originalFormat": "image/jpeg",
  "convertedFormat": "image/png",
  "originalSize": 1234567,
  "convertedSize": 987654,
  "base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## Supported Image Formats

This API supports conversion from **all major modern image formats** including:

### ✅ **Fully Supported Formats:**
- **JPEG/JPG** - Standard web format
- **PNG** - Lossless format with transparency
- **WebP** - Modern web format (Google)
- **AVIF** - Next-gen format (AV1-based)
- **HEIC/HEIF** - Apple's modern format
- **GIF** - Animated/static format
- **TIFF** - High-quality format
- **SVG** - Vector graphics
- **BMP** - Windows bitmap
- **JP2K** - JPEG 2000
- **JXL** - JPEG XL (next-gen)

### 📱 **Mobile Formats:**
- **HEIC** - iPhone default format ✅
- **AVIF** - Android/Chrome modern format ✅
- **WebP** - Android/web optimized format ✅

The API automatically detects the input format and converts everything to **PNG** format for maximum compatibility.

## Usage Examples

### Using curl
```bash
curl -X POST -F "image=@your-image.jpg" http://localhost:3000/convert
```

### Using JavaScript fetch
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('/convert', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Converted image:', data.base64);
});
```

## Development

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Run in development mode
```bash
npm run dev
```

### Run in production mode
```bash
npm start
```

## Docker Deployment

### Build the image
```bash
docker build -t convert-img-api .
```

### Run the container
```bash
docker run -p 3000:3000 convert-img-api
```

## Coolify Deployment

This API is ready to be deployed on Coolify. Simply:

1. Connect your Git repository to Coolify
2. Coolify will automatically detect the Dockerfile
3. Set the port to 3000
4. Deploy!

The Dockerfile is optimized for production deployment with:
- Multi-stage build for smaller image size
- Non-root user for security
- Production-only dependencies
- Proper port exposure

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (set to 'production' in Docker)

## Error Handling

The API handles various error scenarios:
- Missing file upload
- Invalid file types (non-images)
- File size limits (10MB max)
- Image processing errors
- General server errors

All errors return appropriate HTTP status codes and descriptive error messages.
