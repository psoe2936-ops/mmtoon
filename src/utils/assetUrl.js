export const toAssetUrl = (path) => {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};
