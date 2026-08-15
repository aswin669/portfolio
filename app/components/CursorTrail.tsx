'use client';

import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Detect mobile / touch devices (pointer: coarse) and bypass execution
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);

    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number | null = null;
    let isLoopRunning = false;
    let width = 0;
    let height = 0;

    // Mouse coordinates
    const target = { x: -100, y: -100 };
    const prevTarget = { x: -100, y: -100 };
    let hasMoved = false;

    // Queue of trail points for spring / lerp physics
    const POINT_COUNT = 16;
    const points: TrailPoint[] = Array.from({ length: POINT_COUNT }, () => ({
      x: -100,
      y: -100,
    }));

    // Fade state
    let opacity = 0;
    let idleFrames = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      if (document.hidden) {
        isLoopRunning = false;
        animFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (hasMoved) {
        // Calculate speed
        const dx = target.x - prevTarget.x;
        const dy = target.y - prevTarget.y;
        const speed = Math.hypot(dx, dy);

        prevTarget.x = target.x;
        prevTarget.y = target.y;

        if (speed > 0.2) {
          idleFrames = 0;
          opacity = Math.min(1, opacity + 0.1);
        } else {
          idleFrames++;
          if (idleFrames > 8) {
            opacity = Math.max(0, opacity - 0.04);
          }
        }

        // Head point lerp towards target mouse position
        points[0].x += (target.x - points[0].x) * 0.55;
        points[0].y += (target.y - points[0].y) * 0.55;

        // Subsequent points follow leader with dynamic easing
        for (let i = 1; i < POINT_COUNT; i++) {
          const leader = points[i - 1];
          const ease = 0.42 + (i / POINT_COUNT) * 0.16;
          points[i].x += (leader.x - points[i].x) * ease;
          points[i].y += (leader.y - points[i].y) * ease;
        }

        // Draw line if visible
        if (opacity > 0.005) {
          const isDark = document.documentElement.classList.contains('dark');
          const rgb = isDark ? '255, 255, 255' : '0, 0, 0';

          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // Main crisp tapering spline path segments (No glow/shadow)
          for (let i = 0; i < POINT_COUNT - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const progress = 1 - i / (POINT_COUNT - 1);
            const widthScale = 0.3 + Math.pow(progress, 1.2) * 1.2;
            const alphaScale = Math.pow(progress, 0.65) * opacity * (isDark ? 0.8 : 0.95);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb}, ${alphaScale})`;
            ctx.lineWidth = widthScale;
            ctx.stroke();
          }

          // Crisp leading cursor dot at head point
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${opacity * (isDark ? 0.9 : 1.0)})`;
          ctx.fill();

          ctx.restore();
        }
      }

      // Idle pause logic: stop loop when opacity reaches 0 and points converge
      if (opacity <= 0.005 && idleFrames > 30) {
        isLoopRunning = false;
        animFrameId = null;
        return;
      }

      animFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isLoopRunning && !document.hidden) {
        isLoopRunning = true;
        animFrameId = requestAnimationFrame(render);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        prevTarget.x = target.x;
        prevTarget.y = target.y;
        for (let i = 0; i < POINT_COUNT; i++) {
          points[i].x = target.x;
          points[i].y = target.y;
        }
      }

      startLoop();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        isLoopRunning = false;
      } else if (opacity > 0 || hasMoved) {
        startLoop();
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] cursor-trail-canvas"
      aria-hidden="true"
    />
  );
}
