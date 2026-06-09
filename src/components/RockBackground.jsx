import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

const RockBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = -1000, mouseY = -1000;

    const resize = () => {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // Recalculate on scroll (for dynamic content)
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(document.body);

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Instrument SVG Paths (Centered on a 24x24 grid) ---
    const guitarPath = new Path2D("M10 2L10 8L7 8L5 10L5 15Q5 19 9 20Q13 21 15 19Q17 17 17 13L17 10L15 8L12 8L12 2Z");
    const drumPath = new Path2D("M4 8C4 6 8 4 12 4C16 4 20 6 20 8L20 16C20 18 16 20 12 20C8 20 4 18 4 16ZM4 8C4 10 8 12 12 12C16 12 20 10 20 8");
    const saxPath = new Path2D("M16 2L14 4L12 8L10 12L8 14Q6 16 6 18Q6 21 9 21Q12 21 12 18L14 14L16 10L18 6L20 4Z");
    const pianoPath = new Path2D("M3 6L3 18L21 18L21 6ZM7 6L7 14L9 14L9 6ZM11 6L11 14L13 14L13 6ZM17 6L17 14L19 14L19 6Z");
    const violinPath = new Path2D("M12 1L12 5L10 7Q8 9 8 12Q8 15 10 17L12 19L12 23L14 23L14 19L16 17Q18 15 18 12Q18 9 16 7L14 5L14 1Z");
    const trumpetPath = new Path2D("M2 10L2 14L8 14L10 16L12 16L12 8L10 8L8 10ZM12 10L20 10L20 14L12 14ZM20 8L22 8L22 16L20 16Z");

    const instrumentPaths = [guitarPath, drumPath, saxPath, pianoPath, violinPath, trumpetPath];

    // Music note characters
    const noteChars = ['♪', '♫', '♩', '♬', '𝅗𝅥'];

    // --- Particles & Instruments Setup ---
    const NUM_INSTRUMENTS = Math.min(30, Math.floor(width / 50));
    const instruments = [];
    const musicNotes = [];
    const dustParticles = [];

    // Colors for instruments (more vibrant highlights)
    const instrumentColors = [
      { stroke: '#c084fc', fill: 'rgba(168, 85, 247, 0.25)' }, // Purple glow
      { stroke: '#f472b6', fill: 'rgba(236, 72, 153, 0.25)' }, // Pink glow
      { stroke: '#fbbf24', fill: 'rgba(245, 158, 11, 0.25)' },  // Amber glow
      { stroke: '#34d399', fill: 'rgba(52, 211, 153, 0.25)' },  // Green glow
      { stroke: '#60a5fa', fill: 'rgba(96, 165, 250, 0.25)' },  // Blue glow
      { stroke: '#fda4af', fill: 'rgba(251, 113, 133, 0.25)' }, // Rose glow
    ];

    // Initialize instruments (larger sizes)
    for (let i = 0; i < NUM_INSTRUMENTS; i++) {
      const typeIdx = Math.floor(Math.random() * instrumentPaths.length);
      const colorIdx = Math.floor(Math.random() * instrumentColors.length);
      instruments.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        size: Math.random() * 2.0 + 2.2, // scale factor: 2.2 to 4.2 -> ~53px to 100px size
        type: typeIdx,
        color: instrumentColors[colorIdx],
        pulse: Math.random() * Math.PI * 2,
        radius: 12, // Base radius matching center alignment
      });
    }

    // Initialize dust particles
    const NUM_DUST = 60;
    for (let i = 0; i < NUM_DUST; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.25 + 0.05,
        alpha: Math.random() * 0.3 + 0.05,
        drift: (Math.random() - 0.5) * 0.15,
      });
    }

    // --- Collision Detection & Music Note Emission ---
    const checkCollisions = () => {
      for (let i = 0; i < instruments.length; i++) {
        for (let j = i + 1; j < instruments.length; j++) {
          const a = instruments[i];
          const b = instruments[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const scaleA = a.size + Math.sin(a.pulse) * 0.08;
          const scaleB = b.size + Math.sin(b.pulse) * 0.08;
          const minDist = (a.radius * scaleA) + (b.radius * scaleB);

          if (dist < minDist && dist > 0) {
            // Elastic bounce
            const nx = dx / dist;
            const ny = dy / dist;
            const relVx = a.vx - b.vx;
            const relVy = a.vy - b.vy;
            const relVel = relVx * nx + relVy * ny;

            if (relVel > 0) {
              const m1 = scaleA * scaleA;
              const m2 = scaleB * scaleB;
              const impulse = (2 * relVel) / (m1 + m2);

              a.vx -= impulse * nx * m2;
              a.vy -= impulse * ny * m2;
              b.vx += impulse * nx * m1;
              b.vy += impulse * ny * m1;

              // Separate overlapping instruments
              const overlap = minDist - dist;
              a.x -= nx * overlap * 0.5;
              a.y -= ny * overlap * 0.5;
              b.x += nx * overlap * 0.5;
              b.y += ny * overlap * 0.5;

              // Emit music notes at collision point
              const collisionX = (a.x + b.x) / 2;
              const collisionY = (a.y + b.y) / 2;
              const numNotes = Math.floor(Math.random() * 2) + 2;

              for (let n = 0; n < numNotes; n++) {
                const angle = (Math.PI * 2 / numNotes) * n + Math.random() * 0.5;
                const speed = Math.random() * 1.2 + 0.6;
                const noteColor = Math.random() > 0.5 ? a.color.stroke : b.color.stroke;
                musicNotes.push({
                  x: collisionX,
                  y: collisionY,
                  vx: Math.cos(angle) * speed,
                  vy: -Math.abs(Math.sin(angle) * speed) - 0.4,
                  char: noteChars[Math.floor(Math.random() * noteChars.length)],
                  life: 1.0,
                  decay: 0.007 + Math.random() * 0.007,
                  size: Math.random() * 12 + 14,
                  color: noteColor,
                  rotation: Math.random() * Math.PI * 2,
                  rotSpeed: (Math.random() - 0.5) * 0.04,
                  wiggle: Math.random() * Math.PI * 2,
                  wiggleSpeed: Math.random() * 0.08 + 0.04,
                  wiggleAmp: Math.random() * 0.4 + 0.2,
                });
              }
            }
          }
        }
      }
    };

    // --- Render Loop ---
    let animationFrameId;
    let lastTime = performance.now();

    const render = (currentTime) => {
      const delta = Math.min((currentTime - lastTime) / 16.67, 3);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const isDark = themeRef.current === 'dark';

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.3, '#100525');
        gradient.addColorStop(0.7, '#070715');
        gradient.addColorStop(1, '#030308');
      } else {
        gradient.addColorStop(0, '#f3edfe');
        gradient.addColorStop(0.3, '#faf7f2');
        gradient.addColorStop(0.7, '#eeebf8');
        gradient.addColorStop(1, '#e9e4f2');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw dust particles
      dustParticles.forEach(p => {
        p.y -= p.speed * delta;
        p.x += p.drift * delta;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(192, 132, 252, ${p.alpha * 0.45})`
          : `rgba(124, 58, 237, ${p.alpha * 0.25})`;
        ctx.fill();
      });

      // Update & draw instruments
      const scrollY = window.scrollY;

      instruments.forEach(inst => {
        // Mouse repulsion
        const dmx = inst.x - mouseX;
        const dmy = inst.y - mouseY;
        const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mouseDist < 160 && mouseDist > 0) {
          const force = (160 - mouseDist) / 160 * 0.22;
          inst.vx += (dmx / mouseDist) * force;
          inst.vy += (dmy / mouseDist) * force;
        }

        // Apply physics
        inst.x += inst.vx * delta;
        inst.y += inst.vy * delta;
        inst.vx *= 0.99;
        inst.vy *= 0.99;
        inst.rotation += inst.rotSpeed * delta;
        inst.pulse += 0.02 * delta;

        const scale = inst.size + Math.sin(inst.pulse) * 0.08;
        const rad = inst.radius * scale;

        // Bounce off walls (replaces wrap-around)
        if (inst.x < rad) {
          inst.x = rad;
          inst.vx = Math.abs(inst.vx);
        } else if (inst.x > width - rad) {
          inst.x = width - rad;
          inst.vx = -Math.abs(inst.vx);
        }

        if (inst.y < rad) {
          inst.y = rad;
          inst.vy = Math.abs(inst.vy);
        } else if (inst.y > height - rad) {
          inst.y = height - rad;
          inst.vy = -Math.abs(inst.vy);
        }

        // Viewport culling
        const viewTop = scrollY - 120;
        const viewBottom = scrollY + window.innerHeight + 120;
        if (inst.y < viewTop || inst.y > viewBottom) return;

        ctx.save();
        ctx.translate(inst.x, inst.y);
        ctx.rotate(inst.rotation);
        ctx.scale(scale, scale);
        ctx.translate(-12, -12); // Center path rotation

        // 3D Shadows
        ctx.shadowColor = inst.color.stroke;
        ctx.shadowBlur = 12 + Math.sin(inst.pulse) * 4;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Base semi-transparent body
        ctx.fillStyle = isDark 
          ? inst.color.fill.replace('0.25', '0.35') 
          : inst.color.fill.replace('0.25', '0.22');
        ctx.fill(instrumentPaths[inst.type]);

        // Lighting/Highlight Gradient
        const highlightGrad = ctx.createLinearGradient(0, 0, 24, 24);
        highlightGrad.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.65)');
        highlightGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
        highlightGrad.addColorStop(1, isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = highlightGrad;
        ctx.fill(instrumentPaths[inst.type]);

        // Gloss Outline
        ctx.strokeStyle = inst.color.stroke;
        ctx.lineWidth = 1.35;
        ctx.globalAlpha = isDark ? 0.85 : 0.7;
        ctx.stroke(instrumentPaths[inst.type]);

        // --- High-Fidelity Internal Details ---
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = isDark ? 0.75 : 0.6;
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = 0.8;

        if (inst.type === 0) { // Guitar
          // Soundhole
          ctx.beginPath();
          ctx.arc(11, 15, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
          ctx.stroke();

          // Strings
          ctx.beginPath();
          ctx.moveTo(11, 2);  ctx.lineTo(11, 15);
          ctx.moveTo(10.2, 2); ctx.lineTo(10.2, 15);
          ctx.moveTo(11.8, 2); ctx.lineTo(11.8, 15);
          ctx.stroke();
        } else if (inst.type === 1) { // Drum
          // Head rim Highlight
          ctx.beginPath();
          ctx.ellipse(12, 8, 8, 3.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.45)';
          ctx.fill();
          ctx.stroke();
          
          // Tension rods
          ctx.beginPath();
          ctx.moveTo(6, 10);  ctx.lineTo(6, 17);
          ctx.moveTo(10, 12); ctx.lineTo(10, 19);
          ctx.moveTo(14, 12); ctx.lineTo(14, 19);
          ctx.moveTo(18, 10); ctx.lineTo(18, 17);
          ctx.stroke();
        } else if (inst.type === 2) { // Saxophone
          // Keys
          ctx.fillStyle = inst.color.stroke;
          ctx.beginPath();
          ctx.arc(13, 10, 0.8, 0, Math.PI * 2);
          ctx.arc(11.2, 12.8, 0.8, 0, Math.PI * 2);
          ctx.arc(9.5, 14.8, 0.8, 0, Math.PI * 2);
          ctx.fill();
          
          // Bell flare
          ctx.beginPath();
          ctx.arc(9, 20.5, 1.5, 0, Math.PI * 2);
          ctx.stroke();
        } else if (inst.type === 3) { // Piano keys
          // Key Separators
          ctx.beginPath();
          ctx.moveTo(6.5, 12); ctx.lineTo(6.5, 18);
          ctx.moveTo(10.5, 12); ctx.lineTo(10.5, 18);
          ctx.moveTo(14.5, 12); ctx.lineTo(14.5, 18);
          ctx.moveTo(18.5, 12); ctx.lineTo(18.5, 18);
          ctx.stroke();
        } else if (inst.type === 4) { // Violin
          // Strings
          ctx.beginPath();
          ctx.moveTo(11.5, 4); ctx.lineTo(11.5, 18);
          ctx.moveTo(12.5, 4); ctx.lineTo(12.5, 18);
          ctx.stroke();
          
          // f-holes
          ctx.beginPath();
          ctx.moveTo(9, 9);  ctx.quadraticCurveTo(8.5, 12, 9.5, 14);
          ctx.moveTo(15, 9); ctx.quadraticCurveTo(15.5, 12, 14.5, 14);
          ctx.stroke();
        } else if (inst.type === 5) { // Trumpet
          // Valves
          ctx.beginPath();
          ctx.moveTo(13.5, 10); ctx.lineTo(13.5, 7.5);
          ctx.moveTo(15.5, 10); ctx.lineTo(15.5, 7.5);
          ctx.moveTo(17.5, 10); ctx.lineTo(17.5, 7.5);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Check collisions
      checkCollisions();

      // Update & draw music notes
      for (let i = musicNotes.length - 1; i >= 0; i--) {
        const note = musicNotes[i];
        note.wiggle += note.wiggleSpeed * delta;
        note.x += (note.vx + Math.sin(note.wiggle) * note.wiggleAmp) * delta;
        note.y += note.vy * delta;
        note.rotation += note.rotSpeed * delta;
        note.life -= note.decay * delta;
        note.vy *= 0.99;

        if (note.life <= 0) {
          musicNotes.splice(i, 1);
          continue;
        }

        // Viewport culling
        const viewTop = scrollY - 50;
        const viewBottom = scrollY + window.innerHeight + 50;
        if (note.y < viewTop || note.y > viewBottom) continue;

        ctx.save();
        ctx.translate(note.x, note.y);
        ctx.rotate(note.rotation);
        ctx.globalAlpha = note.life * (isDark ? 0.85 : 0.65);
        ctx.fillStyle = note.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = note.color;
        ctx.font = `${note.size * note.life}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(note.char, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default RockBackground;
