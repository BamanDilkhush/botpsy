// src/components/common/Starfield.jsx
import React, { useEffect, useRef } from "react";

/**
 * Starfield (absolute) - use inside a parent with `position: relative`.
 * This version uses inline styles for zIndex to avoid Tailwind negative-z pitfalls.
 */
const Starfield = ({ starCount = 160, maxLinkDistance = 120 }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("[Starfield] mounted", canvas);

    const ctx = canvas.getContext("2d");

    // size setup (use parent size if available)
    const parent = canvas.parentElement;
    let width = parent ? parent.clientWidth : window.innerWidth;
    let height = parent ? parent.clientHeight : window.innerHeight;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // create stars
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let last = performance.now();

    function draw(now = performance.now()) {
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, width, height);

      // draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx * dt * 60;
        s.y += s.vy * dt * 60;

        if (s.x < 0) { s.x = 0; s.vx *= -1; }
        if (s.x > width) { s.x = width; s.vx *= -1; }
        if (s.y < 0) { s.y = 0; s.vy *= -1; }
        if (s.y > height) { s.y = height; s.vy *= -1; }

        s.phase += dt * (0.6 + (i % 6) * 0.02);
        const tw = 0.6 + 0.4 * Math.sin(s.phase);
        const radius = s.r * tw;

        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.9 * tw})`;
        ctx.fill();
      }

      // draw lines (constellation)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLinkDistance) {
            const alpha = 1 - dist / maxLinkDistance;
            ctx.strokeStyle = `rgba(200,220,255,${0.14 * alpha})`;
            ctx.lineWidth = 0.8 * alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      console.log("[Starfield] unmounted");
    };
  }, [starCount, maxLinkDistance]);

  // Inline style ensures it sits behind children of the relative parent.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -9999,
        pointerEvents: "none",
      }}
    />
  );
};

export default Starfield;
