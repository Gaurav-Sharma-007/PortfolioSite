import React, { useRef, useEffect, useState } from 'react';
import { useIsInViewport, usePerformancePreferences } from '../hooks/usePerformancePreferences';

const ThankYouCar = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const perfProfile = usePerformancePreferences();
    const isNearViewport = useIsInViewport(containerRef, '300px');

    useEffect(() => {
        if (!isNearViewport || perfProfile.reducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const maxFps = perfProfile.lowPower ? 24 : 60;
        const frameInterval = 1000 / maxFps;
        let lastFrame = 0;
        let isDocumentVisible = !document.hidden;

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 250; // Increased height to allow smoke bleeding
        };
        init();
        window.addEventListener('resize', init);
        const handleVisibility = () => {
            isDocumentVisible = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibility);

        let rocketX = -150;
        const rocketBaseY = canvas.height / 2 + 5;
        let particles = [];
        let stars = [];
        let animationId;
        let frameCount = 0;

        // Generate background stars
        const generateStars = () => {
            stars = [];
            const starCount = perfProfile.lowPower ? 30 : 60;
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: ['#ffffff', '#a5b4fc', '#fbcfe8', '#fef08a'][Math.floor(Math.random() * 4)]
                });
            }
        };
        generateStars();

        const createParticles = (x, y) => {
            // High-velocity thrust core (white/blue)
            const thrustCount = perfProfile.lowPower ? 2 : 4;
            for (let i = 0; i < thrustCount; i++) {
                particles.push({
                    x: x,
                    y: y + (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 2) * 12 - 6,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1.0,
                    decay: 0.05 + Math.random() * 0.04,
                    size: Math.random() * 4 + 2,
                    color: Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(129, 140, 248, 0.8)',
                    type: 'thrust'
                });
            }

            // Expanding smoke cloud (dark grey to purple)
            const smokeCount = perfProfile.lowPower ? 1 : 2;
            for (let i = 0; i < smokeCount; i++) {
                particles.push({
                    x: x - 10,
                    y: y + (Math.random() - 0.5) * 8,
                    vx: (Math.random() - 1) * 4 - 2,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1.0,
                    decay: 0.01 + Math.random() * 0.005,
                    size: Math.random() * 15 + 8,
                    color: Math.random() > 0.4 ? 'rgba(75, 85, 99, 0.4)' : 'rgba(139, 92, 246, 0.3)',
                    type: 'smoke'
                });
            }

            // Fiery sparks (orange/yellow)
            if (Math.random() > 0.3) {
                particles.push({
                    x: x,
                    y: y + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 1) * 15 - 5,
                    vy: (Math.random() - 0.5) * 8,
                    life: 1.0,
                    decay: 0.03 + Math.random() * 0.02,
                    size: Math.random() * 2 + 1,
                    color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
                    type: 'spark'
                });
            }
        };

        const drawStars = () => {
            stars.forEach(star => {
                const alpha = 0.3 + 0.7 * Math.abs(Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset));
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = star.color;
                ctx.shadowBlur = star.size > 1 ? 4 : 0;
                ctx.shadowColor = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        };

        const drawRocket = (x, y) => {
            ctx.save();
            ctx.translate(x, y);

            // Ground/Ambient Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(-5, 25, 45, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Main Fuselage (Metallic realistic)
            const bodyGrad = ctx.createLinearGradient(-45, -12, 45, 12);
            bodyGrad.addColorStop(0, '#e2e8f0');
            bodyGrad.addColorStop(0.4, '#ffffff');
            bodyGrad.addColorStop(0.6, '#cbd5e1');
            bodyGrad.addColorStop(1, '#64748b');

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Fuselage shading & panel lines
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-20, -11);
            ctx.lineTo(-20, 11);
            ctx.moveTo(10, -11);
            ctx.lineTo(10, 11);
            ctx.stroke();

            // Nose cone accent (Red/Orange)
            const noseGrad = ctx.createLinearGradient(35, -10, 50, 10);
            noseGrad.addColorStop(0, '#f87171');
            noseGrad.addColorStop(1, '#b91c1c');
            ctx.fillStyle = noseGrad;
            ctx.beginPath();
            ctx.moveTo(35, -8.5);
            ctx.quadraticCurveTo(50, 0, 50, 0);
            ctx.quadraticCurveTo(50, 0, 35, 8.5);
            ctx.closePath();
            ctx.fill();

            // Cockpit Window (Glowing Cyan)
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#06b6d4';
            const windowGrad = ctx.createRadialGradient(20, -3, 1, 20, -3, 8);
            windowGrad.addColorStop(0, '#cffafe');
            windowGrad.addColorStop(0.5, '#22d3ee');
            windowGrad.addColorStop(1, '#0891b2');

            ctx.fillStyle = windowGrad;
            ctx.beginPath();
            ctx.ellipse(20, -4, 10, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Window shine reflection
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.ellipse(22, -6, 4, 1.5, -0.2, 0, Math.PI * 2);
            ctx.fill();

            // Engine Nozzle (Dark metallic)
            const nozzleGrad = ctx.createLinearGradient(-40, -15, -40, 15);
            nozzleGrad.addColorStop(0, '#334155');
            nozzleGrad.addColorStop(0.5, '#0f172a');
            nozzleGrad.addColorStop(1, '#334155');
            ctx.fillStyle = nozzleGrad;
            ctx.beginPath();
            ctx.moveTo(-45, -8);
            ctx.lineTo(-58, -12);
            ctx.lineTo(-58, 12);
            ctx.lineTo(-45, 8);
            ctx.closePath();
            ctx.fill();

            // Inner Engine Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#3b82f6';
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.ellipse(-56, 0, 4, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Fins (Dark with sharp edges)
            const finGrad = ctx.createLinearGradient(-40, -30, -10, 0);
            finGrad.addColorStop(0, '#1e293b');
            finGrad.addColorStop(1, '#475569');

            ctx.fillStyle = finGrad;
            // Top Fin
            ctx.beginPath();
            ctx.moveTo(-15, -10);
            ctx.lineTo(-35, -28);
            ctx.lineTo(-45, -28);
            ctx.lineTo(-35, -8);
            ctx.closePath();
            ctx.fill();
            // Bottom Fin
            ctx.beginPath();
            ctx.moveTo(-15, 10);
            ctx.lineTo(-35, 28);
            ctx.lineTo(-45, 28);
            ctx.lineTo(-35, 8);
            ctx.closePath();
            ctx.fill();

            // Accent Glow Light (bottom belly)
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ef4444';
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(-5, 11, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const render = (timestamp = 0) => {
            animationId = requestAnimationFrame(render);
            if (!isDocumentVisible) return;
            if (timestamp - lastFrame < frameInterval) return;
            lastFrame = timestamp - ((timestamp - lastFrame) % frameInterval);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frameCount++;

            drawStars();

            // Update & Draw Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life > 0) {
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;

                    if (p.type === 'spark' || p.type === 'thrust') {
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = p.color;
                    }

                    ctx.beginPath();
                    // Smoke expands as it ages
                    const currentSize = p.type === 'smoke' ? p.size * (2 - p.life) : p.size;
                    ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    particles.splice(i, 1);
                }
            }

            // Rocket Flight Path (Sine wave)
            const rocketY = rocketBaseY + Math.sin(frameCount * 0.05) * 4;

            if (rocketX < canvas.width + 150) {
                rocketX += perfProfile.lowPower ? 12 : 18;
                createParticles(rocketX - 55, rocketY);
            } else {
                // Loop
                rocketX = -150;
            }

            drawRocket(rocketX, rocketY);
        };

        animationId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', init);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [isNearViewport, perfProfile.lowPower, perfProfile.reducedMotion]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '150px', padding: 0, position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    left: 0, 
                    width: '100%', 
                    height: '250px', 
                    display: 'block',
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            />

            <style>{`
            `}</style>
        </div>
    );
};

export default ThankYouCar;
