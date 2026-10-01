/**
 * Client-side lightweight image compressor using HTML5 Canvas.
 * Shrinks raw phone screenshots (often 3MB - 8MB) to ~100KB - 250KB JPEG
 * so mobile uploads are instantaneous and never exceed Vercel / serverless limits.
 */
export async function compressImage(
  file: File,
  maxDimension = 1280,
  quality = 0.8
): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!file || !file.type.startsWith("image/")) return file;

  // If already lightweight (< 250 KB), no need to re-encode unless it's a huge dimension PNG
  if (file.size < 250 * 1024 && !file.type.includes("png")) {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let { width, height } = img;

        // Downscale proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Fill background white for transparent PNGs before converting to JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const cleanBaseName = file.name.replace(/\.[^/.]+$/, "");
            const compressedFile = new File([blob], `${cleanBaseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            // If compressed is somehow larger than original, keep original
            if (compressedFile.size > file.size && file.size > 0) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          "image/jpeg",
          quality
        );
      } catch (err) {
        console.warn("Canvas compression failed, using original file:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
