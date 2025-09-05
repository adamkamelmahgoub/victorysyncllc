
import { useEffect, useRef } from "react";

export function useTilt(max = 8){
  const ref = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    function onMove(e: MouseEvent){
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5;
      const py = (e.clientY - r.top)/r.height - .5;
      el.style.transform = `perspective(800px) rotateX(${(-py*max).toFixed(2)}deg) rotateY(${(px*max).toFixed(2)}deg)`;
    }
    function reset(){ el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)"; }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return ()=>{ el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", reset); };
  }, [max]);
  return { ref };
}
