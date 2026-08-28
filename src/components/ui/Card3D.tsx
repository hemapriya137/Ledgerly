"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt angle in degrees
  glowColor?: "emerald" | "gold" | "none";
}

export function Card3D({
  children,
  className,
  depth = 8,
  glowColor = "emerald",
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -depth;
    const rotY = ((x - centerX) / centerX) * depth;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const glowBorder =
    glowColor === "gold"
      ? "hover:border-amber-500/50 hover:shadow-3d-gold"
      : glowColor === "emerald"
      ? "hover:border-emerald-500/40 hover:shadow-3d-emerald"
      : "";

  return (
    <div
      style={{ perspective: "1000px" }}
      className="inline-block w-full transition-transform duration-200"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-[#09241b]/80 via-[#061812]/90 to-[#040d0a]/95 backdrop-blur-xl p-6 shadow-3d-card",
          glowBorder,
          className
        )}
        {...props}
      >
        {/* Dynamic Glare Reflection */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default Card3D;
