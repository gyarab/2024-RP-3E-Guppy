export async function generateRandomString(length: number): Promise<string> {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ2346789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
