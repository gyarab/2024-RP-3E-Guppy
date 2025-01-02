export function extractColor(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "#4a4a4a";

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  const colorFrequency: Record<string, number> = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r < 30 && g < 30 && b < 30) continue; // ignore very dark colors
    if (r > 220 && g > 220 && b > 220) continue; // ignore very light colors

    const colorKey = `${r},${g},${b}`;
    colorFrequency[colorKey] = (colorFrequency[colorKey] || 0) + 1;
  }

  let dominantColor = [120, 120, 120];
  let maxFrequency = 0;

  for (const [color, frequency] of Object.entries(colorFrequency)) {
    if (frequency > maxFrequency) {
      maxFrequency = frequency;
      dominantColor = color.split(",").map(Number) as number[];
    }
  }

  return `rgb(${dominantColor.join(",")})`;
}
