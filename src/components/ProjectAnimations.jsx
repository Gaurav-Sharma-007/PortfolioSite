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

            modules.forEach((m, i) => {
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

        const render = () => {
            ctx.fillStyle = '#050510'; // Deep night sky
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            for (let i = 0; i < 10; i++) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fillRect(i * 50 + 20, 20 + (i % 3) * 10, 1, 1);
            }

            waveOffset += 0.05;
            const waterLevel = canvas.height * 0.65;

            // Massive Iceberg (Jagged & Ominous)
            const iceX = canvas.width * 0.75;
            ctx.fillStyle = '#e0f7fa';
            ctx.beginPath();
            // Base (Extend below water)
            ctx.moveTo(iceX - 50, waterLevel + 20);
            ctx.lineTo(iceX - 40, waterLevel - 10);
            ctx.lineTo(iceX, waterLevel - 120); // Taller peak
            ctx.lineTo(iceX + 20, waterLevel - 80);
            ctx.lineTo(iceX + 50, waterLevel - 130); // Second complex peak
            ctx.lineTo(iceX + 100, waterLevel + 20);
            ctx.closePath();
            ctx.fill();

            // Iceberg Reflection/Shadow (Subtle)
            ctx.fillStyle = 'rgba(200, 240, 255, 0.1)';
            ctx.beginPath();
            ctx.moveTo(iceX - 50, waterLevel + 20);
            ctx.lineTo(iceX + 100, waterLevel + 20);
            ctx.lineTo(iceX + 20, waterLevel + 80);
            ctx.fill();

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

            // Hull (Black & Red)
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(120, 0); // Decent length
            ctx.lineTo(110, 30);
            ctx.lineTo(10, 30);
            ctx.fill();

            // Red bottom trim
            ctx.fillStyle = '#5e0a0a';
            ctx.fillRect(10, 25, 100, 5);

            // Superstructure (White decks)
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(15, -15, 80, 15); // Main deck
            ctx.fillRect(25, -25, 60, 10); // Upper deck

            // Funnels (Iconic Yellow/Black)
            const drawFunnel = (x) => {
                ctx.fillStyle = '#e6bf00'; // Gold
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
            ctx.fillStyle = '#ffeb3b'; // Yellow light
            for (let i = 20; i < 100; i += 10) {
                if (Math.random() > 0.1) ctx.fillRect(i, 8, 2, 2);
                if (Math.random() > 0.1) ctx.fillRect(i + 5, 18, 2, 2);
            }

            ctx.restore();

            // Draw Ocean Waves
            ctx.fillStyle = 'rgba(0, 100, 200, 0.6)';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(0, waterLevel);

            for (let i = 0; i <= canvas.width; i += 10) {
                ctx.lineTo(i, waterLevel + Math.sin(i * 0.02 + waveOffset) * 5);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

            // Foreground Wave Layer (Parallax)
            ctx.fillStyle = 'rgba(0, 80, 180, 0.8)';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            const frontWaterLevel = waterLevel + 15;
            ctx.lineTo(0, frontWaterLevel);
            for (let i = 0; i <= canvas.width; i += 15) {
                ctx.lineTo(i, frontWaterLevel + Math.sin(i * 0.03 + waveOffset * 1.5) * 8);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

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
        const ctx = canvas.getContext('2d');
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        let startTime = null;
        const LOOP_DURATION = 7000;

        const render = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % LOOP_DURATION) / LOOP_DURATION;
            const timeS = progress * 7;

            const w = canvas.width;
            const h = canvas.height;

            // --- REALISTIC ENVIRONMENT ---

            // Wall Gradient (Daylight/Ambient)
            const wallGrad = ctx.createLinearGradient(0, 0, w, h);
            wallGrad.addColorStop(0, '#d8d8e8');
            wallGrad.addColorStop(1, '#a0a0b0');
            ctx.fillStyle = wallGrad;
            ctx.fillRect(0, 0, w, h);

            // Floor
            const floorH = h * 0.3;
            ctx.fillStyle = '#6d4c41'; // Wood
            ctx.fillRect(0, h - floorH, w, floorH);

            // Window (Back Wall - Left Center)
            const winX = w * 0.15;
            const winY = h * 0.15;
            const winW = 100;
            const winH = 80;

            // Window Frame
            ctx.fillStyle = '#fff';
            ctx.fillRect(winX - 5, winY - 5, winW + 10, winH + 10);

            // Sky outside
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(winX, winY, winW, winH);

            // Clouds (Moving slowly)
            const cloudX = (timestamp * 0.01) % (winW + 40) - 20;
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath(); ctx.arc(winX + cloudX, winY + 20, 15, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(winX + cloudX + 10, winY + 15, 12, 0, Math.PI * 2); ctx.fill();

            // Glass Reflection/Shine
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath(); ctx.moveTo(winX, winY + winH); ctx.lineTo(winX + winW, winY); ctx.lineTo(winX + winW, winY + 20); ctx.lineTo(winX + 20, winY + winH); ctx.fill();

            // Window Bars
            ctx.fillStyle = '#fff';
            ctx.fillRect(winX + winW / 2 - 2, winY, 4, winH);
            ctx.fillRect(winX, winY + winH / 2 - 2, winW, 4);

            // Curtains (Red Velvet)
            ctx.fillStyle = '#800020';
            // Left Curtain
            ctx.beginPath(); ctx.moveTo(winX - 10, winY - 10);
            ctx.bezierCurveTo(winX - 20, winY + winH / 2, winX + 10, winY + winH / 2, winX + 5, winY + winH + 10);
            ctx.lineTo(winX - 15, winY + winH + 10); ctx.lineTo(winX - 15, winY - 10); ctx.fill();
            // Right Curtain
            ctx.beginPath(); ctx.moveTo(winX + winW + 10, winY - 10);
            ctx.bezierCurveTo(winX + winW + 20, winY + winH / 2, winX + winW - 10, winY + winH / 2, winX + winW - 5, winY + winH + 10);
            ctx.lineTo(winX + winW + 15, winY + winH + 10); ctx.lineTo(winX + winW + 15, winY - 10); ctx.fill();

            // Light Ray from Window
            const rayGrad = ctx.createLinearGradient(winX + winW / 2, winY + winH / 2, winX - 50, h);
            rayGrad.addColorStop(0, 'rgba(255, 255, 200, 0.15)');
            rayGrad.addColorStop(1, 'rgba(255, 255, 200, 0)');
            ctx.fillStyle = rayGrad;
            ctx.beginPath(); ctx.moveTo(winX, winY + winH); ctx.lineTo(winX + winW, winY + winH);
            ctx.lineTo(winX + winW + 100, h); ctx.lineTo(winX - 50, h); ctx.fill();

            // --- ANIMATION STATE ---
            let bellyGrowth = 0;
            let armState = 0;
            let fallAngle = 0;
            let isUnconscious = false;
            let candies = [];

            if (timeS < 5.5) {
                bellyGrowth = (timeS / 5.5) * 22;
                armState = Math.sin(timeS * Math.PI * 2.5) > 0 ? 1 : 0;
            } else if (timeS < 7) {
                bellyGrowth = 22;
                isUnconscious = true;

                // Physics: Drop & Bounce
                const t = (timeS - 5.5) / 1.5; // Normalized time 0-1
                // Ease In Quad for gravity feel + Bounce at end
                if (t < 0.4) {
                    fallAngle = (t / 0.4) * (Math.PI / 4); // Fast drop to 45 deg
                } else if (t < 0.7) {
                    // Bounce back slightly
                    const bounceT = (t - 0.4) / 0.3;
                    fallAngle = (Math.PI / 4) - Math.sin(bounceT * Math.PI) * 0.1;
                } else {
                    // Settle
                    fallAngle = (Math.PI / 4);
                }
            }

            // --- TV (Running Horse) ---
            const tvX = w * 0.72;
            const tvY = h * 0.50;
            const tvW = 80;
            const tvH = 50;

            // TV Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.filter = 'blur(6px)';
            ctx.fillRect(tvX + 5, tvY + 5, tvW, tvH + 20);
            ctx.filter = 'none';

            // Stand
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(tvX + 25, tvY + tvH, 30, 15);
            ctx.fillStyle = '#111';
            ctx.fillRect(tvX, tvY, tvW, tvH);

            // Content
            ctx.save();
            ctx.beginPath(); ctx.rect(tvX + 2, tvY + 2, tvW - 4, tvH - 4); ctx.clip();
            if (timeS > 6.8) {
                ctx.fillStyle = '#000'; ctx.fillRect(tvX, tvY, tvW, tvH);
            } else {
                // Background
                ctx.fillStyle = '#87CEEB'; ctx.fillRect(tvX, tvY, tvW, tvH);
                ctx.fillStyle = '#4CAF50'; ctx.fillRect(tvX, tvY + 25, tvW, 25);

                // Scrolling Forest Trees (Taller & Dense)
                const scrollX = (timestamp * 0.08) % 60;
                ctx.fillStyle = '#1b5e20'; // Dark Green forest
                for (let i = 0; i < 4; i++) {
                    const treeX = tvX + (i * 30) - scrollX;
                    if (treeX > tvX - 20 && treeX < tvX + tvW + 20) {
                        ctx.beginPath();
                        ctx.moveTo(treeX, tvY + tvH);
                        ctx.lineTo(treeX + 6, tvY + 5); // Trunk top (Much Taller)
                        ctx.lineTo(treeX - 10, tvY + 30); // Leaves L
                        ctx.lineTo(treeX + 6, tvY + 15);
                        ctx.lineTo(treeX + 22, tvY + 30); // Leaves R
                        ctx.lineTo(treeX + 6, tvY + 5);
                        ctx.lineTo(treeX + 12, tvY + tvH);
                        ctx.fill();
                    }
                }

                // Horse Shadow
                const horseY = tvY + 32 + Math.sin(timestamp * 0.02) * 1.5;
                const hx = tvX + 35;
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.beginPath(); ctx.ellipse(hx + 8, horseY + 14, 12, 3, 0, 0, Math.PI * 2); ctx.fill();

                // Horse (Premium Detailed Shape)
                // Using gradient for definition and 3D look
                const horseGrad = ctx.createLinearGradient(hx, horseY - 10, hx, horseY + 10);
                horseGrad.addColorStop(0, '#5d4037'); // Brown
                horseGrad.addColorStop(1, '#3e2723'); // Darker Brown
                ctx.fillStyle = horseGrad;

                ctx.beginPath();
                // Hindquarters
                ctx.arc(hx, horseY + 2, 5, 0, Math.PI * 2);
                // Body
                ctx.moveTo(hx, horseY - 1);
                ctx.quadraticCurveTo(hx + 8, horseY - 2, hx + 15, horseY); // Back
                ctx.lineTo(hx + 14, horseY + 6); // Belly back
                ctx.lineTo(hx + 2, horseY + 5); // Belly front
                // Chest/Neck
                ctx.moveTo(hx + 15, horseY);
                ctx.quadraticCurveTo(hx + 14, horseY - 6, hx + 18, horseY - 8); // Neck top
                ctx.lineTo(hx + 19, horseY - 5); // Head Join
                // Head
                ctx.moveTo(hx + 18, horseY - 8);
                ctx.lineTo(hx + 22, horseY - 6); // Forehead
                ctx.lineTo(hx + 23, horseY - 3); // Nose
                ctx.lineTo(hx + 21, horseY - 2); // Jaw
                ctx.lineTo(hx + 18, horseY - 4); // Throat
                ctx.lineTo(hx + 15, horseY + 4); // Neck bottom
                ctx.fill();

                // Ears
                ctx.beginPath(); ctx.moveTo(hx + 19, horseY - 8); ctx.lineTo(hx + 20, horseY - 10); ctx.lineTo(hx + 21, horseY - 8); ctx.fill();

                // Mane (Flowing Black)
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.moveTo(hx + 18, horseY - 9);
                ctx.quadraticCurveTo(hx + 16, horseY - 4, hx + 18, horseY + 2);
                ctx.lineTo(hx + 16, horseY); // Taper
                ctx.fill();

                // Tail (Flowing Black)
                ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(hx, horseY); ctx.quadraticCurveTo(hx - 8, horseY - 5, hx - 10, horseY + 2 + Math.sin(timestamp * 0.03) * 3); ctx.stroke();

                // Legs (Articulated - 2 Phases)
                ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                const t = timestamp * 0.025;

                // Back Far
                ctx.beginPath(); ctx.moveTo(hx + 1, horseY + 3);
                ctx.lineTo(hx - 2 + Math.cos(t) * 4, horseY + 8 + Math.sin(t));
                ctx.lineTo(hx - 4 + Math.cos(t) * 4, horseY + 12); ctx.stroke();

                // Front Far
                ctx.beginPath(); ctx.moveTo(hx + 13, horseY + 4);
                ctx.lineTo(hx + 15 + Math.cos(t + 0.5) * 4, horseY + 7 + Math.sin(t + 0.5));
                ctx.lineTo(hx + 14 + Math.cos(t + 0.5) * 4, horseY + 11); ctx.stroke();

                // Back Near
                ctx.strokeStyle = '#5d4037'; // Lighter for depth
                ctx.beginPath(); ctx.moveTo(hx + 1, horseY + 3);
                ctx.lineTo(hx + Math.cos(t + 3) * 4, horseY + 8 + Math.sin(t + 3));
                ctx.lineTo(hx - 1 + Math.cos(t + 3) * 4, horseY + 12); ctx.stroke();

                // Front Near
                ctx.beginPath(); ctx.moveTo(hx + 13, horseY + 4);
                ctx.lineTo(hx + 16 + Math.cos(t + 3.5) * 4, horseY + 6 + Math.sin(t + 3.5));
                ctx.lineTo(hx + 18 + Math.cos(t + 3.5) * 4, horseY + 10); ctx.stroke();
            }
            ctx.restore();

            // --- CHARACTER & COUCH ---
            const cx = w * 0.15 + 40; // Shifted slightly right due to window
            const cy = h * 0.60;

            // Couch
            ctx.fillStyle = '#b71c1c'; // Rich Red
            ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.beginPath(); ctx.roundRect(cx - 20, cy, 140, 50, 8); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#d32f2f'; ctx.beginPath(); ctx.roundRect(cx - 20, cy + 30, 140, 35, 8); ctx.fill();
            // Armrest
            ctx.fillStyle = '#800000'; ctx.beginPath(); ctx.roundRect(cx - 30, cy + 20, 20, 45, 8); ctx.fill();

            // Draw Man
            const manX = cx + 50;
            const manY = cy + 35;

            ctx.save();
            ctx.translate(manX, manY);
            if (isUnconscious) ctx.rotate(fallAngle);

            // Detailed Clothing (Realistic Jeans)
            ctx.fillStyle = '#1a237e'; // Dark Denim
            ctx.beginPath();
            ctx.moveTo(-5, -5); // Hip
            ctx.quadraticCurveTo(20, -8, 42, -2); // Thigh top gentle curve
            ctx.quadraticCurveTo(48, 2, 48, 15); // Knee cap roundness
            ctx.lineTo(50, 42); // Shin front (slight angle)
            ctx.lineTo(36, 42); // Ankle/Shin back
            ctx.quadraticCurveTo(34, 15, 30, 12); // Calf to Knee back
            ctx.lineTo(-5, 12); // Thigh bottom
            ctx.fill();

            // Shoes (Sneakers)
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(36, 42);
            ctx.lineTo(50, 42);
            ctx.quadraticCurveTo(62, 50, 62, 52); // Toe curve
            ctx.lineTo(60, 54); // Sole front
            ctx.lineTo(36, 54); // Sole back
            ctx.fill();
            // Laces/Detail
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(42, 42); ctx.lineTo(48, 45); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(44, 41); ctx.lineTo(50, 44); ctx.stroke();
            // Sole Line
            ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(36, 54); ctx.lineTo(60, 54); ctx.stroke();

            // Shirt (Button up)
            const bellyR = 22 + bellyGrowth;
            const shirtGrad = ctx.createRadialGradient(10, -25, 2, 10, -25, bellyR);
            shirtGrad.addColorStop(0, '#ffffff');
            shirtGrad.addColorStop(1, '#ddd');
            ctx.fillStyle = shirtGrad;
            ctx.beginPath(); ctx.ellipse(10, -25, bellyR, 28, 0, 0, Math.PI * 2); ctx.fill();

            // Buttons
            ctx.fillStyle = '#ccc';
            for (let i = 0; i < 3; i++) ctx.fillRect(15 + bellyGrowth * 0.8, -40 + i * 15, 3, 3);

            // Head
            ctx.fillStyle = '#eac086'; // Skin
            ctx.beginPath(); ctx.arc(10, -58, 14, 0, Math.PI * 2); ctx.fill();
            // Neck
            ctx.fillRect(2, -45, 16, 10);

            // Hair (Side part)
            ctx.fillStyle = '#3e2723';
            ctx.beginPath(); ctx.arc(10, -60, 15, Math.PI, 0.2);
            ctx.bezierCurveTo(25, -55, 25, -70, 8, -65); ctx.fill();

            // Face
            if (!isUnconscious) {
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(16, -60, 2, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#a1887f'; ctx.beginPath(); ctx.arc(22, -58, 3, 0, Math.PI * 2); ctx.fill(); // Nose
                // Mouth
                if (armState < 0.2) {
                    ctx.fillStyle = '#8a3a3a'; ctx.beginPath(); ctx.ellipse(18, -52, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
                } else {
                    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(18, -52, 4, 0, Math.PI * 2); ctx.fill();
                }
            } else {
                ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(13, -64); ctx.lineTo(19, -58); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(19, -64); ctx.lineTo(13, -58); ctx.stroke();
                ctx.fillStyle = 'pink'; ctx.beginPath(); ctx.arc(20, -48, 4, 0, Math.PI); ctx.fill();
            }

            // Arms
            ctx.strokeStyle = '#eac086'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath(); ctx.moveTo(8, -44);
            if (!isUnconscious) {
                if (armState > 0.5) ctx.quadraticCurveTo(40, -20, 25, -50);
                else ctx.quadraticCurveTo(35, -25, 25, -5);
            } else {
                ctx.quadraticCurveTo(35, -20, 35, 25); // Limp dangle
            }
            ctx.stroke();

            // Candy in Hand (only if awake)
            if (armState > 0.5 && !isUnconscious) {
                ctx.fillStyle = `hsl(${timeS * 120}, 100%, 50%)`;
                ctx.beginPath(); ctx.arc(25, -52, 4, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();

            // --- BOWL & SPILL PHYSICS ---

            // Bowl State
            let bowlX = manX + 15;
            let bowlY = manY;
            let bowlRot = 0;

            if (isUnconscious) {
                // Apply physics to bowl relative to man's fall
                // It falls off the lap
                const fallTime = timeS - 5.5;
                if (fallTime > 0) {
                    bowlX += fallTime * 40; // Slide right
                    bowlY += fallTime * fallTime * 150; // Accelerate down
                    bowlRot = fallTime * 5; // Spin
                }

                // Spawn candies once
                if (candies.length === 0 && timestamp % 100 < 20) { // Burst spawn
                    for (let i = 0; i < 20; i++) {
                        candies.push({
                            x: bowlX, y: bowlY,
                            vx: (Math.random() - 0.2) * 10,
                            vy: (Math.random() - 1) * 5,
                            color: `hsl(${Math.random() * 360}, 100%, 50%)`
                        });
                    }
                }
            } else {
                // Reset candies when awake
                if (candies.length > 0) candies.length = 0;
            }

            // Draw Bowl
            ctx.save();
            ctx.translate(bowlX, bowlY);
            ctx.rotate(bowlRot);
            ctx.fillStyle = '#eee'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI, true); ctx.fill(); ctx.shadowBlur = 0;
            // Gold rim/Inside
            ctx.fillStyle = isUnconscious ? '#d4af37' : 'gold'; // Darker inside if tipped?
            ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();

            // Pile inside (disappears if tipping)
            if (!isUnconscious || bowlRot < 1) {
                ctx.fillStyle = 'orange';
                ctx.beginPath(); ctx.arc(0, -2, 8, 0, Math.PI, true); ctx.fill();
            }
            ctx.restore();

            // Draw Spilled Candies
            candies.forEach(c => {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.5; // Gravity

                // Floor bounce
                if (c.y > h - 10) {
                    c.y = h - 10;
                    c.vy *= -0.6; // Dampen
                    c.vx *= 0.9;  // Friction
                }

                ctx.fillStyle = c.color;
                ctx.beginPath(); ctx.arc(c.x, c.y, 3, 0, Math.PI * 2); ctx.fill();
            });

            // Couch Armrest (Right - Foreground)
            ctx.fillStyle = '#800000'; ctx.beginPath(); ctx.roundRect(cx + 125, cy + 20, 15, 45, 8); ctx.fill();

            // --- UI ---
            const uiX = w - 110; const uiY = 30;
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.beginPath(); ctx.roundRect(uiX - 15, uiY - 20, 115, 55, 8); ctx.fill();

            let glucose = 85 + (timeS / 5.5) * 350;
            if (isUnconscious) glucose = 450;

            ctx.textAlign = 'right';
            ctx.font = 'bold 18px monospace';
            ctx.fillStyle = glucose > 200 ? (timestamp % 200 < 100 ? '#ff3333' : '#aa0000') : '#33ff33';
            ctx.fillText(Math.floor(glucose), uiX + 85, uiY);

            ctx.font = '10px sans-serif'; ctx.fillStyle = '#ccc';
            ctx.fillText("mg/dL", uiX + 85, uiY + 18);
            ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
            ctx.fillText("GLUCOSE", uiX - 5, uiY - 5);

            if (isUnconscious) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.sin(timestamp * 0.1) * 0.1);
                ctx.font = '900 30px Arial'; ctx.textAlign = 'center';
                ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6;
                ctx.strokeText("SUGAR CRASH!", 0, 0); ctx.fillText("SUGAR CRASH!", 0, 0);
                ctx.restore();
            }

            animationId = requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        return () => { window.removeEventListener('resize', init); if (animationId) cancelAnimationFrame(animationId); }
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const pulsePoints = [
            { id: 'pdf', x: 0.15, y: 0.78, color: '#38bdf8', label: 'PDF' },
            { id: 'embed', x: 0.35, y: 0.32, color: '#f59e0b', label: 'Bedrock' },
            { id: 'vector', x: 0.56, y: 0.7, color: '#22d3ee', label: 'S3 Vec' },
            { id: 'agent', x: 0.75, y: 0.35, color: '#34d399', label: 'Agent' },
            { id: 'ui', x: 0.9, y: 0.68, color: '#60a5fa', label: 'Chat' }
        ];

        const links = [
            ['pdf', 'embed'],
            ['embed', 'vector'],
            ['vector', 'agent'],
            ['agent', 'ui']
        ];

        const particles = [];

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };

        const point = (id) => {
            const p = pulsePoints.find((n) => n.id === id);
            return { x: p.x * canvas.width, y: p.y * canvas.height, color: p.color, label: p.label };
        };

        init();
        window.addEventListener('resize', init);

        let tick = 0;
        let linkIndex = 0;

        const render = () => {
            tick++;

            const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bg.addColorStop(0, '#06121e');
            bg.addColorStop(1, '#0f1b2d');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Top market chart
            const chartY = canvas.height * 0.44;
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const y = chartY - 50 + i * 28;
                ctx.beginPath();
                ctx.moveTo(20, y);
                ctx.lineTo(canvas.width - 20, y);
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.lineWidth = 2.2;
            ctx.strokeStyle = '#22d3ee';
            for (let x = 24; x < canvas.width - 24; x += 6) {
                const t = (x / 44) + tick * 0.05;
                const y = chartY + Math.sin(t) * 16 + Math.cos(t * 0.7) * 8;
                if (x === 24) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#22d3ee';
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Candles
            for (let i = 0; i < 18; i++) {
                const x = 28 + i * ((canvas.width - 56) / 18);
                const wave = Math.sin((tick * 0.04) + i) * 14;
                const open = chartY + wave;
                const close = chartY + wave + Math.sin((tick * 0.06) + i * 1.4) * 12;
                const high = Math.min(open, close) - (8 + Math.abs(Math.cos(i)) * 7);
                const low = Math.max(open, close) + (8 + Math.abs(Math.sin(i)) * 7);
                const up = close < open;
                ctx.strokeStyle = up ? '#34d399' : '#f97316';
                ctx.beginPath();
                ctx.moveTo(x, high);
                ctx.lineTo(x, low);
                ctx.stroke();

                ctx.fillStyle = up ? '#10b981' : '#ea580c';
                ctx.fillRect(x - 3, Math.min(open, close), 6, Math.max(4, Math.abs(close - open)));
            }

            // Network links
            links.forEach(([fromId, toId], idx) => {
                const from = point(fromId);
                const to = point(toId);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(125, 211, 252, ${0.2 + (idx % 2) * 0.15})`;
                ctx.lineWidth = 1.5;
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            });

            if (tick % 22 === 0) {
                const edge = links[linkIndex];
                const from = point(edge[0]);
                const to = point(edge[1]);
                particles.push({ from, to, t: 0, speed: 0.026 });
                linkIndex = (linkIndex + 1) % links.length;
            }

            particles.forEach((p, i) => {
                p.t += p.speed;
                if (p.t >= 1.02) {
                    particles.splice(i, 1);
                    return;
                }

                const x = p.from.x + (p.to.x - p.from.x) * p.t;
                const y = p.from.y + (p.to.y - p.from.y) * p.t;
                ctx.fillStyle = '#e0f2fe';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#7dd3fc';
                ctx.beginPath();
                ctx.arc(x, y, 2.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Nodes + labels
            pulsePoints.forEach((p, idx) => {
                const px = p.x * canvas.width;
                const py = p.y * canvas.height;
                const pulse = 0.5 + Math.sin(tick * 0.08 + idx) * 0.4;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 14;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(px, py, 6 + pulse * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
                ctx.font = '10px monospace';
                ctx.fillText(p.label, px - 16, py - 12);
            });

            ctx.fillStyle = '#93c5fd';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('NIFTY +1.8%  RELIANCE +0.9%  TCS -0.4%', 16, 16);

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
