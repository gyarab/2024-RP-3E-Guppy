export function truncate(text: string, maxLength: number = 100): string {
  return text.length > maxLength
    ? `${text.slice(0, maxLength).trim()}...`
    : text;
}
