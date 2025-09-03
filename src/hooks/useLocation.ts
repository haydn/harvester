import { useEffect, useState } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (window) setLocation(window.location);
  }, []);

  return location;
};
