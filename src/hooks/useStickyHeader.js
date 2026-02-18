import { useEffect, useState } from "react";

export const useStickyHeader = (offset = 100) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > offset);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [offset]);

  return isSticky;
};