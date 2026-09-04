"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-[#18302a] text-white hover:bg-[#285046]", outline: "border border-white/20 bg-white/10 text-white hover:bg-white/20", ghost: "text-white hover:bg-white/10" }, size: { default: "h-9 px-4 py-2", sm: "h-8 px-3 text-xs", lg: "h-11 px-7", icon: "h-9 w-9" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Component = asChild ? Slot : "button"; return <Component className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />; });
Button.displayName = "Button";

const liquidbuttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "text-white hover:scale-105", outline: "border border-white/25 text-white hover:bg-white/10", ghost: "text-white hover:bg-white/10" }, size: { default: "h-10 px-5", lg: "h-12 px-8", xxl: "h-14 px-10", icon: "size-10" } }, defaultVariants: { variant: "default", size: "xxl" } });
export function LiquidButton({ className, variant, size, asChild = false, children, ...props }: React.ComponentProps<"button"> & VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean }) { const Component = asChild ? Slot : "button"; return <Component data-slot="button" className={cn("relative isolate overflow-hidden", liquidbuttonVariants({ variant, size, className }))} {...props}><span className="absolute inset-0 -z-10 rounded-full border border-white/35 bg-white/15 shadow-[inset_2px_2px_5px_rgba(255,255,255,.4),inset_-3px_-3px_8px_rgba(0,0,0,.18),0_8px_24px_rgba(0,0,0,.15)] backdrop-blur-md" /><span className="relative z-10">{children}</span></Component>; }

type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze";
const metalColors: Record<ColorVariant, string> = { default: "from-neutral-900 to-neutral-400", primary: "from-emerald-900 to-emerald-300", success: "from-teal-900 to-teal-300", error: "from-red-900 to-red-300", gold: "from-yellow-900 to-yellow-300", bronze: "from-orange-900 to-orange-300" };
export const MetalButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ColorVariant }>(({ children = "Button", className, variant = "default", ...props }, ref) => <span className={cn("inline-flex rounded-md bg-gradient-to-b p-[1.5px] shadow-lg", metalColors[variant])}><button ref={ref} className={cn("h-11 rounded-md bg-gradient-to-b from-white/60 to-black/25 px-6 text-sm font-semibold text-white shadow-inner transition hover:brightness-110 active:translate-y-0.5", className)} {...props}>{children}</button></span>);
MetalButton.displayName = "MetalButton";
export { buttonVariants, liquidbuttonVariants };