// Stub for `next/navigation` so components authored for Next.js (e.g.
// FlashSnackbar) resolve inside the Vite-based Storybook build. The router
// is a no-op and the URL hooks return empty values.
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
});
export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});
export const redirect = () => {};
export const notFound = () => {};
