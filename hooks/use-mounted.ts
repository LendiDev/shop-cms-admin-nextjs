import { useEffect, useState } from "react";

// This hook helps avoid unnecessary render hibernation from a server side while loading
export const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted };
};
