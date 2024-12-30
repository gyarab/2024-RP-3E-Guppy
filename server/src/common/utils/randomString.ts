export async function generateRandomString(length: number): Promise<string> {
  return String.fromCharCode(
    ...Array.from({ length }, () => Math.floor(Math.random() * 26) + 97),
  );
}
