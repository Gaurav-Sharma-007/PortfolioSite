import React, { useEffect, useRef } from 'react';

const RockBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const TAU = Math.PI * 2;

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        // ─── DRAW: GUITAR ────────────────────────────────────────────────────
        function drawGuitar(x, y, r, rotation, alpha) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            const s = r / 22;

            ctx.shadowColor = '#e85d04';
            ctx.shadowBlur = 24 * s;

            // Lower bout
            ctx.beginPath();
            ctx.ellipse(0, 8 * s, 14 * s, 17 * s, 0, 0, TAU);
            let g = ctx.createRadialGradient(-4 * s, 0, 2 * s, 0, 8 * s, 18 * s);
            g.addColorStop(0, '#f48c06');
            g.addColorStop(0.5, '#e85d04');
            g.addColorStop(1, '#5a1a00');
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = '#ff6b1a';
            ctx.lineWidth = s * 0.8;
            ctx.stroke();

            // Upper bout
            ctx.beginPath();
            ctx.ellipse(0, -8 * s, 10 * s, 12 * s, 0, 0, TAU);
            g = ctx.createRadialGradient(-3 * s, -12 * s, 1 * s, 0, -8 * s, 13 * s);
            g.addColorStop(0, '#f48c06');
            g.addColorStop(1, '#7a2700');
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = '#ff6b1a';
            ctx.lineWidth = s * 0.6;
            ctx.stroke();

            // Waist
            ctx.beginPath();
            ctx.arc(0, 0, 3 * s, 0, TAU);
            ctx.fillStyle = 'rgba(255,180,80,0.4)';
            ctx.fill();

            // Sound hole
            ctx.beginPath();
            ctx.arc(0, 8 * s, 4.5 * s, 0, TAU);
            ctx.fillStyle = '#1a0800';
            ctx.fill();
            ctx.strokeStyle = '#ff8c00';
            ctx.lineWidth = s * 0.5;
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Neck
            ctx.beginPath();
            ctx.rect(-2.5 * s, -48 * s, 5 * s, 40 * s);
            g = ctx.createLinearGradient(-3 * s, 0, 3 * s, 0);
            g.addColorStop(0, '#4a2c00');
            g.addColorStop(0.3, '#8B5A2B');
            g.addColorStop(0.7, '#6B3F1A');
            g.addColorStop(1, '#2a1500');
            ctx.fillStyle = g;
            ctx.fill();

            // Frets
            for (let i = 1; i <= 5; i++) {
                ctx.beginPath();
                ctx.moveTo(-2.5 * s, -48 * s + i * 7 * s);
                ctx.lineTo(2.5 * s, -48 * s + i * 7 * s);
                ctx.strokeStyle = 'rgba(255,220,100,0.7)';
                ctx.lineWidth = s * 0.4;
                ctx.stroke();
            }

            // Strings
            ['#ffffffcc', '#ffd60acc', '#ffe08acc'].forEach((c, i) => {
                ctx.beginPath();
                ctx.moveTo((i - 1) * 1.2 * s, -48 * s);
                ctx.lineTo((i - 1) * 1.2 * s, 10 * s);
                ctx.strokeStyle = c;
                ctx.lineWidth = s * 0.3;
                ctx.stroke();
            });

            // Headstock
            ctx.beginPath();
            ctx.roundRect(-4 * s, -54 * s, 8 * s, 8 * s, 2 * s);
            ctx.fillStyle = '#3a1a00';
            ctx.fill();
            ctx.strokeStyle = '#ff8c00';
            ctx.lineWidth = s * 0.4;
            ctx.stroke();

            ctx.restore();
        }

        // ─── DRAW: DRUM ──────────────────────────────────────────────────────
        function drawDrum(x, y, r, rotation, alpha) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            const s = r / 22;
            const rx = 18 * s;
            const shellH = 22 * s;

            ctx.shadowColor = '#c77dff';
            ctx.shadowBlur = 28 * s;

            // Top drumhead
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, 7 * s, 0, 0, TAU);
            let g = ctx.createRadialGradient(0, 0, 2 * s, 0, 0, rx);
            g.addColorStop(0, '#e8c8ff');
            g.addColorStop(0.4, '#9b4dca');
            g.addColorStop(1, '#3a005e');
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = '#d0a0ff';
            ctx.lineWidth = s;
            ctx.stroke();

            // Shell sides
            ctx.beginPath();
            ctx.moveTo(-rx, 0);
            ctx.lineTo(-rx, shellH);
            ctx.ellipse(0, shellH, rx, 6 * s, 0, Math.PI, 0);
            ctx.lineTo(rx, 0);
            g = ctx.createLinearGradient(-rx, 0, rx, 0);
            g.addColorStop(0, '#2d0050');
            g.addColorStop(0.2, '#7b2d8b');
            g.addColorStop(0.5, '#c77dff');
            g.addColorStop(0.8, '#7b2d8b');
            g.addColorStop(1, '#2d0050');
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = '#c77dff';
            ctx.lineWidth = s * 0.6;
            ctx.stroke();

            // Bottom rim
            ctx.beginPath();
            ctx.ellipse(0, shellH, rx, 6 * s, 0, 0, TAU);
            ctx.fillStyle = '#1a0030';
            ctx.fill();
            ctx.strokeStyle = '#a060f0';
            ctx.lineWidth = s * 0.5;
            ctx.stroke();

            // Tension rods
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * TAU;
                const bx = Math.cos(angle) * (rx - 2 * s);
                ctx.beginPath();
                ctx.moveTo(bx, -5 * s);
                ctx.lineTo(bx, shellH + 3 * s);
                ctx.strokeStyle = '#d0a0ff88';
                ctx.lineWidth = s * 0.4;
                ctx.stroke();
            }

            // Top rim highlight
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, 7 * s, 0, 0, TAU);
            ctx.strokeStyle = '#ffffff88';
            ctx.lineWidth = s * 0.6;
            ctx.stroke();

            ctx.restore();
        }

        // ─── DRAW: MUSIC NOTE ────────────────────────────────────────────────
        function drawNote(x, y, size, rotation, color, alpha) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            const s = size;

            ctx.beginPath();
            ctx.ellipse(-s * 0.3, 0, s * 0.7, s * 0.5, -0.4, 0, TAU);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(s * 0.35, 0);
            ctx.lineTo(s * 0.35, -s * 2.2);
            ctx.lineWidth = s * 0.18;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(s * 0.35, -s * 2.2);
            ctx.bezierCurveTo(s * 1.2, -s * 1.9, s * 1.4, -s * 1.2, s * 0.6, -s * 0.8);
            ctx.lineWidth = s * 0.18;
            ctx.stroke();

            ctx.restore();
        }

        // ─── PARTICLE SPAWNERS ───────────────────────────────────────────────
        const noteColors = ['#00f5d4', '#fee440', '#f15bb5', '#9b5de5'];

        function spawnCollisionNotes(x, y) {
            const count = 6 + Math.floor(Math.random() * 7);
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * TAU;
                const speed = 2 + Math.random() * 5.5;
                noteParticles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 9 + Math.random() * 16,
                    rotation: Math.random() * TAU,
                    rotSpeed: (Math.random() - 0.5) * 0.22,
                    color: noteColors[Math.floor(Math.random() * 4)],
                    life: 1,
                    decay: 0.011 + Math.random() * 0.018,
                    gravity: -0.04 - Math.random() * 0.04,
                    isCollision: true
                });
            }
        }

        function spawnSparks(x, y) {
            for (let i = 0; i < 22; i++) {
                const angle = Math.random() * TAU;
                const speed = 3 + Math.random() * 9;
                sparks.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: Math.random() > 0.5 ? '#ffffff' : '#ffd60a',
                    life: 1,
                    decay: 0.022 + Math.random() * 0.04
                });
            }
        }

        // ─── INIT ─────────────────────────────────────────────────────────────
        const instruments = [];
        const noteParticles = [];
        const sparks = [];

        const instrumentTypes = ['guitar', 'guitar', 'guitar', 'drum', 'drum'];
        for (let i = 0; i < 9; i++) {
            const m = 80;
            instruments.push({
                type: instrumentTypes[i % instrumentTypes.length],
                x: m + Math.random() * (W - m * 2),
                y: m + Math.random() * (H - m * 2),
                r: 52 + Math.random() * 50,
                vx: (Math.random() - 0.5) * 1.8,
                vy: (Math.random() - 0.5) * 1.8,
                rotation: Math.random() * TAU,
                rotSpeed: (Math.random() - 0.5) * 0.012,
                pulse: Math.random() * TAU,
                alpha: 0.75 + Math.random() * 0.25
            });
        }

        // Background stars
        const bgStars = Array.from({ length: 200 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.6,
            twinkle: Math.random() * TAU,
            speed: 0.02 + Math.random() * 0.04
        }));

        let tick = 0;
        let animId;

        // ─── BACKGROUND DRAW ─────────────────────────────────────────────────
        function drawBackground() {
            const bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, '#000008');
            bg.addColorStop(0.5, '#080012');
            bg.addColorStop(1, '#020008');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            bgStars.forEach(s => {
                s.twinkle += s.speed;
                const a = 0.3 + 0.5 * Math.abs(Math.sin(s.twinkle));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, TAU);
                ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
                ctx.fill();
            });

            // Stage light beams
            [
                { x: W * 0.15, color: 'rgba(232,93,4,' },
                { x: W * 0.5,  color: 'rgba(120,40,200,' },
                { x: W * 0.82, color: 'rgba(0,180,200,' },
            ].forEach(b => {
                const bGrad = ctx.createLinearGradient(b.x, 0, b.x + 80, H * 0.8);
                bGrad.addColorStop(0, b.color + '0.13)');
                bGrad.addColorStop(1, b.color + '0)');
                ctx.beginPath();
                ctx.moveTo(b.x - 5, 0);
                ctx.lineTo(b.x + 160, H * 0.8);
                ctx.lineTo(b.x + 80, H * 0.8);
                ctx.lineTo(b.x + 5, 0);
                ctx.fillStyle = bGrad;
                ctx.fill();
            });
        }

        // ─── MAIN LOOP ───────────────────────────────────────────────────────
        function loop() {
            ctx.clearRect(0, 0, W, H);
            drawBackground();
            tick++;

            // Move & wall-bounce instruments
            instruments.forEach(inst => {
                inst.x += inst.vx;
                inst.y += inst.vy;
                inst.rotation += inst.rotSpeed;
                inst.pulse += 0.04;

                if (inst.x < inst.r)     { inst.x = inst.r;     inst.vx = Math.abs(inst.vx) * 0.95; }
                if (inst.x > W - inst.r) { inst.x = W - inst.r; inst.vx = -Math.abs(inst.vx) * 0.95; }
                if (inst.y < inst.r)     { inst.y = inst.r;     inst.vy = Math.abs(inst.vy) * 0.95; }
                if (inst.y > H - inst.r) { inst.y = H - inst.r; inst.vy = -Math.abs(inst.vy) * 0.95; }
            });

            // Collision detection & response
            for (let i = 0; i < instruments.length; i++) {
                for (let j = i + 1; j < instruments.length; j++) {
                    const a = instruments[i], b = instruments[j];
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    const minD = a.r + b.r - 10;
                    if (d < minD && d > 0) {
                        const nx = dx / d, ny = dy / d;
                        const relV = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                        if (relV > 0) {
                            const impulse = relV * 1.1;
                            a.vx -= impulse * nx; a.vy -= impulse * ny;
                            b.vx += impulse * nx; b.vy += impulse * ny;
                            const overlap = minD - d;
                            a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
                            b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
                            const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
                            spawnCollisionNotes(mx, my);
                            spawnSparks(mx, my);
                        }
                    }
                }
            }

            // Draw instruments with glow halos
            instruments.forEach(inst => {
                const pulse = 1 + Math.sin(inst.pulse) * 0.06;
                const drawR = inst.r * pulse;
                const isGuitar = inst.type === 'guitar';

                ctx.save();
                ctx.globalAlpha = 0.13;
                ctx.beginPath();
                ctx.arc(inst.x, inst.y, drawR * 0.9, 0, TAU);
                ctx.fillStyle = isGuitar ? '#e85d04' : '#7b2d8b';
                ctx.shadowColor = isGuitar ? '#e85d04' : '#c77dff';
                ctx.shadowBlur = 50;
                ctx.fill();
                ctx.restore();

                if (isGuitar) drawGuitar(inst.x, inst.y, drawR, inst.rotation, inst.alpha);
                else drawDrum(inst.x, inst.y, drawR, inst.rotation, inst.alpha);
            });

            // Update & draw collision note particles
            for (let i = noteParticles.length - 1; i >= 0; i--) {
                const n = noteParticles[i];
                n.x += n.vx; n.y += n.vy;
                n.vy += n.gravity;
                n.vx *= 0.97;
                n.rotation += n.rotSpeed;
                n.life -= n.decay;
                if (n.life <= 0) { noteParticles.splice(i, 1); continue; }
                const scaleFactor = n.life > 0.7 ? (1 - n.life) * 3.3 : n.life * 1.3;
                drawNote(n.x, n.y, n.size * Math.min(1, scaleFactor + 0.3), n.rotation, n.color, Math.max(0, n.life));
            }

            // Update & draw spark streaks
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.x += s.vx; s.y += s.vy;
                s.vx *= 0.93; s.vy *= 0.93;
                s.vy += 0.06;
                s.life -= s.decay;
                if (s.life <= 0) { sparks.splice(i, 1); continue; }
                ctx.save();
                ctx.globalAlpha = s.life * s.life;
                ctx.strokeStyle = s.color;
                ctx.shadowColor = s.color;
                ctx.shadowBlur = 6;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 7, s.y - s.vy * 7);
                ctx.stroke();
                ctx.restore();
            }

            // Ambient floating notes (rise from bottom)
            if (tick % 90 === 0) {
                for (let i = 0; i < 3; i++) {
                    noteParticles.push({
                        x: Math.random() * W,
                        y: H + 20,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: -(0.6 + Math.random() * 0.8),
                        size: 18 + Math.random() * 24,
                        rotation: Math.random() * TAU,
                        rotSpeed: (Math.random() - 0.5) * 0.008,
                        color: noteColors[Math.floor(Math.random() * 4)],
                        life: 1,
                        decay: 0.003 + Math.random() * 0.004,
                        gravity: 0
                    });
                }
            }

            animId = requestAnimationFrame(loop);
        }

        loop();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default RockBackground;