"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before this element's own reveal starts, in seconds. */
  delay?: number;
}

/** Fades + slides in the whole block as one unit when it enters the viewport. */
export function RevealSection({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerProps extends RevealProps {
  /** Seconds between each child's start. */
  stagger?: number;
  /** "up" for a subtle fade+slide, "pop" for a scale-in with slight overshoot. */
  variant?: "up" | "pop";
}

/** Fades in the direct children of this container with a fast stagger. */
export function StaggerChildren({
  children,
  className = "",
  stagger = 0.07,
  variant = "up",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const targets = ref.current ? Array.from(ref.current.children) : [];
        if (variant === "pop") {
          gsap.from(targets, {
            opacity: 0,
            scale: 0.94,
            y: 12,
            duration: 0.4,
            stagger: { each: stagger, from: "start" },
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: ref.current, start: "top 85%" },
          });
        } else {
          gsap.from(targets, {
            opacity: 0,
            y: 16,
            duration: 0.35,
            stagger,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 85%" },
          });
        }
      });
    },
    { scope: ref, dependencies: [variant, stagger] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
