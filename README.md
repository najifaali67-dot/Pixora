# PIXORA — All-in-One Online Image Editing & AI Image Studio

Everything You Need to Create & Edit Images.

Pixora is a production-grade full-stack SaaS platform combining high-speed browser-based client-side image editing tools with state-of-the-art AI generative intelligence (Google GenAI) and Bangladeshi payment gateway architecture (bKash, Nagad, SSLCommerz).

---

## 🌟 Key Features

### 1. Free Online Image Editing Tools (100% Client-Side Privacy)
- **Image Compressor**: Reduce JPG, PNG, and WebP file sizes with live savings percentage.
- **Image Resizer**: Pixel-accurate resizing, aspect-ratio locking, and social media presets.
- **Image Cropper**: Interactive draggable bounding box with Free, 1:1, 16:9, 9:16, and 4:3 ratios.
- **Image Converter & Format Hub**: Instant bidirectional conversion between JPG, PNG, and WebP.
  - Dedicated routes: `/jpg-to-png`, `/png-to-jpg`, `/png-to-webp`, `/webp-to-jpg`.
- **Image Rotator & Flipper**: 90°, 180°, 270° rotations and mirror horizontal/vertical flipping.
- **Image to PDF**: Multi-image drag-and-drop, page reordering, and direct PDF generation (`pdf-lib`).
- **Image Watermark**: Custom text, typography sizing, opacity slider, color, and 5-position matrix.
- **Creative Filters**: Rounded Corners (transparent PNG), Grayscale intensity, Gaussian Blur, and Real-Time Color Adjuster (Brightness, Contrast, Saturation, Hue Shift).
- **Metadata Viewer**: Inspect width, height, aspect ratio, file size, and MIME type.

### 2. Generative AI Studio
- **Text-to-Image Generator**: Powered by Google GenAI (`gemini-3.1-flash-lite-image`) with negative prompt avoidance, 9 artistic styles (Realistic, Anime, 3D Render, Digital Art, Photography, Illustration, Product Photography, Fantasy, Cinematic), and aspect ratio controls.
- **AI Background Remover**: Cut out backgrounds to pure transparency with high edge fidelity.
- **AI Image Upscaler**: 2x and 4x detail reconstruction.
- **AI Photo Enhancer**: Automatic lighting balance, clarity, and noise reduction.
- **AI Object Remover & Inpainting**: Erase unwanted elements and inpaint seamlessly.
- **AI Background Generator**: Replace backgrounds with studio and cinematic scenery.

### 3. SaaS & Commerce Architecture
- **Pricing**: Free tier and Pro tier (BDT 199/month, BDT 1499/year).
- **Credit Management**: Free users receive 15 initial credits; Pro users receive 250 credits/month.
- **Automatic Failure Refund**: If an AI generation fails or encounters API rate limits, spent credits are immediately refunded back to the ledger.
- **Bangladeshi Payments**: Native support for bKash, Nagad, Rocket, and SSLCommerz transaction verification.
- **Admin Control Center**:
  - Live SaaS KPIs (users, generations, BDT revenue, estimated API cost).
  - User and credit balance adjustment with audit logs.
  - Tool availability toggle (enable or disable any tool globally).
  - Dynamic pricing and credit quotas.
  - Payment ledger and verification log.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run full-stack dev server
npm run dev
```

The dev server runs on `http://localhost:3000`.

---

## 🌐 Netlify Deployment

Pixora is fully configured for Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Configuration file**: `netlify.toml`
