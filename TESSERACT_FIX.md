# Tesseract.js Docker Fix Guide

## Issue Fixed: WASM File Not Found Error ✅

**Error**: `ENOENT: no such file or directory, open '/app/node_modules/tesseract.js-core/tesseract-core-simd.wasm'`

### Root Cause

The standalone Next.js build doesn't include WASM files and Tesseract.js dependencies by default.

### Solution Applied

1. **Updated Dockerfile**: Now properly copies Tesseract.js core files and WASM dependencies
2. **Updated Next.js Config**: Added proper file tracing for Tesseract.js files
3. **Updated OCR Configuration**: Set correct paths for Docker environment
4. **Added Training Data**: Properly configured tessdata directory

### Files Modified

- `Dockerfile` - Enhanced to copy all Tesseract.js dependencies
- `next.config.mjs` - Added webpack configuration for WASM files
- `lib/runOCR.ts` - Updated paths for Docker environment
- `public/tessdata/` - Added training data for local development

### Testing the Fix

1. **Rebuild the container**:

   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Test OCR functionality**:

   - Upload an image with text
   - Check if OCR extraction works
   - Monitor logs for Tesseract messages

3. **Check logs**:
   ```bash
   docker-compose logs -f app | grep -i tesseract
   ```

### Expected Output

When working correctly, you should see:

```
recognizing text...
initializing api...
loading language eng+ind...
processing image...
OCR completed successfully
```

### Troubleshooting

If you still get WASM errors:

1. **Check if files exist in container**:

   ```bash
   docker-compose exec app ls -la /app/node_modules/tesseract.js-core/
   docker-compose exec app ls -la /app/tessdata/
   ```

2. **Verify environment paths**:

   ```bash
   docker-compose exec app env | grep NODE_ENV
   ```

3. **Test manual OCR**:
   ```bash
   docker-compose exec app node -e "
   const Tesseract = require('tesseract.js');
   console.log('Tesseract loaded successfully');
   "
   ```

### Performance Notes

- OCR processing may take 10-30 seconds for complex images
- First OCR call may be slower as it initializes the engine
- Training data files are ~7MB total (eng + ind)

### Alternative Configuration

If issues persist, you can also set environment variables:

```yaml
environment:
  - TESSDATA_PREFIX=/app/tessdata
  - TESSERACT_CORE_PATH=/app/node_modules/tesseract.js-core
```
