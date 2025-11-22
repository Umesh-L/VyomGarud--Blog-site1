export function formatDate(input: string) {
  if (!input) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

export function estimateReadingTime(content: string) {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
