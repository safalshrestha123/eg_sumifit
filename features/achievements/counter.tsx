"use client";

import { useCounter } from "@/hooks/use-counter";

export function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [counterRef, counterValue] = useCounter(value);
  return (
    <div className="text-center">
      <p className="text-4xl font-black text-gray-950 dark:text-white sm:text-5xl"><span ref={counterRef}>{counterValue}</span><span className="text-orange-500">{suffix}</span></p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
