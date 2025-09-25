import React, { useEffect, useRef } from "react";

/**
 * Starfield with subtle motion and connecting lines (constellation effect).
 * - pointer-events-none so it does not block UI interaction
 * - -z-20 so it sits behind your existing -z-10 blobs
 */
const Starfield = ({ starCount = 120, maxLinkDistance = 120 }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // create stars
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      twinkle: Math.random() * 0.5 + 0.5,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // subtle background glow (very faint)
      // ctx.fillStyle = "rgba(10,12,20,0.02)";
      // ctx.fillRect(0, 0, width, height);

      // draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // move
        s.x += s.vx;
        s.y += s.vy;

        // bounce edges
        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;

        // twinkle effect
        const tw = (Math.sin((Date.now() / 500) + i) + 1) / 2;
        const radius = s.r * (0.7 + 0.6 * tw * s.twinkle);

        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.7 * (0.6 + tw * s.twinkle)})`;
        ctx.fill();
      }

      // draw connecting lines (constellation)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxLinkDistance) {
            const alpha = 1 - dist / maxLinkDistance;
            // only draw faint lines
            ctx.strokeStyle = `rgba(200,220,255,${0.08 * alpha})`;
            ctx.lineWidth = 0.6 * alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [starCount, maxLinkDistance]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default Starfield;
