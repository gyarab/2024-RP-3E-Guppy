export const imageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? "http://localhost:5173" : "http://localhost:5000";
  
  if (url.includes('localhost:3000') && isDev) {
    url = url.replace('localhost:3000', 'localhost:5173');
  }

  if (url.startsWith('http')) {
    return url;
  }
  
  if (url.startsWith('uploads/')) {
    return `${baseUrl}/${url}`;
  }
  
  return url;
};
