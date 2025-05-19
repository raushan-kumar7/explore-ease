export const formatDate = (isoString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(isoString).toLocaleDateString(undefined, options);
};

export const estimateReadTime = (text, wordsPerMinute = 200) => {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};
