import { PDFDocument } from 'pdf-lib';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  width: number;
  height: number;
  aspectRatio: string;
  lastModified?: string;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(img.naturalWidth, img.naturalHeight);
  const aspectW = img.naturalWidth / divisor;
  const aspectH = img.naturalHeight / divisor;

  return {
    fileName: file.name,
    fileSize: file.size,
    fileSizeFormatted: formatBytes(file.size),
    mimeType: file.type || 'image/png',
    width: img.naturalWidth,
    height: img.naturalHeight,
    aspectRatio: `${aspectW}:${aspectH}`,
    lastModified: file.lastModified ? new Date(file.lastModified).toLocaleString() : undefined,
  };
}

export async function compressImage(
  dataUrl: string,
  quality: number, // 0.1 to 1.0
  format: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg'
): Promise<{ dataUrl: string; size: number; savings: number; originalSize: number }> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');

  // For PNG, scale dimensions proportional to quality since PNG toDataURL is lossless
  let scale = 1;
  if (format === 'image/png' && quality < 0.95) {
    scale = Math.max(0.4, 0.4 + quality * 0.6);
  }

  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If saving as JPEG, fill with white background in case source had alpha
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let compressedDataUrl = '';
  if (format === 'image/png') {
    compressedDataUrl = canvas.toDataURL('image/png');
  } else {
    compressedDataUrl = canvas.toDataURL(format, quality);
  }

  // Calculate approximate byte size from base64
  const base64Str = compressedDataUrl.substring(compressedDataUrl.indexOf(',') + 1);
  const compressedSize = Math.round((base64Str.length * 3) / 4);

  const origBase64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
  const originalSize = Math.round((origBase64.length * 3) / 4);

  const savings = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

  return {
    dataUrl: compressedDataUrl,
    size: compressedSize,
    savings,
    originalSize,
  };
}

export async function resizeImage(
  dataUrl: string,
  targetWidth: number,
  targetHeight: number,
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality = 0.92
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(format, quality);
}

export async function cropImage(
  dataUrl: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  format: 'image/png' | 'image/jpeg' = 'image/png'
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL(format, 0.95);
}

export async function convertImageFormat(
  dataUrl: string,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality = 0.92
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL(targetFormat, quality);
}

export async function rotateImage(dataUrl: string, degrees: number): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const rads = (degrees * Math.PI) / 180;
  const isPerpendicular = degrees % 180 !== 0;

  canvas.width = isPerpendicular ? img.naturalHeight : img.naturalWidth;
  canvas.height = isPerpendicular ? img.naturalWidth : img.naturalHeight;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rads);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  return canvas.toDataURL('image/png');
}

export async function flipImage(
  dataUrl: string,
  horizontal: boolean,
  vertical: boolean
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function applyColorAdjustments(
  dataUrl: string,
  options: {
    brightness: number; // 0 to 200 (100 default)
    contrast: number; // 0 to 200 (100 default)
    saturation: number; // 0 to 200 (100 default)
    hue: number; // -180 to 180 (0 default)
  }
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.filter = `brightness(${options.brightness}%) contrast(${options.contrast}%) saturate(${options.saturation}%) hue-rotate(${options.hue}deg)`;
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function applyGrayscale(dataUrl: string, intensity = 100): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.filter = `grayscale(${intensity}%)`;
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function applyBlur(dataUrl: string, blurRadiusPx = 5): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.filter = `blur(${blurRadiusPx}px)`;
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function applyRoundedCorners(dataUrl: string, radiusPx = 40): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const w = canvas.width;
  const h = canvas.height;
  const r = Math.min(radiusPx, Math.min(w, h) / 2);

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function addWatermark(
  dataUrl: string,
  options: {
    text: string;
    fontSize: number;
    color: string;
    opacity: number; // 0.1 to 1.0
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  }
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const effectiveFontSize = Math.max(14, Math.round(options.fontSize * (canvas.width / 900)));
  ctx.font = `bold ${effectiveFontSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = options.color;
  ctx.globalAlpha = options.opacity;

  const metrics = ctx.measureText(options.text);
  const textW = metrics.width;
  const textH = effectiveFontSize;
  const padding = effectiveFontSize;

  let x = padding;
  let y = textH + padding;

  switch (options.position) {
    case 'top-left':
      x = padding;
      y = textH + padding;
      break;
    case 'top-right':
      x = canvas.width - textW - padding;
      y = textH + padding;
      break;
    case 'bottom-left':
      x = padding;
      y = canvas.height - padding;
      break;
    case 'bottom-right':
      x = canvas.width - textW - padding;
      y = canvas.height - padding;
      break;
    case 'center':
      x = (canvas.width - textW) / 2;
      y = canvas.height / 2 + textH / 3;
      break;
  }

  // Draw subtle shadow for contrast
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillText(options.text, x, y);

  return canvas.toDataURL('image/png');
}

export async function convertImagesToPdf(dataUrls: string[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const url of dataUrls) {
    const isPng = url.startsWith('data:image/png');
    const bytes = Uint8Array.from(atob(url.split(',')[1]), (c) => c.charCodeAt(0));

    const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await pdfDoc.save();
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
