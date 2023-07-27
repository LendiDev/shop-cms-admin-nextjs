import { useMounted } from "./use-mounted";

export const useWindowOrigin = () => {
  const { isMounted } = useMounted();

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  if (!isMounted) {
    return "";
  }

  return origin;
};
