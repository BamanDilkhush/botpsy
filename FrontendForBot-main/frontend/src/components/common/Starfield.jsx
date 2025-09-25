import React, { useEffect, useRef } from "react";

/**
 * Enhanced Starfield (brighter + debug logs).
 * - Console log to verify it's mounted
 * - Ensures canvas uses devicePixelRatio for crispness
 * - Slightly stronger lines so you can verify visibility
 */
const Starfield = ({ starCount = 160, maxLinkDistance = 120 }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("[Starfield] mounted", { canvas });

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // handle devicePixelRatio for sharp rendering
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Create stars
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    let lastTime = performance.now();

    function draw(now = performance.now()) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        s.x += s.vx * dt * 60;
        s.y += s.vy * dt * 60;

        // bounce
        if (s.x < 0) { s.x = 0; s.vx *= -1; }
        if (s.x > width) { s.x = width; s.vx *= -1; }
        if (s.y < 0) { s.y = 0; s.vy *= -1; }
        if (s.y > height) { s.y = height; s.vy *= -1; }

        // twinkle
        s.phase += dt * (0.5 + (i % 5) * 0.02);
        const tw = 0.6 + 0.4 * Math.sin(s.phase);
        const radius = s.r * tw;

        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.85 * tw})`;
        ctx.fill();
      }

      // connection lines — slightly stronger so you can see them
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLinkDistance) {
            const alpha = 1 - dist / maxLinkDistance;
            ctx.strokeStyle = `rgba(200,220,255,${0.12 * alpha})`;
            ctx.lineWidth = 0.7 * alpha;
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
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // reapply DPR scaling
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-30 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default Starfield;
