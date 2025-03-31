const colorCache = new Map<string, string>();

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const MAX_SIZE = 50;

export function extractColor(img: HTMLImageElement): string {
  if (img.src && colorCache.has(img.src)) {
    return colorCache.get(img.src) as string;
  }

  if (!canvas) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "#4a4a4a";
  }

  if (!ctx) return "#4a4a4a";

  const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
  const width = Math.floor(img.width * scale);
  const height = Math.floor(img.height * scale);

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  const colorBuckets: number[][] = [];
  const BUCKET_SIZE = 24;
  const SAMPLE_RATE = 4;

  for (let i = 0; i < data.length; i += 4 * SAMPLE_RATE) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if ((r < 30 && g < 30 && b < 30) || (r > 220 && g > 220 && b > 220)) {
      continue;
    }

    const bucketR = Math.floor(r / BUCKET_SIZE);
    const bucketG = Math.floor(g / BUCKET_SIZE);
    const bucketB = Math.floor(b / BUCKET_SIZE);
    
    const bucketIndex = (bucketR * 100) + (bucketG * 10) + bucketB;
    
    if (!colorBuckets[bucketIndex]) {
      colorBuckets[bucketIndex] = [0, r, g, b];
    }
    
    colorBuckets[bucketIndex][0]++;
    colorBuckets[bucketIndex][1] += r;
    colorBuckets[bucketIndex][2] += g;
    colorBuckets[bucketIndex][3] += b;
  }

  let maxFrequency = 0;
  let dominantColor = [120, 120, 120];

  for (const bucket of colorBuckets) {
    if (bucket && bucket[0] > maxFrequency) {
      maxFrequency = bucket[0];
      dominantColor = [
        Math.round(bucket[1] / bucket[0]),
        Math.round(bucket[2] / bucket[0]),
        Math.round(bucket[3] / bucket[0])
      ];
    }
  }

  const result = `rgb(${dominantColor.join(",")})`;
  
  if (img.src) {
    colorCache.set(img.src, result);
  }

  return result;
}
