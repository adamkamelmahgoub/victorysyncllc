
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.12){
  const ref = useRef<T|null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e])=>{
      if (e.isIntersecting){ setInView(true); io.unobserve(el); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}
