"use client";

import React from "react";

import { cn } from "../../lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export default function PulsatingButton({
  className,
  children,
  pulseColor = "#000",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "relative font-montserrat text-center cursor-pointer flex justify-center items-center rounded-full text-white dark:text-black bg-black dark:bg-white px-8 py-2",
        className,
      )}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 size-full rounded-full bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
}
