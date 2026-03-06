"use client";

import { useEffect, useState } from "react";
import { Settings, Mail, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function SuspendedClient() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Faster spring for a more responsive, intense light tracking
  const springX = useSpring(mouseX, { stiffness: 150, damping: 30, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 30, mass: 0.2 });

  const [isMounted, setIsMounted] = useState(false);

  // Intense ambient light spreading wide
  const bgAmbient = useMotionTemplate`
    radial-gradient(
      800px circle at ${springX}px ${springY}px,
      rgba(255, 255, 255, 0.15),
      transparent 50%
    ),
    radial-gradient(
      1200px circle at ${springX}px ${springY}px,
      rgba(99, 102, 241, 0.2),
      transparent 60%
    )
  `;

  // Sharp, bright spotlight directly under cursor
  const bgTrace = useMotionTemplate`
    radial-gradient(
      350px circle at ${springX}px ${springY}px,
      rgba(168, 85, 247, 0.4),
      transparent 50%
    )
  `;

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950 p-4 font-sans antialiased text-zinc-100 selection:bg-zinc-800 overflow-hidden">
      
      {/* Background Static Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[140px] opacity-80" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[70%] h-[70%] bg-fuchsia-600/30 rounded-full blur-[140px] opacity-80" />
      </div>

      {/* Interactive Connected Net Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Dynamic Cursor Lighting using Framer Motion */}
      {isMounted && (
        <>
          <motion.div 
            className="pointer-events-none fixed inset-0 z-0 mix-blend-color-dodge mix-blend-screen"
            style={{ background: bgAmbient }}
          />
          <motion.div
             className="pointer-events-none fixed inset-0 z-0 mix-blend-screen opacity-100"
             style={{ background: bgTrace }}
          />
        </>
      )}

      <div className="relative z-10 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          // Liquid Glass styling: heavy blur, translucent white base, bright top inner border
          className="bg-zinc-900/40 backdrop-blur-[40px] border-t border-l border-white/20 border-r border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] rounded-[2.5rem] p-8 sm:p-12 overflow-hidden relative group/card"
        >
          {/* Liquid highlight shifting on card hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex flex-col items-center text-center space-y-7 relative z-10">
            
            {/* Liquid Glowing Icon */}
            <div className="relative group/icon cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full blur-2xl opacity-60 animate-pulse group-hover/icon:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/20 text-white p-5 rounded-[1.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-transform duration-700 group-hover/icon:scale-110 group-hover/icon:rotate-12">
                <Settings className="w-10 h-10 text-white animate-[spin_8s_linear_infinite]" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-[2.5rem] font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 font-serif leading-tight">
                Briefly Unavailable
              </h1>
              <p className="text-base sm:text-lg text-zinc-300/80 leading-relaxed max-w-[16rem] sm:max-w-xs mx-auto font-light">
                We&apos;re refining our experience. The site involves routine maintenance and will return shortly.
              </p>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

            <div className="w-full space-y-4">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.2em] text-center">
                Get in touch
              </p>
              
              <a 
                href="mailto:3layered.in@gmail.com" 
                className="group flex items-center justify-between w-full bg-zinc-900/50 backdrop-blur-lg hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 text-white px-6 py-4 rounded-2xl transition-all duration-300 ease-out shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.15)] hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-zinc-200 group-hover:text-white transition-colors">3layered.in@gmail.com</span>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
              </a>
            </div>

          </div>
        </motion.div>
        
        {/* Footer subtle text outside the card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-zinc-500 font-medium tracking-wider">
            3 Layered • Architecture & Miniatures
          </p>
        </motion.div>
      </div>
    </main>
  );
}
