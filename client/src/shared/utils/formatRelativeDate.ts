export const formatRelativeDate = (inputDate: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - inputDate.getTime()) / 1000
  );
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInSeconds < 60) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min. ago`;
  if (diffInHours < 24) return `${diffInHours} h. ago`;
  if (diffInDays < 7) return `${diffInDays} d. ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} w. ago`;
  return inputDate.toLocaleDateString(); // kdyz je to dyl jak 4 tydny, zobrazi se datum
};
