import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  return (
    <div className={cn("motion-reveal", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
