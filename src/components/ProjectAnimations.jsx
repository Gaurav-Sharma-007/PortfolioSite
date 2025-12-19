import React, { useEffect, useRef } from 'react';

export const AlzheimerViz = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationId;
        const particles = [];

        // Setup brain particles
        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            particles.length = 0;
            for (let i = 0; i < 150; i++) {
                // Random point in oval shape
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 60;
                // Squish y to make it look like a brain side profile roughly
                const x = centerX + Math.cos(angle) * (radius * 1.2);
                const y = centerY + Math.sin(angle) * (radius * 0.9);

                particles.push({
                    x, y,
                    baseX: x, baseY: y,
                    size: Math.random() * 2 + 1,
                    active: false
                });
            }
        };

        init();
        window.addEventListener('resize', init);

        let scanY = 0;

        const render = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Scan line movement
            scanY = (scanY + 2) % canvas.height;

            particles.forEach(p => {
                // Check if scan line is near
                const dist = Math.abs(p.y - scanY);
                if (dist < 20) {
                    ctx.fillStyle = '#00ff88'; // Active/Scanned
                    p.size = 3;
                } else {
                    ctx.fillStyle = '#333'; // Inactive
                    p.size = 1.5;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw scan line
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(canvas.width, scanY);
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

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

        let users = [];
        let animationId;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        init();
        window.addEventListener('resize', init);

        const spawnUser = () => {
            users.push({
                x: 0,
                y: Math.random() * (canvas.height - 40) + 20,
                speed: Math.random() * 2 + 1,
                churned: false,
                color: '#00ff88' // Start green (retained)
            });
        };

        const render = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Spawn loop
            if (Math.random() > 0.95) spawnUser();

            const threshold = canvas.width * 0.6; // Churn point

            users.forEach((u, index) => {
                u.x += u.speed;

                // Check churn logic
                if (!u.churned && u.x > threshold) {
                    if (Math.random() > 0.7) { // 30% Churn rate approx
                        u.churned = true;
                        u.color = '#ff4444';
                    }
                }

                if (u.churned) {
                    u.y += 1; // Drop off
                }

                // Draw user
                ctx.fillStyle = u.color;
                ctx.beginPath();
                ctx.arc(u.x, u.y, 3, 0, Math.PI * 2);
                ctx.fill();

                // Remove off-screen
                if (u.x > canvas.width || u.y > canvas.height) {
                    users.splice(index, 1);
                }
            });

            // Draw Threshold Line
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(threshold, 0);
            ctx.lineTo(threshold, canvas.height);
            ctx.strokeStyle = '#444';
            ctx.stroke();
            ctx.setLineDash([]);

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

        let x = 0;
        const points = [];

        const render = () => {
            // Fade effect
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            x += 3;
            if (x > canvas.width) x = 0;

            // Heartbeat line simulation
            let y = canvas.height / 2;
            if (x % 100 > 40 && x % 100 < 60) {
                y -= Math.sin((x % 100 - 40) * 0.3) * 40;
            }

            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationId); };
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
