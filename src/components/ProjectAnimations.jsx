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

