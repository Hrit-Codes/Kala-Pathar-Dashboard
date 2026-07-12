import { AxiosError } from "axios";

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

export async function fetchOrNull<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export const getCampaignStatusLabel = (status: string) => {
        switch (status) {
            case "completed":
                return "COMPLETED";
            case "processing":
                return "PROCESSING";
            case "pending":
                return "PENDING";
            case "failed":
                return "FAILED";
            default:
                return status.toUpperCase();
        }
    };

export const getCampaignStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return "badge-success";
            case "processing":
                return "badge-warning";
            case "pending":
                return "badge-pending";
            case "failed":
                return "badge-error";
            default:
                return "badge";
        }
    };
