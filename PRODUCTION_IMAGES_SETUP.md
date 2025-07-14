# Production Image Handling Setup

## Problem
Next.js production builds can't access files saved to the filesystem at runtime because:
- Static files are served from a pre-built public folder
- Serverless environments have read-only filesystems
- Container deployments don't persist files between restarts

## Solution 1: Custom API Route (Recommended)

### What was implemented:
1. **API Route**: `/api/uploads/[...path]/route.ts` - Serves images dynamically
2. **Updated imageHandler**: Returns API route URLs instead of public folder paths
3. **Image serving**: Works in both development and production

### How it works:
- Images are saved to `public/uploads/checklists/`
- Instead of `/uploads/checklists/image.jpg`, you get `/api/uploads/checklists/image.jpg`
- The API route serves the file with proper headers and caching
- Deletion is handled through the same API route

### Benefits:
- ✅ Works in production builds
- ✅ Proper caching headers
- ✅ Security checks
- ✅ File deletion support
- ✅ No external dependencies

## Solution 2: Development Mode in Production (Not Recommended)

### If you absolutely must run dev mode in production:

1. **Add to `.env.local`**:
```env
NEXT_PUBLIC_DEV_MODE=true
DISABLE_DEV_OVERLAY=true
DISABLE_REACT_STRICT_MODE=true
```

2. **Run with dev command**:
```bash
npm run dev
```

3. **To hide the "development mode" banner**, add this to your main layout:
```css
/* Hide Next.js dev mode banner */
div[data-nextjs-portal] {
  display: none !important;
}
```

### Why this is not recommended:
- ❌ Poor performance (no optimizations)
- ❌ Security vulnerabilities (dev tools exposed)
- ❌ Memory leaks in long-running processes
- ❌ Not intended for production use

## Deployment Instructions

### Using Solution 1 (API Route):
1. Build and deploy normally:
```bash
npm run build
npm start
```

2. Ensure your deployment platform:
   - Has write access to the file system
   - Persists the `public/uploads/` directory between deployments
   - For Docker: Use volumes for `/app/public/uploads`
   - For VPS: Ensure proper file permissions

### Using Solution 2 (Dev Mode):
1. Deploy with dev command:
```bash
npm run dev
```

2. Set production environment variables but keep dev mode enabled

## File Structure After Implementation

```
public/
  uploads/
    checklists/
      farois_uuid-123.jpg
      lataria_uuid-456.png
      ...

src/
  app/
    api/
      uploads/
        [...path]/
          route.ts  // Serves images dynamically
  
  utils/
    imageHandler.ts  // Updated to return API URLs
```

## Testing

### Test Image Upload:
```typescript
// This will now return: /api/uploads/checklists/test_uuid.jpg
const imagePath = await saveBase64Image(base64Data, 'test')
```

### Test Image Access:
```jsx
// This will work in production
<img src="/api/uploads/checklists/test_uuid.jpg" alt="Test" />
```

### Test Image Deletion:
```typescript
// This will delete the actual file
await deleteImageFile('/api/uploads/checklists/test_uuid.jpg')
```

## Migration from Existing Images

If you have existing images with old paths (`/uploads/...`), use the helper function:

```typescript
import { convertToApiPath } from '@/utils/imageHandler'

// Convert old paths to API routes
const oldPath = '/uploads/checklists/image.jpg'
const newPath = convertToApiPath(oldPath) // '/api/uploads/checklists/image.jpg'
```

## Production Checklist

- [ ] API route is deployed and accessible
- [ ] Upload directory has write permissions
- [ ] Images are served correctly through API route
- [ ] File deletion works through API route
- [ ] Cache headers are properly set
- [ ] Security checks are in place
- [ ] Old image paths are migrated (if needed)

## Troubleshooting

### Images not loading:
1. Check if the API route is accessible: `GET /api/uploads/checklists/test.jpg`
2. Verify file permissions on the server
3. Check if files exist in `public/uploads/checklists/`

### Upload failures:
1. Ensure directory is writable
2. Check available disk space
3. Verify file path construction

### Performance issues:
1. Use Solution 1 (API route) instead of dev mode
2. Implement proper caching strategies
3. Consider image optimization 