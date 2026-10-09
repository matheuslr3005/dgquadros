import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

type InViewOptions = {
  rootMargin?: string;
  threshold?: number;
};

export const useInView = <T extends Element>({
  rootMargin = "200px 0px",
  threshold = 0,
}: InViewOptions = {}): [RefObject<T>, boolean] => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin,
      threshold,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
};
