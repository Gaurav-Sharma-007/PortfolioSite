import React, { useRef, useEffect } from 'react';

const ThankYouCar = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 120;
        };
        init();
        window.addEventListener('resize', init);

        let rocketX = -150;
        const rocketY = canvas.height / 2;
        let particles = [];
        let animationId;

        const createParticles = (x, y) => {
            // 1. High-speed blue thrust core
            for (let i = 0; i < 5; i++) {
                particles.push({
                    x: x,
                    y: y + (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 2) * 8 - 5, // Fast backward thrust
                    vy: (Math.random() - 0.5) * 2,
                    life: 1.0,
                    decay: 0.08,
                    size: Math.random() * 4 + 2,
                    color: `rgba(100, 200, 255, ${Math.random() * 0.5 + 0.5})`, // Electric Blue
                    type: 'thrust'
                });
            }
            // 2. Voluminous Smoke
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: x - 20,
                    y: y + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 1) * 3 - 2,
                    vy: (Math.random() - 0.5) * 3,
                    life: 1.0,
                    decay: 0.015,
                    size: Math.random() * 10 + 5,
                    color: `rgba(100, 100, 120, 0.4)`,
                    type: 'smoke'
                });
            }
            // 3. Occasional Sparks
            if (Math.random() > 0.5) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 1) * 10 - 5,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.0,
                    decay: 0.03,
                    size: 2,
                    color: '#ffaa00',
                    type: 'spark'
                });
            }
        };

        const drawRocket = (x, y) => {
            ctx.save();
            ctx.translate(x, y);

            // Engine Glow
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#4facfe';

            // Main Fuselage - Metallic Gradient
            const bodyGrad = ctx.createLinearGradient(-40, -10, 40, 10);
            bodyGrad.addColorStop(0, '#2a2a2a');
            bodyGrad.addColorStop(0.5, '#e0e0e0');
            bodyGrad.addColorStop(1, '#2a2a2a');

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cockpit Window - Glassy Glow
            const windowGrad = ctx.createRadialGradient(20, -5, 2, 20, -5, 10);
            windowGrad.addColorStop(0, '#ffffff');
            windowGrad.addColorStop(0.5, '#646cff');
            windowGrad.addColorStop(1, '#000000');

            ctx.fillStyle = windowGrad;
            ctx.beginPath();
            ctx.ellipse(20, -5, 12, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Rear Fins - Sharp and darker
            ctx.fillStyle = '#1a1a1a';
            // Top Fin
            ctx.beginPath();
            ctx.moveTo(-20, -10);
            ctx.lineTo(-45, -25);
            ctx.lineTo(-10, -5);
            ctx.fill();
            // Bottom Fin
            ctx.beginPath();
            ctx.moveTo(-20, 10);
            ctx.lineTo(-45, 25);
            ctx.lineTo(-10, 5);
            ctx.fill();

            // Engine Nozzle
            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.moveTo(-40, -8);
            ctx.lineTo(-55, -12);
            ctx.lineTo(-55, 12);
            ctx.lineTo(-40, 8);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.restore();
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Particles
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life > 0) {
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    particles.splice(i, 1);
                }
            });

            // 2. Update & Draw Rocket
            if (rocketX < canvas.width + 150) {
                rocketX += 12; // Faster premium speed
                createParticles(rocketX - 55, rocketY);
            } else {
                if (rocketX > canvas.width + 100) {
                    setTimeout(() => {
                        if (rocketX > canvas.width) rocketX = -150;
                    }, 2500);
                }
            }

            drawRocket(rocketX, rocketY);

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };

    }, []);

    return (
        <div style={{ width: '100%', padding: '0 0', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '120px', display: 'block' }} />
        </div>
    );
};

export default ThankYouCar;
