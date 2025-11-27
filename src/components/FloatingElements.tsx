"use client";

import React, { useEffect, useRef } from "react";

const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const createFloatingElement = () => {
      const element = document.createElement("div");
      element.className = "floating-element";
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      element.style.left = `${left}%`;
      element.style.top = `${top}%`;
      
      // Random size
      const size = Math.random() * 20 + 10;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      
      // Random color
      const colors = [
        "bg-indigo-500/20",
        "bg-purple-500/20",
        "bg-pink-500/20",
        "bg-blue-500/20"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Apply color classes
      element.classList.add("rounded-full");
      
      // Random animation duration
      const duration = Math.random() * 20 + 10;
      element.style.animationDuration = `${duration}s`;
      
      containerRef.current?.appendChild(element);
      
      // Remove element after animation completes
      setTimeout(() => {
        element.remove();
      }, duration * 1000);
    };

    // Create initial elements
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        createFloatingElement();
      }, i * 500);
    }

    // Create new elements periodically
    const interval = setInterval(createFloatingElement, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      <style>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate(50vw, 50vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .floating-element {
          position: absolute;
          border-radius: 50%;
          animation: float 15s ease-in-out infinite;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;