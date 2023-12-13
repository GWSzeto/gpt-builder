"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "w-[55px] h-screen hover:w-[px]",
)

type SidebarProps = VariantProps<typeof sidebarVariants> & { hoverClassName?: string };

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarProps
>(({ children, className, hoverClassName, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => setIsHovered(true), 300); // 2000ms delayS
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout!);
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      className={cn(`sidebar fixed top-0 left-0 bottom-0 right-0 z-10 w-[50px] h-screen bg-gray-700 ${isHovered ? cn('w-[225px] shadow-2xl', hoverClassName) : ''}`, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
})

export { Sidebar }
