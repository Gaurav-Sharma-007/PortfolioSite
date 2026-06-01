import React, { useEffect, useRef } from 'react';

export const AlzheimerViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        const particles = [];

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            particles.length = 0;
            const particleCount = 400; // More particles for detail

            for (let i = 0; i < particleCount; i++) {
                // Brain Shape Generation (simplified side profile)
                let x, y, valid = false;
                while (!valid) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.random() * 70;
                    x = cx + Math.cos(angle) * (r * 1.2); // Elongate slightly
                    y = cy + Math.sin(angle) * (r * 0.9);

                    // Cut out bottom to shapes like brain stem area roughly
                    if (y > cy + 20 && Math.abs(x - cx) < 30) {
                        valid = false;
                    } else {
                        valid = true;
                    }
                }

                // Clusters (Hippocampus area simulation)
                const isTarget = Math.random() > 0.95;

                particles.push({
                    x, y,
                    baseX: x, baseY: y,
                    size: Math.random() * 1.5 + 0.5,
                    isTarget: isTarget,
                    alpha: 0.2
                });
            }
        };

        init();
        window.addEventListener('resize', init);

        let scanY = 0;
        let tick = 0;

        const render = () => {
            tick++;

            // Medical Dark Background
            ctx.fillStyle = '#050a0f'; // Dark scan blue
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid Lines
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
            for (let i = 0; i < canvas.height; i += 40) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
            ctx.stroke();

            // Scan Line Movement
            scanY = (scanY + 1.5) % canvas.height;

            // Particles
            particles.forEach(p => {
                const dist = Math.abs(p.y - scanY);
                let active = false;

                // Particle Activation
                if (dist < 15) {
                    active = true;
                    p.alpha = 1; // Flash full brightness
                } else {
                    p.alpha = Math.max(0.1, p.alpha - 0.02); // Fade out slowly
                }

                // Color Logic
                if (active) {
                    if (p.isTarget) {
                        ctx.fillStyle = `rgba(255, 50, 50, ${p.alpha})`; // Anomaly Red
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = '#ff0000';
                    } else {
                        ctx.fillStyle = `rgba(100, 200, 255, ${p.alpha})`; // Scan Blue
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = '#00ffff';
                    }
                } else {
                    ctx.fillStyle = `rgba(50, 100, 150, ${p.alpha})`; // Dormant
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, active ? p.size * 2 : p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Scan Beam
            const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, scanY - 20, canvas.width, 40);

            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(canvas.width, scanY);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // UI Overlay
            ctx.font = '10px monospace';
            ctx.fillStyle = '#00ffff';
            ctx.fillText(`SCANNING LAYER [${Math.floor(scanY)}/${canvas.height}]`, 10, 20);

            if (tick % 60 < 30) { // Blink effect
                ctx.fillStyle = '#ff3333';
                ctx.fillText('ANOMALY DETECTED', 10, canvas.height - 10);
            }

            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        }
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const ChurnViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        const users = [];

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let tick = 0;

        const render = () => {
            tick++;

            // Premium Gradient Background (Deep Blue/Purple)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#020210');
            gradient.addColorStop(1, '#050515');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;

            // Draw Premium Funnel (Glassy)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx - 120, 0);
            ctx.lineTo(cx - 25, canvas.height - 40);
            ctx.lineTo(cx + 25, canvas.height - 40);
            ctx.lineTo(cx + 120, 0);
            ctx.closePath();

            // Glass Fill
            const funnelGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            funnelGrad.addColorStop(0, 'rgba(0, 200, 255, 0.05)');
            funnelGrad.addColorStop(1, 'rgba(0, 200, 255, 0.15)');
            ctx.fillStyle = funnelGrad;
            ctx.fill();

            // Glowing Borders
            ctx.strokeStyle = '#00ccff';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00ccff';
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.restore();

            // Spawn new "People"
            if (tick % 8 === 0) {
                users.push({
                    x: canvas.width / 2 + (Math.random() - 0.5) * 80, // Start wider
                    y: -15,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: Math.random() * 0.8 + 1.2, // Slower, more deliberate
                    churned: false,
                    color: '#00ccff', // Cyber Blue
                    scale: Math.random() * 0.3 + 0.8,
                    life: 1
                });
            }

            // Update & Draw Users
            users.forEach((p, i) => {
                p.y += p.vy;
                p.x += p.vx;

                // Funnel Calculation
                const progress = Math.min(1, Math.max(0, p.y / canvas.height));
                const currentWidth = 120 - (progress * 95); // 120 -> 25

                // Churn Logic
                if (!p.churned && p.y > canvas.height * 0.25 && Math.random() < 0.015) {
                    p.churned = true;
                    p.color = '#ff0055'; // Neon Red
                    p.vx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1.5 + 1);
                    p.vy *= 0.6;
                }

                // If Churned, fade out
                if (p.churned) {
                    p.life -= 0.02;
                } else {
                    // Constrain to funnel
                    if (p.x < cx - currentWidth) { p.x = cx - currentWidth; p.vx += 0.05; }
                    if (p.x > cx + currentWidth) { p.x = cx + currentWidth; p.vx -= 0.05; }

                    // Success Color
                    if (p.y > canvas.height * 0.85) {
                        p.color = '#00ffaa'; // Neon Green
                    }
                }

                // Cleanup
                if (p.y > canvas.height + 20 || p.life <= 0) {
                    users.splice(i, 1);
                    return;
                }

                // Draw Person Shape (Icon Style)
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = p.churned ? 5 : 0;

                ctx.save();
                ctx.translate(p.x, p.y);
                const s = p.scale * 1.2; // Slightly larger for visibility
                ctx.scale(s, s);

                // Head
                ctx.beginPath();
                ctx.arc(0, -6, 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Body (Rounded Shoulders)
                ctx.beginPath();
                ctx.moveTo(-3, -3);
                ctx.quadraticCurveTo(0, -4, 3, -3); // Shoulder curve
                ctx.lineTo(3, 4);
                ctx.lineTo(-3, 4);
                ctx.fill();

                // Arms (New)
                ctx.fillRect(-4.5, -2.5, 1.2, 5); // Left Arm
                ctx.fillRect(3.3, -2.5, 1.2, 5);  // Right Arm

                // Legs
                ctx.fillRect(-3, 4, 2.8, 6); // Left Leg
                ctx.fillRect(0.2, 4, 2.8, 6); // Right Leg

                ctx.restore();
            });
            ctx.globalAlpha = 1;

            // Stats Overlay
            if (tick % 60 === 0) {
                // Blink or update logic can go here
            }

            ctx.font = '10px monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'center';
            ctx.fillText('LEADS', cx, 15);

            ctx.fillStyle = '#00ffaa';
            ctx.fillText('CUSTOMERS', cx, canvas.height - 10);

            // Churn Labels
            const churnRate = (42.5 + Math.sin(tick * 0.05) * 2.5).toFixed(1);
            ctx.fillStyle = '#ff1a1a'; // Brighter Neon Red
            ctx.font = 'bold 12px monospace'; // Larger, bolder
            ctx.fillText(`CHURN -${churnRate}%`, cx + 130, canvas.height * 0.5);

            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        }
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const SharePointViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const modules = [];

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;

            // Create a 2x2 grid of "modules"
            const pad = 20;
            const w = (canvas.width - pad * 3) / 2;
            const h = (canvas.height - pad * 3) / 2;

            modules.length = 0;
            // Ensure w and h are positive to avoid errors if container is huge or tiny
            if (w > 0 && h > 0) {
                modules.push({ x: pad, y: pad, w, h, type: 'graph', color: '#0078d4' }); // Blue for SharePoint
                modules.push({ x: w + pad * 2, y: pad, w, h, type: 'list', color: '#fff' });
                modules.push({ x: pad, y: h + pad * 2, w, h, type: 'text', color: '#fff' });
                modules.push({ x: w + pad * 2, y: h + pad * 2, w, h, type: 'pie', color: '#f3f2f1' });
            }
        };
        init();
        window.addEventListener('resize', init);

        let tick = 0;

        const render = () => {
            ctx.fillStyle = '#1f1f1f'; // Dark grey bg
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            tick++;

            modules.forEach((m) => {
                // Background for module
                ctx.fillStyle = '#2d2d2d';
                ctx.fillRect(m.x, m.y, m.w, m.h);

                // Header line
                ctx.fillStyle = m.color;
                ctx.fillRect(m.x, m.y, m.w, 4);

                ctx.save();
                ctx.translate(m.x, m.y);

                // Content simulation
                if (m.type === 'graph') {
                    // Animated bars
                    const barW = m.w / 5;
                    for (let j = 0; j < 4; j++) {
                        const h = (Math.sin(tick * 0.05 + j) * 0.5 + 0.5) * (m.h * 0.6);
                        ctx.fillStyle = '#0078d4';
                        ctx.fillRect(10 + j * (barW + 5), m.h - 10 - h, barW, h);
                    }
                } else if (m.type === 'list') {
                    // Scrolling lines
                    ctx.fillStyle = '#555';
                    for (let j = 0; j < 5; j++) {
                        const y = ((tick * 0.5) + j * 15) % (m.h - 20);
                        ctx.fillRect(10, 20 + y, m.w - 20, 8);
                    }
                } else if (m.type === 'pie') {
                    // Rotating pie
                    ctx.translate(m.w / 2, m.h / 2);
                    ctx.rotate(tick * 0.02);
                    ctx.beginPath();
                    ctx.arc(0, 0, m.h * 0.3, 0, Math.PI * 1.5);
                    ctx.strokeStyle = '#e3008c'; // Power Apps Color approx
                    ctx.lineWidth = 4;
                    ctx.stroke();
                } else {
                    // Pulsing "Power BI" text block abstract
                    ctx.fillStyle = `rgba(242, 200, 17, ${Math.sin(tick * 0.1) * 0.5 + 0.5})`; // Power BI Yellow
                    ctx.fillRect(m.w / 2 - 15, m.h / 2 - 15, 30, 30);
                }
                ctx.restore();
            });

            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        }
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const TitanicViz = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        // Animation State
        let shipX = -100;
        let shipY = 0;
        let rotation = 0;
        let state = 'sailing'; // sailing, impact, sinking, reset
        let sinkDelay = 0;
        let waveOffset = 0;
        const stars = Array.from({ length: 28 }, (_, i) => ({
            x: (i * 83) % 997 / 997,
            y: 0.08 + ((i * 37) % 180) / 1000,
            size: i % 5 === 0 ? 1.6 : 1,
            alpha: 0.22 + (i % 7) * 0.07
        }));
        const portholes = Array.from({ length: 16 }, (_, i) => ({
            x: 18 + (i % 8) * 11,
            y: i < 8 ? 8 : 18,
            warm: i % 3 !== 0
        }));

        const render = () => {
            const nightGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            nightGradient.addColorStop(0, '#02030a');
            nightGradient.addColorStop(0.45, '#06091a');
            nightGradient.addColorStop(1, '#071520');
            ctx.fillStyle = nightGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            waveOffset += 0.05;
            const waterLevel = canvas.height * 0.65;
            const pulse = Math.sin(waveOffset * 1.8) * 0.15 + 0.85;
            const moonX = canvas.width * 0.15;
            const moonY = canvas.height * 0.18;

            ctx.save();
            ctx.shadowBlur = 28;
            ctx.shadowColor = 'rgba(155, 195, 255, 0.35)';
            ctx.fillStyle = 'rgba(196, 220, 255, 0.75)';
            ctx.beginPath();
            ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            const moonGlow = ctx.createRadialGradient(moonX, moonY, 6, moonX, moonY, canvas.width * 0.55);
            moonGlow.addColorStop(0, 'rgba(120, 170, 255, 0.18)');
            moonGlow.addColorStop(0.45, 'rgba(40, 75, 140, 0.08)');
            moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = moonGlow;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                const twinkle = star.alpha + Math.sin(waveOffset * 2 + star.x * 20) * 0.08;
                ctx.fillStyle = `rgba(230, 245, 255, ${twinkle})`;
                ctx.fillRect(star.x * canvas.width, star.y * canvas.height, star.size, star.size);
            });

            // Massive Iceberg (Jagged & Ominous)
            const iceX = canvas.width * 0.75;
            ctx.save();
            ctx.shadowBlur = 28;
            ctx.shadowColor = 'rgba(126, 207, 255, 0.35)';
            const iceGradient = ctx.createLinearGradient(iceX - 70, waterLevel - 140, iceX + 110, waterLevel + 25);
            iceGradient.addColorStop(0, '#f4fbff');
            iceGradient.addColorStop(0.45, '#9fd6f0');
            iceGradient.addColorStop(1, '#315c78');
            ctx.fillStyle = iceGradient;
            ctx.beginPath();
            ctx.moveTo(iceX - 62, waterLevel + 18);
            ctx.lineTo(iceX - 40, waterLevel - 10);
            ctx.lineTo(iceX - 10, waterLevel - 96);
            ctx.lineTo(iceX + 5, waterLevel - 135);
            ctx.lineTo(iceX + 20, waterLevel - 80);
            ctx.lineTo(iceX + 50, waterLevel - 130);
            ctx.lineTo(iceX + 112, waterLevel + 18);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(iceX - 8, waterLevel - 92);
            ctx.lineTo(iceX + 14, waterLevel - 12);
            ctx.lineTo(iceX + 42, waterLevel - 118);
            ctx.moveTo(iceX + 62, waterLevel - 72);
            ctx.lineTo(iceX + 90, waterLevel + 10);
            ctx.stroke();

            const coldMist = ctx.createLinearGradient(iceX - 80, waterLevel - 20, iceX + 130, waterLevel + 25);
            coldMist.addColorStop(0, 'rgba(95, 175, 220, 0)');
            coldMist.addColorStop(0.5, 'rgba(160, 220, 255, 0.2)');
            coldMist.addColorStop(1, 'rgba(95, 175, 220, 0)');
            ctx.fillStyle = coldMist;
            ctx.fillRect(iceX - 90, waterLevel - 18, 230, 42);

            // Ship Logic
            if (state === 'sailing') {
                shipX += 1.0;
                // Bobbing calculation: Match wave frequency
                // shipY calculation: waterLevel - hullHeight + submergedDepth + waveBobbing
                // Hull height is approx 30. We want it submerged by ~10px.
                // So baseline Y = waterLevel - 30 + 10 = waterLevel - 20.
                // Add Wave motion: sin(shipX * freq + offset) * amplitude
                shipY = waterLevel - 20 + Math.sin(shipX * 0.02 + waveOffset) * 5;

                if (shipX + 130 >= iceX) {
                    state = 'impact';
                }
            } else if (state === 'impact') {
                sinkDelay++;
                // Still bob at impact
                shipY = waterLevel - 20 + Math.sin(shipX * 0.02 + waveOffset) * 5;
                if (sinkDelay > 40) state = 'sinking';
            } else if (state === 'sinking') {
                shipX += 0.1;
                shipY += 0.5;
                rotation += 0.008;

                if (shipY > canvas.height + 100) {
                    state = 'reset';
                }
            } else if (state === 'reset') {
                shipX = -130;
                rotation = 0;
                sinkDelay = 0;
                state = 'sailing';
            }

            // Draw Premium Ship
            ctx.save();
            ctx.translate(shipX, shipY);
            ctx.rotate(rotation);

            const lampGlow = ctx.createRadialGradient(72, -9, 4, 72, -9, 92);
            lampGlow.addColorStop(0, `rgba(255, 207, 99, ${0.28 * pulse})`);
            lampGlow.addColorStop(0.48, `rgba(255, 156, 55, ${0.08 * pulse})`);
            lampGlow.addColorStop(1, 'rgba(255, 156, 55, 0)');
            ctx.fillStyle = lampGlow;
            ctx.fillRect(-25, -72, 180, 120);

            const headlight = ctx.createLinearGradient(95, -12, 180, -36);
            headlight.addColorStop(0, `rgba(255, 224, 142, ${0.28 * pulse})`);
            headlight.addColorStop(1, 'rgba(255, 224, 142, 0)');
            ctx.fillStyle = headlight;
            ctx.beginPath();
            ctx.moveTo(92, -9);
            ctx.lineTo(180, -48);
            ctx.lineTo(180, 3);
            ctx.closePath();
            ctx.fill();

            // Hull (Black & Red)
            ctx.shadowBlur = 14;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.fillStyle = '#111217';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(120, 0); // Decent length
            ctx.lineTo(110, 30);
            ctx.lineTo(10, 30);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Red bottom trim
            ctx.fillStyle = '#631111';
            ctx.fillRect(10, 25, 100, 5);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
            ctx.fillRect(5, 2, 108, 2);

            // Superstructure (White decks)
            ctx.fillStyle = '#dce6ed';
            ctx.fillRect(15, -15, 80, 15); // Main deck
            ctx.fillStyle = '#eef5f9';
            ctx.fillRect(25, -25, 60, 10);
            ctx.fillStyle = 'rgba(13, 30, 47, 0.35)';
            ctx.fillRect(16, -3, 78, 3);

            // Funnels (Iconic Yellow/Black)
            const drawFunnel = (x) => {
                const funnelGradient = ctx.createLinearGradient(x, -50, x + 10, -25);
                funnelGradient.addColorStop(0, '#f4d46c');
                funnelGradient.addColorStop(1, '#9c5f12');
                ctx.fillStyle = funnelGradient;
                ctx.beginPath();
                ctx.moveTo(x, -25);
                ctx.lineTo(x + 10, -25);
                ctx.lineTo(x + 10, -50);
                ctx.lineTo(x, -50);
                ctx.fill();

                // Top black band
                ctx.fillStyle = '#000';
                ctx.fillRect(x, -50, 10, 5);
            };
            drawFunnel(30);
            drawFunnel(50);
            drawFunnel(70);

            // Lights (Portholes) - Luxury feel
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 214, 117, 0.9)';
            portholes.forEach((light) => {
                ctx.fillStyle = light.warm ? '#ffd873' : 'rgba(255, 244, 196, 0.45)';
                ctx.fillRect(light.x, light.y, 3, 2);
            });
            ctx.shadowBlur = 0;

            ctx.restore();

            // Draw Ocean Waves
            const waterGradient = ctx.createLinearGradient(0, waterLevel, 0, canvas.height);
            waterGradient.addColorStop(0, 'rgba(18, 80, 126, 0.72)');
            waterGradient.addColorStop(0.45, 'rgba(8, 42, 82, 0.88)');
            waterGradient.addColorStop(1, 'rgba(2, 12, 28, 0.98)');
            ctx.fillStyle = waterGradient;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(0, waterLevel);

            for (let i = 0; i <= canvas.width; i += 10) {
                ctx.lineTo(i, waterLevel + Math.sin(i * 0.02 + waveOffset) * 5);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

            const submergedIce = ctx.createLinearGradient(iceX - 76, waterLevel + 8, iceX + 124, canvas.height);
            submergedIce.addColorStop(0, 'rgba(184, 238, 255, 0.36)');
            submergedIce.addColorStop(0.5, 'rgba(65, 142, 184, 0.18)');
            submergedIce.addColorStop(1, 'rgba(16, 45, 78, 0.42)');
            ctx.fillStyle = submergedIce;
            ctx.beginPath();
            ctx.moveTo(iceX - 62, waterLevel + 5);
            ctx.lineTo(iceX + 112, waterLevel + 5);
            ctx.lineTo(iceX + 88, canvas.height);
            ctx.lineTo(iceX + 24, canvas.height);
            ctx.lineTo(iceX - 74, canvas.height);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(205, 242, 255, 0.16)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(iceX - 34, waterLevel + 24);
            ctx.lineTo(iceX - 18, canvas.height);
            ctx.moveTo(iceX + 22, waterLevel + 10);
            ctx.lineTo(iceX + 54, canvas.height);
            ctx.moveTo(iceX + 78, waterLevel + 24);
            ctx.lineTo(iceX + 90, canvas.height);
            ctx.stroke();

            const moonPath = ctx.createLinearGradient(moonX - 20, waterLevel, moonX + 55, canvas.height);
            moonPath.addColorStop(0, 'rgba(155, 195, 255, 0.16)');
            moonPath.addColorStop(1, 'rgba(155, 195, 255, 0)');
            ctx.fillStyle = moonPath;
            ctx.beginPath();
            ctx.moveTo(moonX - 22, waterLevel);
            ctx.lineTo(moonX + 38, waterLevel);
            ctx.lineTo(moonX + 90, canvas.height);
            ctx.lineTo(moonX - 70, canvas.height);
            ctx.closePath();
            ctx.fill();

            // Foreground Wave Layer (Parallax)
            ctx.fillStyle = 'rgba(4, 30, 74, 0.86)';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            const frontWaterLevel = waterLevel + 15;
            ctx.lineTo(0, frontWaterLevel);
            for (let i = 0; i <= canvas.width; i += 15) {
                ctx.lineTo(i, frontWaterLevel + Math.sin(i * 0.03 + waveOffset * 1.5) * 8);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

            ctx.strokeStyle = 'rgba(135, 204, 255, 0.28)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i <= canvas.width; i += 28) {
                const y = frontWaterLevel + Math.sin(i * 0.03 + waveOffset * 1.5) * 8;
                ctx.moveTo(i, y);
                ctx.lineTo(i + 14, y + Math.sin(waveOffset + i) * 2);
            }
            ctx.stroke();

            const vignette = ctx.createRadialGradient(
                canvas.width * 0.5,
                canvas.height * 0.45,
                canvas.width * 0.2,
                canvas.width * 0.5,
                canvas.height * 0.5,
                canvas.width * 0.72
            );
            vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignette.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationId); };
    }, []);
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const MovieViz = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let price = 50;
        let trend = 0.5;

        const render = () => {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ticket Stub
            ctx.fillStyle = '#f4c430';
            ctx.beginPath();
            ctx.roundRect(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.6, canvas.height * 0.4, 10);
            ctx.fill();

            // Price
            price += trend;
            if (price > 120 || price < 50) trend *= -1;

            ctx.fillStyle = '#000';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`$${Math.floor(price)}`, canvas.width / 2, canvas.height / 2 + 10);
            ctx.font = '12px Arial';
            ctx.fillText("ADMIT ONE", canvas.width / 2, canvas.height / 2 - 20);

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationId); };
    }, []);
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const MusicViz = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        const bars = 16;
        let tick = 0;

        const render = () => {
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            tick += 0.05; // Much slower tick for smooth wave

            const barW = canvas.width / bars;
            for (let i = 0; i < bars; i++) {
                // Use Sine wave for smooth, slower movement instead of random
                // Combine two sine waves for variety
                const n = Math.sin(tick + i * 0.5) * 0.5 + 0.5;
                const n2 = Math.sin(tick * 0.5 + i * 0.2) * 0.5 + 0.5;

                const h = (n * 0.7 + n2 * 0.3) * (canvas.height * 0.7) + 10;

                ctx.fillStyle = `hsl(${i * 20 + tick * 20}, 70%, 50%)`; // Rotate color slowly
                ctx.fillRect(i * barW, canvas.height - h, barW - 2, h);
            }

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationId); };
    }, []);
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const DiabetesViz = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let startTime = null;

    // Particle pools
    let candies = [];
    let sugarSparkles = [];
    let glucoseHistory = [];
    let lastSample = 0;

    const LOOP = 8200;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const eio = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const init = () => {
      canvas.width = canvas.parentElement?.clientWidth || 620;
      canvas.height = canvas.parentElement?.clientHeight || 390;
    };
    init();
    window.addEventListener("resize", init);

    const render = (ts) => {
      if (!startTime) startTime = ts;
      const timeS = ((ts - startTime) % LOOP) / LOOP * 8.2;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── TIMELINE ──────────────────────────────────────────────────────────
      const eatF = clamp(timeS / 5.5, 0, 1);
      const bellyGrow = eatF * 24;
      const blush = eatF;
      const eyeDroop = eatF > 0.72 ? (eatF - 0.72) / 0.28 : 0;
      const sweating = eatF > 0.54;
      const armPhase = timeS < 5.5 ? Math.sin(timeS * Math.PI * 2.15) : -1;
      const armUp = armPhase > 0.18;
      const isOut = timeS >= 5.5;
      const glucose = isOut ? 468 : 88 + eatF * 382;
      let fallAngle = 0;
      if (isOut) {
        const ft = clamp((timeS - 5.5) / 2.3, 0, 1);
        if (ft < 0.42) fallAngle = eio(ft / 0.42) * (Math.PI / 4);
        else if (ft < 0.62) fallAngle = Math.PI / 4 - Math.sin(((ft - 0.42) / 0.2) * Math.PI) * 0.11;
        else fallAngle = Math.PI / 4 + Math.sin(ft * 9) * 0.005;
      }
      if (ts - lastSample > 95) {
        glucoseHistory.push(glucose);
        if (glucoseHistory.length > 58) glucoseHistory.shift();
        lastSample = ts;
      }
      const tvFlk = 0.93 + Math.sin(ts * 0.071) * 0.04 + (Math.random() > 0.982 ? 0.13 : 0);
      const floorY = H * 0.73;

      // ── CEILING ────────────────────────────────────────────────────────────
      ctx.fillStyle = "#d6d2de"; ctx.fillRect(0, 0, W, H * 0.1);
      ctx.fillStyle = "#e8e4f0"; ctx.fillRect(0, H * 0.1 - 4, W, 7);
      ctx.fillStyle = "#b4b0c2"; ctx.fillRect(0, H * 0.1 + 3, W, 2);
      // Ceiling light fixture
      const lfX = W * 0.5;
      ctx.fillStyle = "#c8c4d0"; ctx.beginPath(); ctx.arc(lfX, H * 0.06, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f8f8e8"; ctx.beginPath(); ctx.arc(lfX, H * 0.06, 12, 0, Math.PI * 2); ctx.fill();
      const ceilGlow = ctx.createRadialGradient(lfX, H * 0.06, 5, lfX, H * 0.06, W * 0.3);
      ceilGlow.addColorStop(0, "rgba(255,245,200,0.22)"); ceilGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ceilGlow; ctx.fillRect(0, 0, W, H * 0.35);

      // ── WALL ───────────────────────────────────────────────────────────────
      const wallG = ctx.createLinearGradient(0, H * 0.1, 0, floorY);
      wallG.addColorStop(0, "#ccc8d8"); wallG.addColorStop(1, "#908898");
      ctx.fillStyle = wallG; ctx.fillRect(0, H * 0.1, W, floorY - H * 0.1);
      // Subtle wall texture — faint horizontal brush strokes
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let wy = H * 0.12; wy < floorY; wy += 8) {
        ctx.beginPath(); ctx.moveTo(0, wy + Math.sin(wy * 0.3) * 1.5); ctx.lineTo(W, wy + Math.cos(wy * 0.2) * 1.5); ctx.stroke();
      }
      // Baseboard
      ctx.fillStyle = "#e8e4f0"; ctx.fillRect(0, floorY - 9, W, 9);
      ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(0, floorY - 9, W, 1.5);

      // ── FLOOR ──────────────────────────────────────────────────────────────
      const flG = ctx.createLinearGradient(0, floorY, 0, H);
      flG.addColorStop(0, "#7c5c3a"); flG.addColorStop(0.5, "#5e3e24"); flG.addColorStop(1, "#3c2216");
      ctx.fillStyle = flG; ctx.fillRect(0, floorY, W, H - floorY);
      ctx.save(); ctx.beginPath(); ctx.rect(0, floorY, W, H - floorY); ctx.clip();
      // Plank row lines
      ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1.1;
      for (let r = 0; r < 9; r++) {
        const py = floorY + r * 13 + 4;
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py + 5); ctx.stroke();
      }
      // Plank end-joints
      ctx.strokeStyle = "rgba(0,0,0,0.09)"; ctx.lineWidth = 0.6;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 5; c++) {
          const px = (c * W / 3.8 + r * W / 8.5) % W;
          const py = floorY + r * 13;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 1.5, py + 13); ctx.stroke();
        }
      }
      // Plank highlight (sheen)
      ctx.strokeStyle = "rgba(255,220,160,0.07)"; ctx.lineWidth = 2;
      for (let r = 0; r < 9; r++) {
        const py = floorY + r * 13 + 1.5;
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py + 5); ctx.stroke();
      }
      // TV glow on floor
      const ftvG = ctx.createRadialGradient(W * 0.77, floorY + 3, 6, W * 0.77, floorY + 45, W * 0.36);
      ftvG.addColorStop(0, `rgba(80,165,255,${0.17 * tvFlk})`); ftvG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ftvG; ctx.fillRect(0, floorY, W, H - floorY);
      // Lamp warm pool on floor
      const flampG = ctx.createRadialGradient(W * 0.54, floorY + 5, 4, W * 0.54, floorY + 50, W * 0.22);
      flampG.addColorStop(0, "rgba(255,210,110,0.18)"); flampG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = flampG; ctx.fillRect(0, floorY, W, H - floorY);
      ctx.restore();

      // ── WINDOW ─────────────────────────────────────────────────────────────
      const wX = W * 0.06, wY = H * 0.15, wW = W * 0.19, wH = H * 0.32;
      // Light beam
      ctx.save();
      const bmG = ctx.createLinearGradient(wX + wW * 0.5, wY + wH, wX + wW + W * 0.1, floorY);
      bmG.addColorStop(0, "rgba(255,248,188,0.17)"); bmG.addColorStop(1, "rgba(255,248,188,0)");
      ctx.fillStyle = bmG;
      ctx.beginPath(); ctx.moveTo(wX, wY + wH); ctx.lineTo(wX + wW, wY + wH);
      ctx.lineTo(wX + wW + W * 0.24, floorY); ctx.lineTo(wX - W * 0.04, floorY); ctx.fill();
      ctx.restore();
      // Frame
      ctx.fillStyle = "#f0ece2"; ctx.fillRect(wX - 7, wY - 7, wW + 14, wH + 14);
      ctx.fillStyle = "#ddd8cc"; ctx.fillRect(wX - 3, wY - 3, wW + 6, wH + 6);
      // Sky
      const skyG = ctx.createLinearGradient(wX, wY, wX, wY + wH);
      skyG.addColorStop(0, "#3a8ec0"); skyG.addColorStop(1, "#8ed0ec");
      ctx.fillStyle = skyG; ctx.fillRect(wX, wY, wW, wH);
      ctx.save(); ctx.beginPath(); ctx.rect(wX, wY, wW, wH); ctx.clip();
      // Clouds
      const cl = (ts * 0.012) % (wW + 70) - 35;
      const drawCloud = (cx2, cy2, s) => {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(cx2, cy2, s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + s * 0.88, cy2 - s * 0.3, s * 0.72, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + s * 1.72, cy2 + s * 0.08, s * 0.58, 0, Math.PI * 2); ctx.fill();
      };
      drawCloud(wX + cl, wY + wH * 0.2, 9); drawCloud(wX + cl + wW * 0.6, wY + wH * 0.12, 6);
      // City silhouette
      const bldgs = [[0, 0.52, 0.2, 0.48], [0.22, 0.44, 0.15, 0.56], [0.38, 0.62, 0.11, 0.38], [0.52, 0.38, 0.22, 0.62], [0.76, 0.5, 0.24, 0.5]];
      ctx.fillStyle = "rgba(45,60,85,0.42)";
      bldgs.forEach(([bx, by, bw, bh]) => ctx.fillRect(wX + bx * wW, wY + by * wH, bw * wW, bh * wH));
      ctx.fillStyle = "rgba(255,240,150,0.55)";
      bldgs.forEach(([bx, by, bw]) => {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
          if ((r + c + Math.floor(bx * 10)) % 3 !== 0)
            ctx.fillRect(wX + bx * wW + c * bw * wW * 0.36 + 2, wY + by * wH + r * 8 + 3, bw * wW * 0.2, 4);
        }
      });
      ctx.restore();
      // Partial blinds
      ctx.strokeStyle = "rgba(195,185,155,0.5)"; ctx.lineWidth = 1;
      for (let b = 0; b < 7; b++) {
        const by = wY + (b / 7) * wH * 0.4;
        ctx.beginPath(); ctx.moveTo(wX, by); ctx.lineTo(wX + wW, by + 2); ctx.stroke();
      }
      // Panes
      ctx.fillStyle = "#f0ece0";
      ctx.fillRect(wX + wW / 2 - 2.5, wY, 5, wH);
      ctx.fillRect(wX, wY + wH / 2 - 2.5, wW, 5);
      // Sill
      ctx.fillStyle = "#e2dcd0"; ctx.fillRect(wX - 10, wY + wH, wW + 20, 10);
      // Plant on sill
      ctx.fillStyle = "#8a5a2a"; ctx.fillRect(wX + wW * 0.55, wY + wH - 12, 18, 14);
      ctx.fillStyle = "#2a7a30";
      for (let l = 0; l < 4; l++) {
        ctx.beginPath(); ctx.ellipse(wX + wW * 0.64 + Math.sin(l * 1.3) * 8, wY + wH - 14 - l * 5, 7, 4, Math.sin(l * 0.8) * 0.8, 0, Math.PI * 2); ctx.fill();
      }
      // Curtains
      const doCurtain = (cx2, flip) => {
        ctx.fillStyle = "#780018";
        ctx.beginPath(); ctx.moveTo(cx2, wY - 10);
        ctx.bezierCurveTo(cx2 + (flip ? 30 : -30), wY + wH * 0.3, cx2 + (flip ? -6 : 6), wY + wH * 0.5, cx2 + (flip ? -3 : 3), wY + wH + 20);
        ctx.lineTo(cx2 + (flip ? -22 : 22), wY + wH + 20); ctx.lineTo(cx2 + (flip ? -22 : 22), wY - 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,70,70,0.1)";
        ctx.beginPath(); ctx.moveTo(cx2 + (flip ? 7 : -7), wY - 10);
        ctx.bezierCurveTo(cx2 + (flip ? 19 : -19), wY + wH * 0.26, cx2 + (flip ? -1 : 1), wY + wH * 0.5, cx2 + (flip ? -2 : 2), wY + wH);
        ctx.lineTo(cx2 + (flip ? -7 : 7), wY + wH); ctx.closePath(); ctx.fill();
      };
      doCurtain(wX - 7, false); doCurtain(wX + wW + 7, true);
      // Rod + finials
      ctx.fillStyle = "#c8a028"; ctx.beginPath(); ctx.roundRect(wX - 28, wY - 15, wW + 56, 5, 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wX - 28, wY - 12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wX + wW + 28, wY - 12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e8c040";
      ctx.beginPath(); ctx.arc(wX - 28, wY - 12, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wX + wW + 28, wY - 12, 4, 0, Math.PI * 2); ctx.fill();

      // ── WALL ART & DECOR ───────────────────────────────────────────────────
      // Framed painting
      const pfX = W * 0.34, pfY = H * 0.13, pfW = W * 0.1, pfH = H * 0.15;
      ctx.fillStyle = "#3a2006"; ctx.fillRect(pfX - 5, pfY - 5, pfW + 10, pfH + 10);
      ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(pfX - 3, pfY - 3, pfW + 6, pfH + 6);
      ctx.fillStyle = "#c4d8ec"; ctx.fillRect(pfX, pfY, pfW, pfH);
      ctx.save(); ctx.beginPath(); ctx.rect(pfX, pfY, pfW, pfH); ctx.clip();
      // Abstract shapes inside frame
      const pg = ctx.createLinearGradient(pfX, pfY, pfX + pfW, pfY + pfH);
      pg.addColorStop(0, "#c0d8ec"); pg.addColorStop(1, "#90b0cc");
      ctx.fillStyle = pg; ctx.fillRect(pfX, pfY, pfW, pfH);
      ctx.fillStyle = "rgba(175,55,48,0.68)";
      ctx.beginPath(); ctx.ellipse(pfX + pfW * 0.38, pfY + pfH * 0.52, pfW * 0.24, pfH * 0.38, 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(230,195,28,0.6)";
      ctx.beginPath(); ctx.ellipse(pfX + pfW * 0.68, pfY + pfH * 0.3, pfW * 0.16, pfH * 0.22, -0.42, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(50,120,180,0.4)";
      ctx.beginPath(); ctx.ellipse(pfX + pfW * 0.22, pfY + pfH * 0.7, pfW * 0.12, pfH * 0.18, 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1;
      ctx.strokeRect(pfX + 3, pfY + 3, pfW - 6, pfH - 6);

      // Shelf
      const shX = W * 0.34, shY = H * 0.32;
      ctx.fillStyle = "#6a4020"; ctx.fillRect(shX - 4, shY, W * 0.12 + 8, 7);
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(shX - 4, shY + 7, W * 0.12 + 8, 2);
      // Books on shelf
      const bookColors = ["#8b2a2a","#2a5a8b","#2a7a3a","#8b7a2a","#6a2a8b"];
      bookColors.forEach((col, bi) => {
        const bx = shX + bi * (W * 0.022);
        ctx.fillStyle = col; ctx.fillRect(bx, shY - H * 0.065, W * 0.018, H * 0.065);
        ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(bx, shY - H * 0.065, 2, H * 0.065);
      });

      // ── FLOOR LAMP ──────────────────────────────────────────────────────────
      const lX = W * 0.55, lBase = floorY;
      ctx.fillStyle = "#2c1a0c"; ctx.fillRect(lX - 3, lBase - H * 0.31, 6, H * 0.31);
      ctx.fillRect(lX - 14, lBase - 5, 28, 7); ctx.fillRect(lX - 22, lBase - 2, 44, 5);
      // Shade
      ctx.fillStyle = "#f5e4c0";
      ctx.beginPath(); ctx.moveTo(lX - 25, lBase - H * 0.31 - 2); ctx.lineTo(lX + 25, lBase - H * 0.31 - 2);
      ctx.lineTo(lX + 16, lBase - H * 0.22); ctx.lineTo(lX - 16, lBase - H * 0.22); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#c8a055"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(lX - 25, lBase - H * 0.31 - 2); ctx.lineTo(lX - 16, lBase - H * 0.22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lX + 25, lBase - H * 0.31 - 2); ctx.lineTo(lX + 16, lBase - H * 0.22); ctx.stroke();
      ctx.fillStyle = "rgba(255,230,150,0.75)"; ctx.beginPath(); ctx.arc(lX, lBase - H * 0.29, 5, 0, Math.PI * 2); ctx.fill();
      // Lamp glow
      const lmpGlow = ctx.createRadialGradient(lX, lBase - H * 0.27, 4, lX, lBase - H * 0.22, W * 0.33);
      lmpGlow.addColorStop(0, "rgba(255,218,120,0.32)"); lmpGlow.addColorStop(0.38, "rgba(255,200,95,0.1)"); lmpGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = lmpGlow; ctx.fillRect(0, 0, W, H);

      // ── SIDE TABLE ──────────────────────────────────────────────────────────
      const stX = W * 0.55, stY = floorY - H * 0.145, stW = W * 0.09;
      ctx.fillStyle = "#5a3215"; ctx.fillRect(stX, stY, stW, H * 0.145);
      ctx.fillStyle = "#7a4822"; ctx.fillRect(stX - 5, stY, stW + 10, H * 0.013);
      // Soda can
      const cX2 = stX + stW * 0.22, cY2 = stY - H * 0.068, cW2 = stW * 0.28, cH2 = H * 0.068;
      const canBodyG = ctx.createLinearGradient(cX2, cY2, cX2 + cW2, cY2);
      canBodyG.addColorStop(0, "#c8101e"); canBodyG.addColorStop(0.4, "#e81022"); canBodyG.addColorStop(1, "#9a0c18");
      ctx.fillStyle = canBodyG; ctx.beginPath(); ctx.roundRect(cX2, cY2, cW2, cH2, 2); ctx.fill();
      ctx.fillStyle = "#c0c4c8";
      ctx.beginPath(); ctx.ellipse(cX2 + cW2 / 2, cY2, cW2 / 2, cH2 * 0.13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cX2 + cW2 / 2, cY2 + cH2, cW2 / 2, cH2 * 0.13, 0, 0, Math.PI * 2); ctx.fill();
      // Can tab
      ctx.fillStyle = "#a8aaac"; ctx.fillRect(cX2 + cW2 * 0.35, cY2 - 3, cW2 * 0.3, 4);
      // Label
      ctx.fillStyle = "#fff"; ctx.font = `bold ${H * 0.018}px Arial`; ctx.textAlign = "center";
      ctx.fillText("COLA", cX2 + cW2 / 2, cY2 + cH2 * 0.56);
      // Condensation
      ctx.fillStyle = "rgba(190,220,255,0.45)";
      for (let d = 0; d < 6; d++) ctx.beginPath(), ctx.arc(cX2 + 2 + d * (cW2 / 5.5), cY2 + cH2 * 0.28 + Math.sin(d * 1.2) * cH2 * 0.16, 1, 0, Math.PI * 2), ctx.fill();
      // Can shine
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath(); ctx.moveTo(cX2 + cW2 * 0.12, cY2 + cH2 * 0.06); ctx.lineTo(cX2 + cW2 * 0.26, cY2 + cH2 * 0.06);
      ctx.lineTo(cX2 + cW2 * 0.22, cY2 + cH2 * 0.9); ctx.lineTo(cX2 + cW2 * 0.08, cY2 + cH2 * 0.9); ctx.closePath(); ctx.fill();
      ctx.textAlign = "left";

      // ── TV ─────────────────────────────────────────────────────────────────
      const tvX = W * 0.63, tvY2 = H * 0.1, tvW = W * 0.3, tvH = H * 0.38;
      // TV glow ambient
      const tvGlwG = ctx.createRadialGradient(tvX + tvW / 2, tvY2 + tvH / 2, 8, tvX + tvW / 2, tvY2 + tvH / 2, W * 0.46);
      tvGlwG.addColorStop(0, `rgba(86,178,255,${0.26 * tvFlk})`); tvGlwG.addColorStop(1, "rgba(86,178,255,0)");
      ctx.fillStyle = tvGlwG; ctx.fillRect(0, 0, W, H);
      // Body shadow
      ctx.save(); ctx.filter = "blur(12px)";
      ctx.fillStyle = "rgba(0,0,0,0.42)"; ctx.fillRect(tvX + 9, tvY2 + 9, tvW, tvH + 18);
      ctx.filter = "none"; ctx.restore();
      // Body
      const tvBG = ctx.createLinearGradient(tvX, tvY2, tvX + tvW, tvY2 + tvH);
      tvBG.addColorStop(0, "#2c2c38"); tvBG.addColorStop(0.5, "#0c0c14"); tvBG.addColorStop(1, "#2a2a36");
      ctx.fillStyle = tvBG; ctx.beginPath(); ctx.roundRect(tvX, tvY2, tvW, tvH, 10); ctx.fill();
      // Bezel rim
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(tvX + 1, tvY2 + 1, tvW - 2, tvH - 2, 9); ctx.stroke();
      // Screen content
      ctx.save(); ctx.beginPath(); ctx.roundRect(tvX + 8, tvY2 + 8, tvW - 16, tvH - 18, 5); ctx.clip();
      const scrG = ctx.createLinearGradient(tvX, tvY2, tvX, tvY2 + tvH);
      scrG.addColorStop(0, "#7ac8f5"); scrG.addColorStop(0.55, "#b0e4ff"); scrG.addColorStop(1, "#488e44");
      ctx.fillStyle = scrG; ctx.fillRect(tvX, tvY2, tvW, tvH);
      // Sun with rays
      const sX = tvX + tvW * 0.15, sY = tvY2 + tvH * 0.2;
      const sunG = ctx.createRadialGradient(sX, sY, 2, sX, sY, tvH * 0.16);
      sunG.addColorStop(0, "#ffe880"); sunG.addColorStop(0.55, "#ffcc28"); sunG.addColorStop(1, "rgba(255,180,0,0)");
      ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(sX, sY, tvH * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffe050"; ctx.beginPath(); ctx.arc(sX, sY, tvH * 0.09, 0, Math.PI * 2); ctx.fill();
      // Rolling hills (2 layers)
      const hs = (ts * 0.013) % tvW;
      [["#58b84a", 0], ["#3c9830", 1]].forEach(([col, lay]) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tvX - hs, tvY2 + tvH);
        for (let px = -tvW; px < tvW * 2; px += 7)
          ctx.lineTo(tvX + px - hs, tvY2 + tvH * 0.58 + Math.sin((px + lay * 28) * 0.04) * tvH * 0.11 + lay * tvH * 0.07);
        ctx.lineTo(tvX + tvW * 2, tvY2 + tvH); ctx.closePath(); ctx.fill();
      });
      // Trees scrolling
      const tScr = (ts * 0.096) % (tvW * 2.2);
      for (let ti = 0; ti < 9; ti++) {
        const tx = tvX + (ti * tvW / 3.1) - tScr % (tvW * 2.2);
        if (tx > tvX - 22 && tx < tvX + tvW + 22) {
          const sw = Math.sin(ts * 0.005 + ti * 1.35) * 2.4;
          ctx.fillStyle = "#5c3c22"; ctx.fillRect(tx + 3, tvY2 + tvH * 0.44, 4, tvH * 0.18);
          ctx.fillStyle = ti % 2 === 0 ? "#175e28" : "#1e7830";
          ctx.beginPath(); ctx.ellipse(tx + 5 + sw, tvY2 + tvH * 0.36, tvW * 0.058, tvH * 0.15, 0.07 * sw, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(98,195,78,0.32)";
          ctx.beginPath(); ctx.arc(tx + 1 + sw, tvY2 + tvH * 0.3, tvW * 0.028, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Horse
      const gp = ts * 0.027;
      const hbX = tvX + tvW * 0.52, hbY = tvY2 + tvH * 0.65 + Math.sin(gp) * 2.4;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.beginPath(); ctx.ellipse(hbX + 8, hbY + 18, 21, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      // Body
      const hBG = ctx.createLinearGradient(hbX - 14, hbY - 9, hbX + 24, hbY + 10);
      hBG.addColorStop(0, "#8e6040"); hBG.addColorStop(1, "#4c2a14");
      ctx.fillStyle = hBG; ctx.beginPath(); ctx.ellipse(hbX + 8, hbY, 19, 9.5, -0.05, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.fillStyle = "#7c5030";
      ctx.beginPath(); ctx.moveTo(hbX + 20, hbY - 2); ctx.quadraticCurveTo(hbX + 23, hbY - 13, hbX + 31, hbY - 16);
      ctx.quadraticCurveTo(hbX + 37, hbY - 13, hbX + 36, hbY - 6); ctx.quadraticCurveTo(hbX + 32, hbY - 2, hbX + 27, hbY - 2);
      ctx.quadraticCurveTo(hbX + 24, hbY + 4, hbX + 20, hbY + 6); ctx.fill();
      // Nostril
      ctx.fillStyle = "#1a0808"; ctx.beginPath(); ctx.ellipse(hbX + 35, hbY - 6, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();
      // Eye
      ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.arc(hbX + 33, hbY - 11, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hbX + 34, hbY - 12, 0.8, 0, Math.PI * 2); ctx.fill();
      // Mane
      ctx.fillStyle = "#1e0808";
      ctx.beginPath(); ctx.moveTo(hbX + 24, hbY - 13); ctx.quadraticCurveTo(hbX + 18, hbY - 9, hbX + 18, hbY);
      ctx.quadraticCurveTo(hbX + 21, hbY - 3, hbX + 24, hbY - 13); ctx.fill();
      ctx.beginPath(); ctx.moveTo(hbX + 32, hbY - 17); ctx.lineTo(hbX + 34, hbY - 23); ctx.lineTo(hbX + 37, hbY - 16); ctx.lineTo(hbX + 39, hbY - 21); ctx.lineTo(hbX + 40, hbY - 11); ctx.fill();
      // Tail
      ctx.strokeStyle = "#1e0808"; ctx.lineWidth = 3.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(hbX - 8, hbY - 1); ctx.quadraticCurveTo(hbX - 25, hbY - 14, hbX - 27, hbY + 2 + Math.sin(gp) * 4.5); ctx.stroke();
      // Legs
      const dLeg = (ox, ph, col, lw) => {
        const u = Math.sin(gp + ph) * 8.5, lo = Math.cos(gp + ph) * 6.5;
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hbX + ox, hbY + 7.5); ctx.lineTo(hbX + ox + u * 0.42, hbY + 14); ctx.lineTo(hbX + ox + u + lo, hbY + 21); ctx.stroke();
      };
      dLeg(-3, 0, "#3c1c12", 2.4); dLeg(15, 1.28, "#3c1c12", 2.4);
      dLeg(-1, Math.PI, "#7c4a32", 2.9); dLeg(17, Math.PI + 1.28, "#7c4a32", 2.9);
      // Scanlines CRT
      ctx.fillStyle = "rgba(0,0,0,0.09)";
      for (let sl = tvY2 + 8; sl < tvY2 + tvH - 10; sl += 3.2) ctx.fillRect(tvX + 8, sl, tvW - 16, 1.4);
      // Screen glare
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath(); ctx.moveTo(tvX + 8, tvY2 + 8); ctx.lineTo(tvX + tvW - 8, tvY2 + 8);
      ctx.lineTo(tvX + tvW * 0.38, tvY2 + tvH * 0.54); ctx.lineTo(tvX + 8, tvY2 + tvH * 0.4); ctx.closePath(); ctx.fill();
      // Channel info bar
      ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(tvX + 8, tvY2 + tvH - 26, tvW - 16, 18);
      ctx.fillStyle = "#7fd87f"; ctx.font = `${H * 0.017}px monospace`; ctx.textAlign = "left";
      ctx.fillText("▶  NATURE WILD  HD", tvX + 15, tvY2 + tvH - 13);
      ctx.fillStyle = "#aaa"; ctx.textAlign = "right"; ctx.fillText("22:14", tvX + tvW - 14, tvY2 + tvH - 13);
      ctx.textAlign = "left"; ctx.restore();
      // Power LED
      const ledOn = !isOut || timeS < 7.85;
      ctx.fillStyle = ledOn ? "#00ff66" : "#2a2a2a";
      ctx.beginPath(); ctx.arc(tvX + tvW - 11, tvY2 + tvH - 10, 3, 0, Math.PI * 2); ctx.fill();
      if (ledOn) { ctx.fillStyle = "rgba(0,255,100,0.28)"; ctx.beginPath(); ctx.arc(tvX + tvW - 11, tvY2 + tvH - 10, 7, 0, Math.PI * 2); ctx.fill(); }
      // Wall mount bracket
      ctx.fillStyle = "#1a1a1e";
      ctx.fillRect(tvX + tvW / 2 - 5, tvY2 + tvH, 10, H * 0.06);
      ctx.fillRect(tvX + tvW / 2 - 18, tvY2 + tvH + H * 0.055, 36, 6);

      // ── COUCH ──────────────────────────────────────────────────────────────
      const couchX = W * 0.04, couchY = floorY - H * 0.24;
      const couchW = W * 0.44, couchH = H * 0.24;
      // Shadow
      ctx.save(); ctx.filter = "blur(11px)";
      ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.fillRect(couchX + 4, couchY + couchH - 4, couchW, 16);
      ctx.filter = "none"; ctx.restore();
      // Back cushions
      for (let ci = 0; ci < 3; ci++) {
        const csW = couchW / 3, csX = couchX + ci * csW;
        const csG = ctx.createLinearGradient(csX, couchY, csX + csW, couchY + couchH * 0.54);
        csG.addColorStop(0, "#d43848"); csG.addColorStop(1, "#6c0c1a");
        ctx.fillStyle = csG; ctx.beginPath(); ctx.roundRect(csX + 3, couchY + 2, csW - 6, couchH * 0.53, 8); ctx.fill();
        // Seam
        ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(csX + csW / 2, couchY + 8); ctx.lineTo(csX + csW / 2, couchY + couchH * 0.46); ctx.stroke();
        // Highlight strip
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath(); ctx.roundRect(csX + 7, couchY + 5, csW - 14, 9, 4); ctx.fill();
      }
      // Seat cushions
      for (let ci = 0; ci < 3; ci++) {
        const csW = couchW / 3, csX = couchX + ci * csW;
        const csG = ctx.createLinearGradient(csX, couchY + couchH * 0.5, csX, couchY + couchH * 0.87);
        csG.addColorStop(0, "#c02030"); csG.addColorStop(1, "#760c1c");
        ctx.fillStyle = csG; ctx.beginPath(); ctx.roundRect(csX + 3, couchY + couchH * 0.5, csW - 6, couchH * 0.38, 5); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.16)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(csX + csW / 2, couchY + couchH * 0.52); ctx.lineTo(csX + csW / 2, couchY + couchH * 0.85); ctx.stroke();
      }
      // Armrests w/ nail heads
      const doArm = (ax) => {
        const aG = ctx.createLinearGradient(ax, couchY, ax + W * 0.046, couchY + couchH);
        aG.addColorStop(0, "#8a0022"); aG.addColorStop(1, "#460010");
        ctx.fillStyle = aG; ctx.beginPath(); ctx.roundRect(ax, couchY + couchH * 0.2, W * 0.046, couchH * 0.8, 8); ctx.fill();
        ctx.fillStyle = "#c8a028";
        for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.arc(ax + W * 0.023, couchY + couchH * 0.3 + n * H * 0.042, 2.2, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#e8c040";
        for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.arc(ax + W * 0.023 - 0.5, couchY + couchH * 0.3 + n * H * 0.042 - 0.5, 1, 0, Math.PI * 2); ctx.fill(); }
      };
      doArm(couchX - W * 0.043); doArm(couchX + couchW);
      // Throw pillow
      const pilX2 = couchX + couchW * 0.71, pilY2 = couchY + couchH * 0.1;
      ctx.fillStyle = "#f0c070"; ctx.beginPath(); ctx.roundRect(pilX2, pilY2, W * 0.07, H * 0.1, 9); ctx.fill();
      ctx.strokeStyle = "rgba(175,90,18,0.38)"; ctx.lineWidth = 1;
      ctx.strokeRect(pilX2 + 4, pilY2 + 4, W * 0.07 - 8, H * 0.1 - 8);
      ctx.strokeStyle = "rgba(195,105,22,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pilX2 + 4, pilY2 + 4); ctx.lineTo(pilX2 + W * 0.07 - 4, pilY2 + H * 0.1 - 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pilX2 + W * 0.07 - 4, pilY2 + 4); ctx.lineTo(pilX2 + 4, pilY2 + H * 0.1 - 4); ctx.stroke();
      // Remote
      const remX2 = couchX + couchW * 0.14, remY2 = couchY + couchH * 0.57;
      const rmW = W * 0.028, rmH = H * 0.062;
      ctx.fillStyle = "#1c1c22"; ctx.beginPath(); ctx.roundRect(remX2, remY2, rmW, rmH, 4); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(remX2 + 2, remY2 + 2, rmW - 4, 2);
      ctx.fillStyle = "#e00"; ctx.beginPath(); ctx.arc(remX2 + rmW / 2, remY2 + H * 0.008, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#303038";
      for (let rb = 0; rb < 6; rb++) { ctx.beginPath(); ctx.arc(remX2 + rmW * 0.28 + (rb % 2) * rmW * 0.42, remY2 + H * 0.018 + Math.floor(rb / 2) * H * 0.013, 2, 0, Math.PI * 2); ctx.fill(); }

      // ── CHARACTER ──────────────────────────────────────────────────────────
      const mX = couchX + couchW * 0.34, mY = couchY + couchH * 0.46;
      ctx.save(); ctx.translate(mX, mY);
      if (isOut) ctx.rotate(fallAngle);

      // Body shadow
      ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.beginPath(); ctx.ellipse(24, 53, 37, 8, 0, 0, Math.PI * 2); ctx.fill();

      // Jeans
      const jG = ctx.createLinearGradient(-8, 0, 50, 52);
      jG.addColorStop(0, "#2c5299"); jG.addColorStop(0.5, "#1a387a"); jG.addColorStop(1, "#0d1b4c");
      ctx.fillStyle = jG;
      ctx.beginPath(); ctx.moveTo(-8, -5); ctx.quadraticCurveTo(14, -13, 31, -4); ctx.quadraticCurveTo(45, 4, 47, 17);
      ctx.quadraticCurveTo(45, 24, 37, 23); ctx.quadraticCurveTo(16, 16, -8, 12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(35, 20); ctx.quadraticCurveTo(51, 22, 55, 35); ctx.quadraticCurveTo(58, 44, 53, 49);
      ctx.lineTo(41, 47); ctx.quadraticCurveTo(41, 32, 31, 22); ctx.closePath(); ctx.fill();
      // Jeans seam + highlight
      ctx.strokeStyle = "rgba(8,14,48,0.55)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(30, 7); ctx.quadraticCurveTo(36, 14, 37, 22); ctx.stroke();
      ctx.fillStyle = "rgba(120,155,255,0.09)"; ctx.fillRect(3, 2, 22, 2);

      // Shoe
      ctx.fillStyle = "#181820";
      ctx.beginPath(); ctx.moveTo(39, 45); ctx.lineTo(56, 46); ctx.quadraticCurveTo(67, 50, 68, 55);
      ctx.quadraticCurveTo(53, 59, 37, 55); ctx.quadraticCurveTo(36, 50, 39, 45); ctx.fill();
      ctx.strokeStyle = "#555"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(37, 55); ctx.lineTo(66, 55); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(44, 47); ctx.lineTo(52, 50); ctx.moveTo(48, 46); ctx.lineTo(55, 49); ctx.stroke();

      // Shirt (plaid pattern)
      const bR = 20 + bellyGrow * 0.73;
      const shrtG = ctx.createRadialGradient(10, -27, 2, 10, -27, bR + 26);
      shrtG.addColorStop(0, "#f8f8f4"); shrtG.addColorStop(0.62, "#eaeae8"); shrtG.addColorStop(1, "#c6c6cc");
      ctx.fillStyle = shrtG;
      ctx.beginPath(); ctx.moveTo(-15, -45); ctx.quadraticCurveTo(4, -58, 27, -47); ctx.quadraticCurveTo(44, -37, 34 + bellyGrow * 0.62, -15);
      ctx.quadraticCurveTo(24 + bellyGrow * 0.53, 7, -4, 3); ctx.quadraticCurveTo(-19, -14, -15, -45); ctx.fill();
      // Plaid stripes
      ctx.strokeStyle = "rgba(90,110,200,0.16)"; ctx.lineWidth = 3;
      for (let s = 0; s < 4; s++) { ctx.beginPath(); ctx.moveTo(-15 + s * 11, -58); ctx.lineTo(-5 + s * 13, 6); ctx.stroke(); }
      ctx.strokeStyle = "rgba(90,110,200,0.1)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-15, -38); ctx.lineTo(40 + bellyGrow * 0.55, -22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-15, -26); ctx.lineTo(36 + bellyGrow * 0.6, -10); ctx.stroke();
      // Belly jiggle shine
      ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.sin(ts * 0.003) * 0.04})`;
      ctx.beginPath(); ctx.ellipse(14 + bellyGrow * 0.22, -23, bR * 0.68, 18, -0.1, 0, Math.PI * 2); ctx.fill();
      // Buttons
      ctx.fillStyle = "#a8a8a8";
      for (let b = 0; b < 4; b++) { ctx.beginPath(); ctx.arc(17 + bellyGrow * 0.44, -39 + b * 11, 1.6, 0, Math.PI * 2); ctx.fill(); }
      // Seam
      ctx.strokeStyle = "rgba(100,100,112,0.4)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(16, -46); ctx.quadraticCurveTo(21, -26, 20 + bellyGrow * 0.46, -3); ctx.stroke();
      // Collar
      ctx.fillStyle = "#eeece8";
      ctx.beginPath(); ctx.moveTo(-1, -44); ctx.lineTo(11, -36); ctx.lineTo(15, -47);
      ctx.lineTo(23, -36); ctx.lineTo(30, -44); ctx.lineTo(20, -51); ctx.lineTo(8, -51); ctx.closePath(); ctx.fill();
      // Neck
      const sk = "#e0a870";
      ctx.fillStyle = sk; ctx.beginPath(); ctx.roundRect(2, -55, 15, 14, 5); ctx.fill();
      // Ear
      ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(-1.5, -67, 3.5, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#c8906a"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(0, -67, 2.5, -0.3, Math.PI + 0.3); ctx.stroke();
      // Hair
      ctx.fillStyle = "#2c1a10";
      ctx.beginPath(); ctx.moveTo(-2, -70); ctx.quadraticCurveTo(0, -88, 18, -86); ctx.quadraticCurveTo(32, -80, 27, -64);
      ctx.quadraticCurveTo(16, -73, 3, -71); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#1e0e08"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, -71); ctx.quadraticCurveTo(-2, -79, 4, -83); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, -74); ctx.quadraticCurveTo(11, -83, 20, -83); ctx.stroke();
      // Face
      ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(12, -68, 13.5, 16.5, -0.06, 0, Math.PI * 2); ctx.fill();
      // Nose
      ctx.fillStyle = "#c8906a"; ctx.beginPath(); ctx.ellipse(23, -65, 4.5, 5.5, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#b8784e"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(21.5, -63, 2.2, 0.2, Math.PI - 0.2); ctx.stroke();
      // Blush cheeks
      if (blush > 0.18) {
        ctx.fillStyle = `rgba(218,72,72,${0.14 * blush})`;
        ctx.beginPath(); ctx.ellipse(7, -63, 7.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(21, -63, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      // Eyes & expressions
      if (!isOut) {
        // Eyebrow
        ctx.strokeStyle = "#2a1408"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(6, -77); ctx.quadraticCurveTo(11, -79, 16, -77); ctx.stroke();
        // Whites + iris
        const eyeOp = clamp(1 - eyeDroop * 0.8, 0.22, 1);
        ctx.fillStyle = "#f9f9f9"; ctx.beginPath(); ctx.ellipse(11, -71, 3.5, 2.6 * eyeOp, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#3a2010"; ctx.beginPath(); ctx.ellipse(11, -71, 2.1, 1.9 * eyeOp, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.ellipse(11, -71, 1.3, 1.3 * eyeOp, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(12, -72, 0.75, 0, Math.PI * 2); ctx.fill();
        if (eyeDroop > 0.28) {
          ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(11, -71 - 2.5 * eyeOp + 0.5, 4, 2.3 * (eyeDroop - 0.28) + 0.6, 0, 0, Math.PI * 2); ctx.fill();
        }
        // Mouth
        ctx.strokeStyle = "#8a3030"; ctx.lineWidth = 1.5;
        if (armUp) {
          ctx.fillStyle = "#3c1012"; ctx.beginPath(); ctx.ellipse(18, -57, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#e8e0d0"; ctx.beginPath(); ctx.arc(18, -57, 2.5, Math.PI, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(18, -57, 3.5, 0.12, Math.PI - 0.12); ctx.stroke();
        }
      } else {
        // Unconscious face — X eyes
        ctx.strokeStyle = "#444"; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(7, -74); ctx.lineTo(15, -67); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(15, -74); ctx.lineTo(7, -67); ctx.stroke();
        // Drool
        const drA = clamp((timeS - 5.85) / 0.55, 0, 1);
        if (drA > 0) {
          ctx.strokeStyle = `rgba(140,170,225,${drA * 0.72})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(15, -54); ctx.bezierCurveTo(16, -52, 18, -50, 17, -45); ctx.stroke();
          ctx.fillStyle = `rgba(140,170,225,${drA * 0.52})`;
          ctx.beginPath(); ctx.arc(17, -43, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        // Strong blush
        ctx.fillStyle = `rgba(200,55,55,0.2)`;
        ctx.beginPath(); ctx.ellipse(7, -64, 8, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(21, -64, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      // Sweat drops
      if (sweating && !isOut) {
        const swN = Math.floor((eatF - 0.54) / 0.46 * 5) + 1;
        for (let sw = 0; sw < swN; sw++) {
          const swDX = -9 + sw * 9 + Math.sin(ts * 0.002 + sw * 1.2) * 3;
          const swDY = -87 + Math.sin(ts * 0.0032 + sw * 2.2) * 10;
          const swA = 0.5 + Math.sin(ts * 0.004 + sw) * 0.2;
          ctx.fillStyle = `rgba(168,214,255,${swA})`;
          ctx.beginPath(); ctx.moveTo(swDX, swDY); ctx.quadraticCurveTo(swDX + 3.5, swDY + 6, swDX, swDY + 11);
          ctx.quadraticCurveTo(swDX - 3.5, swDY + 6, swDX, swDY); ctx.fill();
        }
      }
      // Left arm (resting)
      ctx.strokeStyle = "#ccccd4"; ctx.lineWidth = 13; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-7, -40); ctx.quadraticCurveTo(-27, -30, -18, -8); ctx.stroke();
      ctx.strokeStyle = sk; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-19, -11); ctx.quadraticCurveTo(-13, 2, 4, -3); ctx.stroke();
      ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(5, -3, 6.5, 5.5, 0.3, 0, Math.PI * 2); ctx.fill();
      // Right arm (eating)
      ctx.strokeStyle = "#ccccd4"; ctx.lineWidth = 13; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(21, -40);
      if (!isOut) ctx.quadraticCurveTo(armUp ? 39 : 39, armUp ? -32 : -24, armUp ? 30 : 28, armUp ? -57 : -4);
      else ctx.quadraticCurveTo(37, -20, 34, 29);
      ctx.stroke();
      ctx.strokeStyle = sk; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(27, -32);
      if (!isOut) ctx.quadraticCurveTo(armUp ? 39 : 37, armUp ? -47 : -18, armUp ? 30 : 29, armUp ? -59 : -4);
      else ctx.quadraticCurveTo(41, 2, 35, 30);
      ctx.stroke();
      // Right hand + candy
      ctx.fillStyle = sk;
      if (!isOut) {
        const hpX = armUp ? 30 : 29, hpY = armUp ? -60 : -4;
        ctx.beginPath(); ctx.ellipse(hpX, hpY, 6.5, 5.5, 0.2, 0, Math.PI * 2); ctx.fill();
        if (armUp) {
          const hue = (timeS * 78) % 360;
          const cG2 = ctx.createRadialGradient(hpX, hpY - 7, 1, hpX, hpY - 7, 6.5);
          cG2.addColorStop(0, `hsl(${hue}, 100%, 72%)`); cG2.addColorStop(1, `hsl(${hue + 35}, 100%, 44%)`);
          ctx.fillStyle = cG2; ctx.beginPath(); ctx.arc(hpX, hpY - 7.5, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.48)"; ctx.beginPath(); ctx.arc(hpX - 2, hpY - 10, 2.2, 0, Math.PI * 2); ctx.fill();
          if (Math.random() > 0.62) {
            for (let sp = 0; sp < 3; sp++) {
              sugarSparkles.push({ x: mX + hpX + (Math.random() - 0.5) * 18, y: mY + hpY - 7.5 + (Math.random() - 0.5) * 18, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2.2 - 0.5, life: 1, hue });
            }
          }
        }
      } else {
        ctx.beginPath(); ctx.ellipse(35, 31, 6.5, 5.5, 0.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // ── CANDY BOWL ──────────────────────────────────────────────────────────
      let bX = mX + 20, bY3 = mY - 6, bRot = 0;
      if (isOut) { const ft = timeS - 5.5; bX += ft * 45; bY3 += ft * ft * 168; bRot = ft * 5.8; }
      ctx.save(); ctx.translate(bX, bY3); ctx.rotate(bRot);
      ctx.fillStyle = "rgba(0,0,0,0.17)"; ctx.beginPath(); ctx.ellipse(0, 15, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      const bwlG = ctx.createLinearGradient(-15, -8, 15, 8);
      bwlG.addColorStop(0, "#eaeae2"); bwlG.addColorStop(1, "#bcbcb4");
      ctx.fillStyle = bwlG; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI, true); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.stroke();
      if (!isOut || bRot < 1.35) {
        const bcc = ["#ff4466","#ffaa00","#44ff88","#ff88ff","#44aaff","#ffff44"];
        bcc.forEach((col, ci) => {
          ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(-5.5 + ci * 3.3, -2.5 - Math.abs(ci - 2.5) * 1.5, 3, 2.3, ci * 0.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.beginPath(); ctx.arc(-6.5 + ci * 3.3, -3.5 - Math.abs(ci - 2.5) * 1.5, 0.9, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.restore();

      // ── SPILLED CANDIES ─────────────────────────────────────────────────────
      if (isOut && candies.length === 0 && timeS < 6.9) {
        for (let ci = 0; ci < 26; ci++) {
          candies.push({ x: mX + 22, y: mY - 8, vx: (Math.random() - 0.3) * 10.5, vy: (Math.random() - 0.88) * 8.5, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.35, color: `hsl(${Math.random() * 360},100%,58%)`, size: 3.8 + Math.random() * 3.8, shape: Math.floor(Math.random() * 3) });
        }
      }
      if (!isOut && candies.length > 0) candies = [];
      candies.forEach(c => {
        c.x += c.vx; c.y += c.vy; c.vy += 0.58; c.rot += c.rotV;
        if (c.y > floorY - 5) { c.y = floorY - 5; c.vy *= -0.46; c.vx *= 0.85; }
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        if (c.shape === 0) { ctx.beginPath(); ctx.arc(0, 0, c.size, 0, Math.PI * 2); ctx.fill(); }
        else if (c.shape === 1) { ctx.beginPath(); ctx.roundRect(-c.size, -c.size, c.size * 2, c.size * 2, c.size * 0.3); ctx.fill(); }
        else { ctx.beginPath(); ctx.ellipse(0, 0, c.size * 1.65, c.size * 0.64, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.beginPath(); ctx.arc(-c.size * 0.33, -c.size * 0.33, c.size * 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // ── SUGAR SPARKLES ──────────────────────────────────────────────────────
      sugarSparkles.forEach(sp => {
        sp.x += sp.vx; sp.y += sp.vy; sp.life -= 0.027;
        if (sp.life > 0) {
          ctx.fillStyle = `hsla(${sp.hue},100%,78%,${sp.life})`;
          ctx.beginPath(); ctx.arc(sp.x, sp.y, 2.5 * sp.life, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = `hsla(${sp.hue + 28},100%,92%,${sp.life * 0.52})`;
          ctx.lineWidth = 0.9; const r2 = 4 * sp.life;
          ctx.beginPath(); ctx.moveTo(sp.x - r2, sp.y); ctx.lineTo(sp.x + r2, sp.y);
          ctx.moveTo(sp.x, sp.y - r2); ctx.lineTo(sp.x, sp.y + r2); ctx.stroke();
        }
      });
      for (let i = sugarSparkles.length - 1; i >= 0; i--) { if (sugarSparkles[i].life <= 0) sugarSparkles.splice(i, 1); }

      // ── GLUCOSE HUD ─────────────────────────────────────────────────────────
      const hudX = W - 140, hudY3 = 15, hudW = 130, hudH3 = 102;
      const gc = glucose < 140 ? "#42ff84" : glucose < 250 ? "#ffcc22" : glucose < 380 ? "#ff8800" : "#ff2424";
      ctx.fillStyle = "rgba(3,7,16,0.92)"; ctx.beginPath(); ctx.roundRect(hudX, hudY3, hudW, hudH3, 10); ctx.fill();
      const alertBdr = glucose > 300 && ts % 480 < 240;
      ctx.strokeStyle = alertBdr ? "#ff2424" : "rgba(55,108,138,0.68)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(hudX, hudY3, hudW, hudH3, 10); ctx.stroke();
      if (alertBdr) {
        ctx.strokeStyle = "rgba(255,36,36,0.18)"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(hudX, hudY3, hudW, hudH3, 10); ctx.stroke();
      }
      ctx.font = "500 9px monospace"; ctx.fillStyle = "#567888"; ctx.textAlign = "left";
      ctx.fillText("BLOOD GLUCOSE", hudX + 8, hudY3 + 14);
      ctx.font = `bold ${H * 0.044}px monospace`; ctx.fillStyle = gc; ctx.textAlign = "right";
      ctx.fillText(Math.floor(glucose), hudX + hudW - 36, hudY3 + 39);
      ctx.font = "9px monospace"; ctx.fillStyle = "#567888"; ctx.fillText("mg/dL", hudX + hudW - 6, hudY3 + 39);
      const trend = glucoseHistory.length > 7 ? glucoseHistory[glucoseHistory.length - 1] - glucoseHistory[glucoseHistory.length - 7] : 0;
      ctx.font = "bold 13px monospace"; ctx.fillStyle = gc; ctx.textAlign = "left";
      ctx.fillText(trend > 25 ? "↑↑" : trend > 8 ? "↑" : trend < -8 ? "↓" : "→", hudX + hudW - 30, hudY3 + 39);
      const lbl = glucose < 140 ? "NORMAL" : glucose < 250 ? "ELEVATED" : glucose < 380 ? "HIGH ⚠" : "CRITICAL ⚠";
      ctx.font = "bold 8px monospace"; ctx.fillStyle = gc; ctx.textAlign = "center";
      ctx.fillText(lbl, hudX + hudW / 2, hudY3 + 51);
      // Sparkline
      if (glucoseHistory.length > 1) {
        const gMin = 80, gMax = 475, gW3 = hudW - 16, gH3 = 29;
        const gX3 = hudX + 8, gY3 = hudY3 + hudH3 - gH3 - 8;
        ctx.fillStyle = "rgba(0,10,26,0.72)"; ctx.beginPath(); ctx.roundRect(gX3, gY3, gW3, gH3, 4); ctx.fill();
        ctx.strokeStyle = "rgba(38,88,110,0.42)"; ctx.lineWidth = 0.5;
        [140, 200, 300].forEach(gl => {
          const ly = gY3 + gH3 - ((gl - gMin) / (gMax - gMin)) * gH3;
          ctx.beginPath(); ctx.moveTo(gX3, ly); ctx.lineTo(gX3 + gW3, ly); ctx.stroke();
        });
        ctx.strokeStyle = gc; ctx.lineWidth = 1.7;
        ctx.beginPath();
        glucoseHistory.forEach((g, i) => {
          const px = gX3 + (i / (glucoseHistory.length - 1)) * gW3;
          const py = gY3 + gH3 - clamp((g - gMin) / (gMax - gMin), 0, 1) * gH3;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
        const lPy = gY3 + gH3 - clamp((glucoseHistory[glucoseHistory.length - 1] - gMin) / (gMax - gMin), 0, 1) * gH3;
        ctx.lineTo(gX3 + gW3, gY3 + gH3); ctx.lineTo(gX3, gY3 + gH3); ctx.closePath();
        ctx.fillStyle = `${gc}18`; ctx.fill();
        // Live dot
        const dotX = gX3 + gW3, dotY = lPy;
        ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `${gc}4a`; ctx.beginPath(); ctx.arc(dotX, dotY, 5 + Math.sin(ts * 0.012) * 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.textAlign = "left";

      // ── VIGNETTE ────────────────────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.18, W * 0.5, H * 0.5, W * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

      // ── SUGAR CRASH SEQUENCE ─────────────────────────────────────────────────
      if (isOut) {
        ctx.fillStyle = `rgba(165,0,0,${0.1 + Math.sin(ts * 0.014) * 0.07})`;
        ctx.fillRect(0, 0, W, H);
        // EKG heartbeat line
        const htY = H * 0.89, htX2 = W * 0.07, htW2 = W * 0.86;
        const htPrg = (ts * 0.55) % htW2;
        ctx.strokeStyle = "#ff2424"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(htX2, htY);
        ctx.lineTo(htX2 + htPrg * 0.56, htY);
        if (htPrg > htW2 * 0.27) {
          const bp = htX2 + htPrg * 0.56;
          ctx.lineTo(bp + htPrg * 0.04, htY);
          ctx.lineTo(bp + htPrg * 0.065, htY - H * 0.058);
          ctx.lineTo(bp + htPrg * 0.105, htY + H * 0.09);
          ctx.lineTo(bp + htPrg * 0.145, htY - H * 0.038);
          ctx.lineTo(bp + htPrg * 0.185, htY);
          ctx.lineTo(htX2 + htPrg, htY);
        }
        ctx.stroke();
        // EKG cursor dot
        ctx.fillStyle = "#ff4444"; ctx.beginPath(); ctx.arc(htX2 + htPrg, htY, 3.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,40,40,0.26)"; ctx.beginPath(); ctx.arc(htX2 + htPrg, htY, 8 + Math.sin(ts * 0.025) * 2, 0, Math.PI * 2); ctx.fill();
        // Crash title
        ctx.save();
        ctx.translate(W / 2, H * 0.4); ctx.rotate(Math.sin(ts * 0.007) * 0.028);
        ctx.font = `900 ${H * 0.067}px "Arial Black", sans-serif`; ctx.textAlign = "center";
        ctx.shadowBlur = 24; ctx.shadowColor = "#ff0000";
        ctx.strokeStyle = "#180000"; ctx.lineWidth = 10;
        ctx.strokeText("SUGAR CRASH!", 0, 0);
        ctx.fillStyle = "#ff3333"; ctx.fillText("SUGAR CRASH!", 0, 0);
        ctx.shadowBlur = 0;
        ctx.font = `bold ${H * 0.028}px Arial`; ctx.fillStyle = "#ffba44";
        ctx.fillText(`Glucose: ${Math.floor(glucose)} mg/dL — Seek help immediately`, 0, H * 0.06);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => { window.removeEventListener("resize", init); if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export const YoutubeViz = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let views = 1500;

        const render = () => {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Play Button
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.roundRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 35, 10);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 5, canvas.height / 2 - 15);
            ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - 7);
            ctx.lineTo(canvas.width / 2 - 5, canvas.height / 2 + 2);
            ctx.fill();

            // Counter
            views += Math.floor(Math.random() * 50);
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${views.toLocaleString()}`, canvas.width / 2, canvas.height / 2 + 40);

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationId); };
    }, []);
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const McqViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let tick = 0;
        let scanY = 0;

        const render = () => {
            ctx.fillStyle = '#0f172a'; // Dark blue-grey
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            tick++;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Document Icon
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.roundRect(cx - 30, cy - 40, 60, 80, 5);
            ctx.fill();

            // Text Lines on Doc
            ctx.fillStyle = '#ccc';
            ctx.fillRect(cx - 20, cy - 30, 40, 5);
            ctx.fillRect(cx - 20, cy - 15, 40, 5);
            ctx.fillRect(cx - 20, cy - 0, 30, 5);

            // Scanning Beam
            scanY = (scanY + 2) % 100;
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Indigo scan
            ctx.fillRect(cx - 35, cy - 45 + scanY, 70, 5);

            // Brain/AI Pulse
            if (tick % 60 < 20) {
                ctx.beginPath();
                ctx.arc(cx, cy - 60, 10 + Math.sin(tick * 0.5) * 5, 0, Math.PI * 2);
                ctx.fillStyle = '#00ff88';
                ctx.fill();
            }

            // Pop out MCQ Cards
            if (tick % 120 > 60) {
                const drawCard = (idx, text) => {
                    const angle = (idx / 4) * Math.PI * 2;
                    const r = 60;
                    const x = cx + Math.cos(angle + tick * 0.02) * r;
                    const y = cy + Math.sin(angle + tick * 0.02) * r;

                    ctx.fillStyle = '#1e293b';
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(text, x, y);
                };
                drawCard(0, 'A');
                drawCard(1, 'B');
                drawCard(2, 'C');
                drawCard(3, 'D');
            }

            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const OcrViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let scanY = 0;
        let particles = [];
        let tick = 0;

        const render = () => {
            // Dark techno background
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const docW = 100;
            const docH = 140;

            tick++;

            // Document pulsing (Compression effect)
            const scale = 1 + Math.sin(tick * 0.05) * 0.02;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(scale, scale);

            // Document Body
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(-docW / 2, -docH / 2, docW, docH, 8);
            ctx.fill();

            // Text Lines (Abstract)
            ctx.fillStyle = '#334155';
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(-docW / 2 + 10, -docH / 2 + 20 + i * 20, docW - 20, 8);
            }

            // Scanned Highlight (Green parts stay green after scan)
            // We simulate this by masking or just drawing over
            const relativeScanY = scanY - (cy - docH / 2);
            if (relativeScanY > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(-docW / 2, -docH / 2, docW, Math.min(docH, relativeScanY), 8);
                ctx.clip();

                // "Processed" text color
                ctx.fillStyle = '#3b82f6'; // Blue-ish processed state
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(-docW / 2 + 10, -docH / 2 + 20 + i * 20, docW - 20, 8);
                }
                ctx.restore();
            }

            ctx.restore(); // Undo scale/translate

            // Scanner Beam
            scanY += 2;
            if (scanY > cy + docH / 2 + 20) {
                scanY = cy - docH / 2 - 20;
            }

            // Draw Beam
            if (scanY > cy - docH / 2 && scanY < cy + docH / 2) {
                ctx.beginPath();
                ctx.moveTo(cx - docW / 2 - 10, scanY);
                ctx.lineTo(cx + docW / 2 + 10, scanY);
                ctx.strokeStyle = '#00ffcc';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ffcc';
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Spawn extraction particles
                if (Math.random() > 0.5) {
                    particles.push({
                        x: cx - docW / 2 + Math.random() * docW,
                        y: scanY,
                        char: Math.random() > 0.5 ? '1' : '0',
                        age: 0,
                        speedX: (Math.random() - 0.5) * 2,
                        speedY: -Math.random() * 2 - 1
                    });
                }
            }

            // Update & Draw Particles
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            particles.forEach((p, i) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.age++;

                const alpha = 1 - p.age / 40;
                if (alpha <= 0) {
                    particles.splice(i, 1);
                    return;
                }

                ctx.fillStyle = `rgba(0, 255, 204, ${alpha})`;
                ctx.fillText(p.char, p.x, p.y);
            });

            // Compression / Success overlay (Periodically)
            if (tick % 200 > 180) {
                ctx.fillStyle = `rgba(255, 255, 255, ${(tick % 200 - 180) / 20 * 0.1})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const BlancDJViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let tick = 0;

        const render = () => {
            // Premium Dark Background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#050505'); // Darker, sleeker
            gradient.addColorStop(1, '#151515');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            tick++;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Draw Decks
            const drawDeck = (x, y, isPlaying, color) => {
                ctx.save();
                ctx.translate(x, y);

                // Turntable Base Glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = color; // Glow matches label color

                // Turntable Base
                ctx.fillStyle = '#1a1a1a';
                ctx.beginPath();
                ctx.roundRect(-45, -45, 90, 90, 8);
                ctx.fill();

                // Reset shadow for inner details
                ctx.shadowBlur = 0;

                // Vinyl Rotation (Slower, smoother)
                if (isPlaying) ctx.rotate(tick * 0.02);

                // Vinyl Record
                ctx.beginPath();
                ctx.arc(0, 0, 38, 0, Math.PI * 2);
                ctx.fillStyle = '#080808';
                ctx.fill();

                // Grooves (Reflections) - Subtle
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 1;
                for (let r = 12; r < 35; r += 4) {
                    ctx.beginPath();
                    ctx.arc(0, 0, r, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // **Visual Marker for Spin** (A light shine/reflection sector)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, 38, 0, 0.5); // Pie slice
                ctx.fill();

                // Label Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = color;

                // Label
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();

                // Spindle
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            };

            // Deck A & B (Pink & Blue neon)
            drawDeck(cx - 60, cy, true, '#ff0055');
            drawDeck(cx + 60, cy, true, '#00ccff');

            // Audio Waveform Visualization (Center) - Slower & Smoother
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            const waveData = [];
            for (let i = 0; i < 30; i++) {
                // Perlin-ish noise simulation (slower phase)
                const val = Math.sin(tick * 0.05 + i * 0.3) * Math.cos(tick * 0.03 - i * 0.1) * 15;
                waveData.push(val);
            }

            // Mirror waveform
            ctx.beginPath();
            ctx.moveTo(cx - 30, cy + 81);
            for (let i = 0; i < 30; i++) {
                const x = (cx - 30) + (i * 2);
                const h = waveData[i];
                ctx.fillRect(x, cy + 81 - Math.abs(h), 1.5, Math.abs(h) * 2);
            }

            // VU Meters (Sides) - Smoother decay
            const drawVU = (x, offset) => {
                // Smooth sine based level instead of random flickering
                const level = 20 + Math.sin(tick * 0.1 + offset) * 15 + Math.random() * 5;

                ctx.fillStyle = '#111';
                ctx.fillRect(x, cy - 40, 6, 80);

                const grad = ctx.createLinearGradient(0, cy + 40, 0, cy - 40);
                grad.addColorStop(0, '#00ff88');
                grad.addColorStop(0.6, '#ffff00');
                grad.addColorStop(1, '#ff0055');
                ctx.fillStyle = grad;

                ctx.save();
                ctx.beginPath();
                ctx.rect(x + 1, cy + 40 - level * 2, 4, level * 2);
                ctx.clip();
                ctx.fill();
                ctx.restore();
            }
            drawVU(20, 0);
            drawVU(canvas.width - 26, 2);


            animationId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const FinancierViz = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;
    let tick = 0;

    const packets = [];
    const fog = [];

    const nodes = [
      {
        id: "pdf",
        x: 0.12,
        y: 0.78,
        title: "PDF Loader",
        subtitle: "145 Documents",
        color: "#38bdf8",
      },
      {
        id: "embed",
        x: 0.35,
        y: 0.3,
        title: "Bedrock",
        subtitle: "Titan Embeddings",
        color: "#f59e0b",
      },
      {
        id: "vector",
        x: 0.56,
        y: 0.72,
        title: "S3 Vectors",
        subtitle: "2.3M vectors",
        color: "#22d3ee",
      },
      {
        id: "agent",
        x: 0.75,
        y: 0.34,
        title: "AI Agent",
        subtitle: "Reasoning",
        color: "#34d399",
      },
      {
        id: "chat",
        x: 0.9,
        y: 0.72,
        title: "Chat UI",
        subtitle: "Answer",
        color: "#60a5fa",
      },
    ];

    const links = [
      ["pdf", "embed"],
      ["embed", "vector"],
      ["vector", "agent"],
      ["agent", "chat"],
    ];

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 100; i++) {
      fog.push({
        x: Math.random() * 2000,
        y: Math.random() * 1000,
        r: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    const chartData = [];
    let price = 100;

    for (let i = 0; i < 500; i++) {
      price += (Math.random() - 0.48) * 2;

      if (Math.random() > 0.985) {
        price += (Math.random() - 0.5) * 15;
      }

      chartData.push(price);
    }

    const getNode = (id) => {
      const n = nodes.find((n) => n.id === id);

      return {
        ...n,
        px: n.x * canvas.width,
        py: n.y * canvas.height,
      };
    };

    let activeLink = 0;

    const spawnPacket = () => {
      const [from, to] = links[activeLink];

      packets.push({
        from: getNode(from),
        to: getNode(to),
        progress: 0,
      });

      activeLink = (activeLink + 1) % links.length;
    };

    setInterval(spawnPacket, 400);

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawChart = () => {
      const topHeight = canvas.height * 0.42;

      ctx.save();

      ctx.beginPath();

      chartData.forEach((p, i) => {
        const x = (i / chartData.length) * canvas.width;

        const y =
          topHeight -
          ((p - 70) / 60) * topHeight +
          Math.sin(tick * 0.01) * 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;

      ctx.shadowBlur = 20;
      ctx.shadowColor = "#22d3ee";

      ctx.stroke();

      ctx.restore();
    };

    const drawCards = () => {
      nodes.forEach((node, index) => {
        const x = node.x * canvas.width;
        const y = node.y * canvas.height;

        const w = 130;
        const h = 55;

        const pulse =
          Math.sin(tick * 0.05 + index) * 0.5 + 0.5;

        ctx.save();

        ctx.fillStyle = "rgba(15,23,42,0.75)";
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;

        roundRect(ctx, x - w / 2, y - h / 2, w, h, 12);

        ctx.fill();
        ctx.stroke();

        for (let r = 0; r < 3; r++) {
          const radius =
            10 + ((tick + r * 30) % 90);

          ctx.strokeStyle =
            `rgba(52,211,153,${
              1 - radius / 100
            })`;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = "white";
        ctx.font = "bold 12px Inter";
        ctx.fillText(node.title, x - 50, y - 3);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px Inter";
        ctx.fillText(node.subtitle, x - 50, y + 14);

        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(x + 48, y, 6 + pulse * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    const drawLinks = () => {
      links.forEach(([a, b]) => {
        const n1 = getNode(a);
        const n2 = getNode(b);

        const grad =
          ctx.createLinearGradient(
            n1.px,
            n1.py,
            n2.px,
            n2.py
          );

        grad.addColorStop(0, "#0ea5e9");
        grad.addColorStop(1, "#34d399");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(n1.px, n1.py);
        ctx.lineTo(n2.px, n2.py);
        ctx.stroke();
      });
    };

    const drawPackets = () => {
      packets.forEach((p) => {
        p.progress += 0.02;

        const x =
          p.from.px +
          (p.to.px - p.from.px) *
            p.progress;

        const y =
          p.from.py +
          (p.to.py - p.from.py) *
            p.progress;

        ctx.fillStyle = "#e0f2fe";

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#38bdf8";

        ctx.fillRect(
          x - 5,
          y - 2,
          10,
          4
        );
      });

      while (
        packets.length &&
        packets[0].progress > 1
      ) {
        packets.shift();
      }
    };

    const drawFog = () => {
      fog.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;

        ctx.fillStyle =
          "rgba(255,255,255,0.04)";

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawTicker = () => {
      const ticker =
        "NIFTY 24852 ▲1.84%    BANKNIFTY 55321 ▲0.72%    RELIANCE 3184 ▲0.91%    INFY 1612 ▼0.28%";

      const offset =
        -(tick * 2) %
        (ctx.measureText(ticker).width + 100);

      ctx.fillStyle = "#93c5fd";
      ctx.font = "bold 12px monospace";

      ctx.fillText(
        ticker,
        offset,
        25
      );

      ctx.fillText(
        ticker,
        offset +
          ctx.measureText(ticker).width +
          100,
        25
      );
    };

    const animate = () => {
      tick++;

      const bg =
        ctx.createLinearGradient(
          0,
          0,
          0,
          canvas.height
        );

      bg.addColorStop(0, "#050b14");
      bg.addColorStop(1, "#0f172a");

      ctx.fillStyle = bg;
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      drawGrid();
      drawFog();
      drawChart();
      drawLinks();
      drawPackets();
      drawCards();
      drawTicker();

      animationId =
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  function roundRect(
    ctx,
    x,
    y,
    w,
    h,
    r
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);

    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);

    ctx.closePath();
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export const EyeTrackerViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        const clickRipples = [];

        const directions = ['up', 'right', 'straight', 'down', 'left'];

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };

        init();
        window.addEventListener('resize', init);

        let tick = 0;
        let modeIdx = 0;
        let directionIdx = 0;

        const render = () => {
            tick++;
            if (tick % 170 === 0) modeIdx = (modeIdx + 1) % 3;
            if (tick % 62 === 0) {
                directionIdx = (directionIdx + 1) % directions.length;
                if (directions[directionIdx] === 'straight') {
                    clickRipples.push({ r: 0, alpha: 0.8 });
                }
            }

            const modeLabel = modeIdx === 0 ? 'CNN MODE' : modeIdx === 1 ? 'CV FALLBACK' : 'REKOGNITION';
            const dir = directions[directionIdx];
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bg.addColorStop(0, '#070b14');
            bg.addColorStop(1, '#0b1221');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Detection frame
            const frameW = canvas.width * 0.62;
            const frameH = canvas.height * 0.62;
            const fx = cx - frameW / 2;
            const fy = cy - frameH / 2;

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.lineWidth = 2;
            ctx.strokeRect(fx, fy, frameW, frameH);

            // Scan line
            const scanY = fy + ((tick * 1.4) % frameH);
            const g = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
            g.addColorStop(0, 'rgba(56, 189, 248, 0)');
            g.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
            g.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(fx, scanY - 8, frameW, 16);

            // Eyes
            const eyeY = cy - 6;
            const leftX = cx - 48;
            const rightX = cx + 48;
            const eyeW = 56;
            const eyeH = 28;

            const drawEye = (x) => {
                ctx.fillStyle = '#111827';
                ctx.strokeStyle = '#93c5fd';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.ellipse(x, eyeY, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            };
            drawEye(leftX);
            drawEye(rightX);

            const offset = { x: 0, y: 0 };
            if (dir === 'up') offset.y = -6;
            if (dir === 'down') offset.y = 6;
            if (dir === 'left') offset.x = -8;
            if (dir === 'right') offset.x = 8;

            [leftX, rightX].forEach((x) => {
                ctx.fillStyle = '#0ea5e9';
                ctx.beginPath();
                ctx.arc(x + offset.x, eyeY + offset.y, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#e2e8f0';
                ctx.beginPath();
                ctx.arc(x + offset.x + 2, eyeY + offset.y - 2, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            // Cursor output
            const cursorX = cx + offset.x * 4;
            const cursorY = cy + 56 + offset.y * 3;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(cursorX, cursorY);
            ctx.lineTo(cursorX + 12, cursorY + 28);
            ctx.lineTo(cursorX + 18, cursorY + 18);
            ctx.lineTo(cursorX + 27, cursorY + 24);
            ctx.lineTo(cursorX + 30, cursorY + 18);
            ctx.lineTo(cursorX + 20, cursorY + 10);
            ctx.lineTo(cursorX + 29, cursorY + 6);
            ctx.closePath();
            ctx.fill();

            clickRipples.forEach((ripple, i) => {
                ripple.r += 1.5;
                ripple.alpha -= 0.016;
                if (ripple.alpha <= 0) {
                    clickRipples.splice(i, 1);
                    return;
                }
                ctx.strokeStyle = `rgba(56, 189, 248, ${ripple.alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cursorX + 12, cursorY + 14, ripple.r, 0, Math.PI * 2);
                ctx.stroke();
            });

            ctx.font = 'bold 11px monospace';
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText(modeLabel, 12, 18);
            ctx.fillStyle = '#bae6fd';
            ctx.fillText(`GAZE: ${dir.toUpperCase()}`, 12, 34);

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const ShoppingAgentViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        let startTime = performance.now();

        const query = 'wireless earbuds under ₹2000';
        const products = [
            { name: 'boAt Airdopes 141', price: 1299, rating: '4.1', score: 94, reason: 'Best value + Prime' },
            { name: 'Noise Buds VS104', price: 1499, rating: '4.0', score: 89, reason: 'Strong battery score' },
            { name: 'Generic Bass Pods', price: 1899, rating: '3.4', score: 61, reason: 'Lower rating, weak reviews' }
        ];

        const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
        const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
        const fade = (time, start, duration) => clamp((time - start) / duration);
        const formatPrice = (price) => `Rs ${price}`;
        const roundRect = (x, y, w, h, r) => {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
        };

        const drawText = (text, x, y, color = '#111827', size = 10, weight = '500') => {
            ctx.fillStyle = color;
            ctx.font = `${weight} ${size}px Arial, sans-serif`;
            ctx.fillText(text, x, y);
        };

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        const render = () => {
            const loopDuration = 9200;
            const t = (performance.now() - startTime) % loopDuration;
            const width = canvas.width;
            const height = canvas.height;
            const pad = 10;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#f3f3f3';
            ctx.fillRect(0, 0, width, height);

            // Amazon-style nav and self-typing search.
            ctx.fillStyle = '#232f3e';
            ctx.fillRect(0, 0, width, 32);
            drawText('amazon.ai', 11, 20, '#ffffff', 12, '700');

            const searchX = Math.min(88, width * 0.24);
            const searchW = width - searchX - 48;
            roundRect(searchX, 7, searchW, 18, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            const typedChars = Math.floor(easeOut(t / 1500) * query.length);
            drawText(query.slice(0, typedChars), searchX + 8, 20, '#111827', 9, '500');
            ctx.fillStyle = '#ff9900';
            ctx.fillRect(searchX + searchW - 24, 7, 24, 18);
            drawText('Go', searchX + searchW - 19, 20, '#111827', 8, '700');

            const statusMessages = [
                'typing user query...',
                'scanning results...',
                'ranking by price, rating, Prime eligibility.',
                'adding best picks to cart...'
            ];
            const statusIndex = t < 1600 ? 0 : t < 3000 ? 1 : t < 5600 ? 2 : 3;
            roundRect(pad, 38, width - pad * 2, 20, 5);
            ctx.fillStyle = '#fff7d6';
            ctx.fill();
            drawText(`AI agent: ${statusMessages[statusIndex]}`, pad + 9, 52, '#232f3e', 9, '700');

            const cardGap = 7;
            const cardY = 66;
            const cartProgress = easeOut((t - 6000) / 700);
            const cardH = cartProgress > 0 ? 74 : 88;
            const cardW = (width - pad * 2 - cardGap * 2) / 3;
            const revealCount = t > 1900 ? Math.min(3, Math.floor((t - 1900) / 380) + 1) : 0;
            const activeIndex = t < 3100 ? -1 : t < 3900 ? 0 : t < 4700 ? 1 : t < 5500 ? 2 : -1;
            const finalState = t >= 5600;

            products.forEach((product, index) => {
                const reveal = easeOut((t - (1800 + index * 320)) / 450);
                if (reveal <= 0) return;

                const x = pad + index * (cardW + cardGap);
                const y = cardY + (1 - reveal) * 18;
                const isPick = finalState && index < 2;
                const isSkipped = finalState && index === 2;
                const alpha = isSkipped ? 0.5 : 1;

                ctx.save();
                ctx.globalAlpha = alpha;
                roundRect(x, y, cardW, cardH, 6);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.lineWidth = activeIndex === index ? 3 : isPick ? 2.5 : 1;
                ctx.strokeStyle = activeIndex === index ? '#ff9900' : isPick ? '#16a34a' : '#d5d9d9';
                ctx.stroke();

                roundRect(x + 8, y + 8, cardW - 16, 20, 4);
                ctx.fillStyle = index === 0 ? '#e0f2fe' : index === 1 ? '#fef3c7' : '#e5e7eb';
                ctx.fill();
                drawText('earbuds', x + 14, y + 22, '#232f3e', 8, '700');

                drawText(product.name, x + 7, y + 41, '#111827', 8, '700');
                drawText(`${formatPrice(product.price)} | ${product.rating} star`, x + 7, y + 56, '#374151', 8, '600');
                drawText(`score ${product.score}`, x + 7, y + 70, isPick ? '#16a34a' : '#92400e', 8, '700');

                if (isPick) {
                    roundRect(x + cardW - 45, y + 6, 37, 14, 7);
                    ctx.fillStyle = '#dcfce7';
                    ctx.fill();
                    drawText('AI pick', x + cardW - 41, y + 16, '#166534', 7, '700');
                }

                if (isSkipped) {
                    roundRect(x + cardW - 45, y + 6, 37, 14, 7);
                    ctx.fillStyle = '#fee2e2';
                    ctx.fill();
                    drawText('skipped', x + cardW - 42, y + 16, '#991b1b', 7, '700');
                }
                ctx.restore();
            });

            // Reasoning log.
            const logY = 160;
            roundRect(pad, logY, width - pad * 2, 18, 5);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            let logText = 'Waiting for product results...';
            if (activeIndex >= 0) {
                const product = products[activeIndex];
                logText = `score ${product.score}: ${product.reason}`;
            } else if (finalState) {
                logText = 'Top 2 selected. Weakest result skipped.';
            } else if (revealCount > 0) {
                logText = 'Results loaded. Reading each card...';
            }
            drawText(logText, pad + 8, logY + 12, '#232f3e', 8, '700');

            // Sliding cart panel and checkout.
            if (cartProgress > 0) {
                const cartY = height - 49 + (1 - cartProgress) * 48;
                roundRect(pad, cartY, width - pad * 2, 42, 7);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = '#ff9900';
                ctx.stroke();
                drawText('Cart', pad + 8, cartY + 14, '#232f3e', 10, '800');
                drawText(`boAt - ${formatPrice(products[0].price)}`, pad + 8, cartY + 27, '#374151', 8, '600');
                drawText(`Noise - ${formatPrice(products[1].price)}`, width * 0.45, cartY + 27, '#374151', 8, '600');
                drawText(`Total ${formatPrice(products[0].price + products[1].price)}`, width - 88, cartY + 14, '#111827', 9, '800');
            }

            const checkoutProgress = fade(t, 7350, 500);
            if (checkoutProgress > 0) {
                ctx.globalAlpha = checkoutProgress;
                roundRect(width - 132, height - 27, 116, 19, 9);
                ctx.fillStyle = '#ffd814';
                ctx.fill();
                ctx.strokeStyle = '#fcd200';
                ctx.stroke();
                drawText('Proceed to checkout', width - 124, height - 14, '#111827', 8, '800');
                ctx.globalAlpha = 1;
            }

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const ResilientViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        const skillTokens = [];

        const tokenWords = ['Python', 'NLP', 'Azure', 'SQL', 'API', 'ML'];

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            skillTokens.length = 0;
        };
        init();
        window.addEventListener('resize', init);

        let tick = 0;
        let scanY = 30;
        let tokenIdx = 0;

        const render = () => {
            tick++;
            const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bg.addColorStop(0, '#0b1320');
            bg.addColorStop(1, '#1f2937');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const docX = canvas.width * 0.08;
            const docY = canvas.height * 0.12;
            const docW = canvas.width * 0.33;
            const docH = canvas.height * 0.75;

            // Resume paper
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(docX, docY, docW, docH);
            ctx.fillStyle = '#cbd5e1';
            for (let i = 0; i < 9; i++) {
                const y = docY + 24 + i * 18;
                ctx.fillRect(docX + 12, y, docW - 24 - (i % 3) * 22, 3);
            }

            scanY += 1.3;
            if (scanY > docY + docH) scanY = docY;
            const scanGrad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
            scanGrad.addColorStop(0, 'rgba(14, 165, 233, 0)');
            scanGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.5)');
            scanGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(docX, scanY - 10, docW, 20);

            if (tick % 28 === 0) {
                skillTokens.push({
                    x: docX + docW + 8,
                    y: scanY,
                    tx: canvas.width * 0.62 + Math.random() * 42,
                    ty: canvas.height * 0.24 + Math.random() * 84,
                    label: tokenWords[tokenIdx % tokenWords.length],
                    t: 0
                });
                tokenIdx++;
            }

            skillTokens.forEach((token, i) => {
                token.t += 0.03;
                if (token.t > 1) {
                    skillTokens.splice(i, 1);
                    return;
                }
                const x = token.x + (token.tx - token.x) * token.t;
                const y = token.y + (token.ty - token.y) * token.t;
                ctx.fillStyle = `rgba(125, 211, 252, ${1 - token.t * 0.2})`;
                ctx.fillRect(x - 2, y - 8, token.label.length * 7 + 8, 16);
                ctx.fillStyle = '#0f172a';
                ctx.font = '10px monospace';
                ctx.fillText(token.label, x + 2, y + 3);
            });

            // ATS ring
            const ringX = canvas.width * 0.73;
            const ringY = canvas.height * 0.35;
            const score = 76 + Math.sin(tick * 0.05) * 8;
            const progress = Math.max(0.1, Math.min(0.95, score / 100));

            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
            ctx.beginPath();
            ctx.arc(ringX, ringY, 42, 0, Math.PI * 2);
            ctx.stroke();

            const ringGradient = ctx.createLinearGradient(ringX - 42, ringY, ringX + 42, ringY);
            ringGradient.addColorStop(0, '#06b6d4');
            ringGradient.addColorStop(1, '#22c55e');
            ctx.strokeStyle = ringGradient;
            ctx.beginPath();
            ctx.arc(ringX, ringY, 42, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
            ctx.stroke();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`${Math.round(score)} ATS`, ringX - 30, ringY + 5);

            ctx.fillStyle = '#93c5fd';
            ctx.font = '10px monospace';
            ctx.fillText('Role Match: Data/AI Engineer', canvas.width * 0.52, canvas.height * 0.66);
            ctx.fillStyle = '#a7f3d0';
            ctx.fillText('Interview Qs Generated', canvas.width * 0.52, canvas.height * 0.74);

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export const RecipeMixerViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        let startTime = performance.now();

        const pantryItems = [
            { label: 'tomato', color: '#fee2e2', text: '#991b1b' },
            { label: 'onion', color: '#f3e8ff', text: '#6b21a8' },
            { label: 'garlic', color: '#fef3c7', text: '#92400e' },
            { label: 'chicken', color: '#ffedd5', text: '#9a3412' },
            { label: 'rice', color: '#dcfce7', text: '#166534' }
        ];

        const recipeCards = [
            { name: 'Chicken Bowl', match: 92, icon: '#f97316' },
            { name: 'Tomato Soup', match: 84, icon: '#ef4444' },
            { name: 'Fried Rice', match: 78, icon: '#22c55e' }
        ];

        const missingItems = ['olive oil', 'paprika', 'lemon'];
        const nutritionBars = [
            { label: 'Protein', value: 74, color: '#16a34a' },
            { label: 'Carbs', value: 62, color: '#65a30d' },
            { label: 'Fat', value: 36, color: '#f97316' },
            { label: 'Calories', value: 82, color: '#0f766e' }
        ];

        const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
        const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
        const fade = (time, start, duration) => clamp((time - start) / duration);
        const roundRect = (x, y, w, h, r) => {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
        };
        const drawText = (text, x, y, color = '#14532d', size = 10, weight = '600') => {
            ctx.fillStyle = color;
            ctx.font = `${weight} ${size}px Arial, sans-serif`;
            ctx.fillText(text, x, y);
        };
        const drawBagIcon = (x, y, color = '#991b1b') => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y + 3, 7, 7);
            ctx.beginPath();
            ctx.arc(x + 3.5, y + 3, 2.4, Math.PI, 0);
            ctx.stroke();
        };

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };

        init();
        window.addEventListener('resize', init);

        const render = () => {
            const loopDuration = 8800;
            const t = (performance.now() - startTime) % loopDuration;
            const width = canvas.width;
            const height = canvas.height;
            const pad = 11;

            ctx.clearRect(0, 0, width, height);
            const bg = ctx.createLinearGradient(0, 0, width, height);
            bg.addColorStop(0, '#f7fee7');
            bg.addColorStop(0.52, '#ffffff');
            bg.addColorStop(1, '#dcfce7');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Pantry loaded from database.
            roundRect(pad, 12, width - pad * 2, 42, 8);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
            ctx.fill();
            ctx.strokeStyle = '#bbf7d0';
            ctx.stroke();
            drawText('My Pantry', pad + 9, 28, '#14532d', 12, '800');
            drawText('PostgreSQL sync', width - 92, 28, '#16a34a', 8, '700');

            pantryItems.forEach((item, i) => {
                const progress = easeOut((t - i * 300) / 300);
                if (progress <= 0) return;
                const pillW = 50 + item.label.length * 2;
                const step = (width - pad * 2 - 68) / (pantryItems.length - 1);
                const x = pad + 8 + i * step;
                const y = 34 + (1 - progress) * 8;
                ctx.globalAlpha = progress;
                roundRect(x, y, pillW, 15, 8);
                ctx.fillStyle = item.color;
                ctx.fill();
                drawText(item.label, x + 8, y + 11, item.text, 8, '700');
                ctx.globalAlpha = 1;
            });

            // API status bar.
            const statusAlpha = fade(t, 1500, 400);
            ctx.globalAlpha = statusAlpha;
            roundRect(pad, 61, width - pad * 2, 20, 6);
            ctx.fillStyle = '#ecfdf5';
            ctx.fill();
            ctx.stroke();
            const dots = '.'.repeat(Math.floor((t / 260) % 4));
            drawText(`Fetching matching recipes from MealDB${dots}`, pad + 9, 75, '#14532d', 9, '800');
            ctx.globalAlpha = 1;

            // Recipe cards slide in.
            const cardY = 90;
            const cardGap = 8;
            const cardW = (width - pad * 2 - cardGap * 2) / 3;
            recipeCards.forEach((recipe, i) => {
                const progress = easeOut((t - (2300 + i * 250)) / 500);
                if (progress <= 0) return;
                const x = pad + i * (cardW + cardGap);
                const y = cardY + (1 - progress) * 18;
                ctx.globalAlpha = progress;
                roundRect(x, y, cardW, 54, 8);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = i === 0 && t > 3850 ? '#16a34a' : '#bbf7d0';
                ctx.lineWidth = i === 0 && t > 3850 ? 2 : 1;
                ctx.stroke();

                ctx.fillStyle = recipe.icon;
                ctx.beginPath();
                ctx.arc(x + 17, y + 18, 9, 0, Math.PI * 2);
                ctx.fill();
                drawText(recipe.name, x + 31, y + 18, '#14532d', 8, '800');
                drawText(`${recipe.match}% match`, x + 31, y + 33, '#15803d', 8, '700');
                ctx.fillStyle = '#dcfce7';
                ctx.fillRect(x + 9, y + 42, (cardW - 18) * recipe.match / 100, 4);
                ctx.globalAlpha = 1;
            });

            // Groq AI missing-ingredient panel.
            const groqProgress = easeOut((t - 3900) / 650);
            if (groqProgress > 0) {
                const panelX = pad;
                const panelY = 149;
                const panelW = width * 0.56;
                const panelH = 42 * groqProgress;
                roundRect(panelX, panelY, panelW, panelH, 8);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = '#86efac';
                ctx.stroke();
                ctx.save();
                ctx.beginPath();
                ctx.rect(panelX, panelY, panelW, panelH);
                ctx.clip();
                drawText('Groq AI: Missing ingredients', panelX + 8, panelY + 14, '#166534', 9, '800');
                missingItems.forEach((item, i) => {
                    const itemProgress = fade(t, 4550 + i * 220, 240);
                    if (itemProgress <= 0) return;
                    const pillW = 52;
                    const x = panelX + 8 + i * 55;
                    const y = panelY + 23;
                    ctx.globalAlpha = itemProgress;
                    roundRect(x, y, pillW, 14, 7);
                    ctx.fillStyle = '#fff7ed';
                    ctx.fill();
                    ctx.strokeStyle = '#f87171';
                    ctx.stroke();
                    drawBagIcon(x + 5, y + 2);
                    drawText(item, x + 16, y + 10, '#991b1b', 7, '700');
                    ctx.globalAlpha = 1;
                });
                ctx.restore();
            }

            // Nutrition chart.
            const nutriProgress = easeOut((t - 5600) / 650);
            if (nutriProgress > 0) {
                const chartX = width * 0.61;
                const chartY = 146;
                const chartW = width * 0.34;
                ctx.globalAlpha = nutriProgress;
                roundRect(chartX, chartY, chartW, 48, 8);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
                ctx.fill();
                ctx.strokeStyle = '#bbf7d0';
                ctx.stroke();
                drawText('Nutrition Info', chartX + 8, chartY + 13, '#14532d', 9, '800');
                nutritionBars.forEach((bar, i) => {
                    const y = chartY + 21 + i * 7;
                    const barProgress = easeOut((t - (5900 + i * 160)) / 500);
                    ctx.fillStyle = '#e5e7eb';
                    ctx.fillRect(chartX + 56, y - 4, chartW - 66, 4);
                    ctx.fillStyle = bar.color;
                    ctx.fillRect(chartX + 56, y - 4, (chartW - 66) * (bar.value / 100) * barProgress, 4);
                    drawText(bar.label, chartX + 8, y, '#365314', 7, '700');
                });
                ctx.globalAlpha = 1;
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};
