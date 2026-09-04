"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";

type PatternShape = "Checks" | "Stripes" | "Edge";
type PresetName = "Prism" | "Lava" | "Plasma" | "Pulse" | "Vortex" | "Mist";
type ColorTuple = [string, string, string];

interface PresetParams { colors: ColorTuple; rotation: number; speed: number; swirl: number; }
const presets: Record<PresetName, PresetParams> = {
  Prism: { colors: ["#050505", "#66B3FF", "#FFFFFF"], rotation: -50, speed: 30, swirl: 50 },
  Lava: { colors: ["#FF9F21", "#FF0303", "#000000"], rotation: 114, speed: 30, swirl: 18 },
  Plasma: { colors: ["#B566FF", "#000000", "#000000"], rotation: 0, speed: 30, swirl: 61 },
  Pulse: { colors: ["#66FF85", "#000000", "#000000"], rotation: -167, speed: 20, swirl: 75 },
  Vortex: { colors: ["#000000", "#FFFFFF", "#000000"], rotation: 50, speed: 20, swirl: 100 },
  Mist: { colors: ["#050505", "#FF66B8", "#050505"], rotation: 0, speed: 39, swirl: 65 },
};

interface GradientConfig { preset: PresetName | "custom"; color1?: string; color2?: string; color3?: string; rotation?: number; speed?: number; swirl?: number; shape?: PatternShape; }
interface NoiseConfig { opacity: number; scale?: number; }
interface AnimatedGradientProps { config?: GradientConfig; noise?: NoiseConfig; radius?: string; style?: CSSProperties; className?: string; }

export default function AnimatedGradient({ config = { preset: "Prism" }, noise, radius = "0px", style, className }: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const params = useMemo(() => {
    const preset = config.preset === "custom" ? null : presets[config.preset];
    return { colors: [config.color1 ?? preset?.colors[0] ?? "#111", config.color2 ?? preset?.colors[1] ?? "#68d5bb", config.color3 ?? preset?.colors[2] ?? "#f5d36a"], rotation: config.rotation ?? preset?.rotation ?? 0, speed: config.speed ?? preset?.speed ?? 25, swirl: config.swirl ?? preset?.swirl ?? 50 };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let animationFrame = 0;
    const resize = () => { const ratio = window.devicePixelRatio || 1; canvas.width = canvas.clientWidth * ratio; canvas.height = canvas.clientHeight * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
    const draw = (time: number) => {
      const width = canvas.clientWidth; const height = canvas.clientHeight; const progress = time * 0.00002 * params.speed; const x = width * (0.45 + Math.sin(progress) * 0.25); const y = height * (0.5 + Math.cos(progress * 1.2) * 0.22);
      const gradient = context.createRadialGradient(x, y, 0, width / 2, height / 2, Math.max(width, height)); gradient.addColorStop(0, params.colors[1]); gradient.addColorStop(.42, params.colors[2]); gradient.addColorStop(1, params.colors[0]); context.fillStyle = gradient; context.fillRect(0, 0, width, height);
      context.globalAlpha = .24; context.fillStyle = params.colors[1]; for (let index = 0; index < 5; index += 1) { const blobX = width * (.2 + index * .19) + Math.sin(progress * (index + 1) + params.rotation) * width * .1; const blobY = height * (.3 + (index % 2) * .38) + Math.cos(progress * 1.5 + index) * height * .16; context.beginPath(); context.arc(blobX, blobY, Math.min(width, height) * (.16 + params.swirl / 900), 0, Math.PI * 2); context.fill(); } context.globalAlpha = 1; animationFrame = requestAnimationFrame(draw);
    };
    animationFrame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animationFrame); observer.disconnect(); };
  }, [params]);

  return <div className={className} style={{ position: "absolute", inset: 0, zIndex: -1, borderRadius: radius, overflow: "hidden", ...style }}><canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />{noise && <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: noise.opacity / 2, backgroundImage: "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMCCgkGBAVJOAVJAAAASklEQVQ4y2NgGAWjYBSMglEwCgY/YGRgZBQUYmJiZGQEkYwMjIyMgoKCjIyMIJKBgRFIMjIyAklGRkYGRkFBYEcwMDIyMjAOUQAA1I4HwVwZAkYAAAAASUVORK5CYII=\")", backgroundSize: (noise.scale ?? 1) * 200, pointerEvents: "none" }} />}</div>;
}