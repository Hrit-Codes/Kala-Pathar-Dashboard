export const getEstimatedReadTime = (
  content: string,
  charsPerMinute: number = 1000 // Average reading speed in characters per minute
): string => {
  if (!content) return "0 seconds";

  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  
  // Count characters (excluding spaces)
  const charCount = plainText.replace(/\s+/g, '').length;
  
  if (charCount === 0) return "0 seconds";

  const minutes = charCount / charsPerMinute;

  if (minutes < 1) {
    const seconds = Math.max(5, Math.round(minutes * 60));
    return `${seconds} seconds`;
  }

  const roundedMinutes = Math.round(minutes);
  return `${roundedMinutes} minute${roundedMinutes > 1 ? "s" : ""}`;
};