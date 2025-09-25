import React, { useEffect, useRef } from "react";

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";

      stars.forEach((star, i) => {
        // move
        star.x += star.dx;
        star.y += star.dy;

        // bounce from edges
        if (star.x < 0 || star.x > width) star.dx *= -1;
        if (star.y < 0 || star.y > height) star.dy *= -1;

        // draw
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // connect lines to nearby stars
        stars.forEach((other, j) => {
          if (i !== j) {
            const dist = Math.hypot(star.x - other.x, star.y - other.y);
            if (dist < 100) {
              ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(draw);
    }

    draw();

    // resize listener
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-background"
    />
  );
};

export default Starfield;
