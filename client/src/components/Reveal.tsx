
import React, { useEffect, useRef } from "react";

type Variant = "up" | "fade" | "left" | "right";
type Tag = keyof JSX.IntrinsicElements;

export default function Reveal({
  as,
  children,
  className = "",
  variant = "up",
  delay = 0
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number; // 0..5 -> 0..300ms extra delay
}) {
  const Tag = (as || "div") as any;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayClass =
    delay > 0 ? ` reveal-delay-${Math.min(5, Math.max(0, delay))}` : "";
  return (
    <Tag
      ref={ref as any}
      className={`reveal reveal-${variant}${delayClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
