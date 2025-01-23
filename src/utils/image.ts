import * as BuildConfig from "src/build-config";

interface ImageOptions {
  width: number;
  height: number;
}

export function buildImageUrl(
  originalUrl: string,
  options: ImageOptions
): string {
  const key = originalUrl.split(".amazonaws.com/")[1];
  if (!key) return originalUrl;

  const params = new URLSearchParams({
    w: options.width.toString(),
    h: options.height.toString(),
    fit: "crop",
    crop: "faces,entropy",
  });

  return `https://${BuildConfig.IMGIX_DOMAIN}/${key}?${params.toString()}`;
}
