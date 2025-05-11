export const API_BASE = 'http://localhost:3001';
export function resolveImageUrl(path) {
  if (!path) return "/default-car.jpg";
  if (path.startsWith("/uploads")) return `${API_BASE}${path}`;
  return "/default-car.jpg";
}
