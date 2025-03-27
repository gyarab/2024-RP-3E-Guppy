export const imageUrl = (url: string | undefined) => {
  const isDev = process.env.NODE_ENV === "development";
  return isDev
    ? `http://localhost:3000/${url}`
    : `http://localhost:5000/${url}`;
};
