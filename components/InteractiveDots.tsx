"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseX: number;
  baseY: number;
  opacity: number;
}

export default function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const density = 80; // Decreased density (more pixels per particle)
      const columns = Math.ceil(canvas.width / density);
      const rows = Math.ceil(canvas.height / density);

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          // Add some randomness to position
          const x = i * density + (Math.random() - 0.5) * density * 0.8;
          const y = j * density + (Math.random() - 0.5) * density * 0.8;
          
          if (x > canvas.width || y > canvas.height) continue;

          particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            baseX: x,
            baseY: y,
            size: Math.random() * 2 + 1, // Slightly larger dots since they are separated
            opacity: Math.random() * 0.5 + 0.1,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = smoothMouseX.get();
      const my = smoothMouseY.get();

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Check interaction with mouse
        const dx = mx - p1.x;
        const dy = my - p1.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        // Magnetic repel/attract effect based on mouse distance
        if (distanceToMouse < 200) {
          const force = (200 - distanceToMouse) / 200;
          const angle = Math.atan2(dy, dx);
          
          // Pull gently towards mouse
          const pullX = Math.cos(angle) * force * 2;
          const pullY = Math.sin(angle) * force * 2;

          p1.vx += pullX;
          p1.vy += pullY;
          
          p1.opacity = Math.min(0.9, p1.opacity + 0.05);
        } else {
          p1.opacity = Math.max(0.3, p1.opacity * 0.95);
        }

        // Spring back to base position
        p1.vx += (p1.baseX - p1.x) * 0.04;
        p1.vy += (p1.baseY - p1.y) * 0.04;

        // Apply friction
        p1.vx *= 0.85;
        p1.vy *= 0.85;

        // Update position
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Draw individual separated particle (Neon Sky Blue)
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${p1.opacity})`;
        ctx.fill();
        
        // Remove the connected lines completely
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
