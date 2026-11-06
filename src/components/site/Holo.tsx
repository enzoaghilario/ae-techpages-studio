import type { HTMLAttributes, PointerEvent, ReactNode } from "react";

/** Cartão holográfico: inclina em 3D e acende a borda onde o mouse está. */
export function Holo({ children, className = "", ...rest }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const s = e.currentTarget.style;
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
    s.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    s.setProperty("--rx", `${(0.5 - y) * 12}deg`);
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    const s = e.currentTarget.style;
    s.setProperty("--ry", "0deg");
    s.setProperty("--rx", "0deg");
  };
  return (
    <div {...rest} onPointerMove={move} onPointerLeave={leave} className={`holo ${className}`}>
      {children}
    </div>
  );
}
