import React, { useRef, useEffect, useState } from 'react';

const ThankYouCar = () => {
    const canvasRef = useRef(null);
    const [showText, setShowText] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const textTriggeredRef = useRef(false);

    // Typewriter effect
    useEffect(() => {
        if (!showText) return;
        const fullText = 'Thanks for visiting!';
        let i = 0;
        setDisplayedText('');
        const interval = setInterval(() => {
            i++;
            setDisplayedText(fullText.slice(0, i));
            if (i >= fullText.length) clearInterval(interval);
        }, 65);
        return () => clearInterval(interval);
    }, [showText]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const init = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 150;
        };
        init();
        window.addEventListener('resize', init);

        let rocketX = -150;
        const rocketBaseY = canvas.height / 2 + 5;
        let particles = [];
        let stars = [];
        let trail = [];
        let animationId;
        let frameCount = 0;

        // Generate background stars
        const generateStars = () => {
            stars = [];
            for (let i = 0; i < 60; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.8 + 0.3,
                    twinkleSpeed: Math.random() * 0.03 + 0.01,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: ['#a78bfa', '#f472b6', '#fbbf24', '#818cf8', '#c084fc'][Math.floor(Math.random() * 5)]
                });
            }
        };
        generateStars();

        const themeColors = [
            { r: 167, g: 139, b: 250 },  // purple  #a78bfa
            { r: 244, g: 114, b: 182 },   // pink    #f472b6
            { r: 251, g: 191, b: 36 },    // amber   #fbbf24
            { r: 129, g: 140, b: 248 },   // indigo  #818cf8
            { r: 192, g: 132, b: 252 },   // violet  #c084fc
        ];

        const createParticles = (x, y) => {
            // 1. Themed thrust core particles
            for (let i = 0; i < 6; i++) {
                const c = themeColors[Math.floor(Math.random() * themeColors.length)];
                particles.push({
                    x: x,
                    y: y + (Math.random() - 0.5) * 5,
                    vx: (Math.random() - 2) * 9 - 5,
                    vy: (Math.random() - 0.5) * 2.5,
                    life: 1.0,
                    decay: 0.06 + Math.random() * 0.03,
                    size: Math.random() * 5 + 2,
                    color: `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.random() * 0.5 + 0.5})`,
                    type: 'thrust'
                });
            }

            // 2. Voluminous purple-toned smoke
            for (let i = 0; i < 4; i++) {
                const purpleSmoke = Math.random() > 0.5;
                particles.push({
                    x: x - 20,
                    y: y + (Math.random() - 0.5) * 12,
                    vx: (Math.random() - 1) * 3.5 - 2,
                    vy: (Math.random() - 0.5) * 3.5,
                    life: 1.0,
                    decay: 0.012 + Math.random() * 0.005,
                    size: Math.random() * 14 + 6,
                    color: purpleSmoke
                        ? `rgba(139, 92, 246, 0.35)`
                        : `rgba(100, 100, 130, 0.35)`,
                    type: 'smoke'
                });
            }

            // 3. Sparks with theme colors
            if (Math.random() > 0.4) {
                const sparkColors = ['#fbbf24', '#f472b6', '#a78bfa', '#34d399'];
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 1) * 12 - 5,
                    vy: (Math.random() - 0.5) * 12,
                    life: 1.0,
                    decay: 0.025 + Math.random() * 0.01,
                    size: Math.random() * 2 + 1,
                    color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
                    type: 'spark'
                });
            }

            // 4. Trail segment (gradient fade)
            trail.push({
                x: x,
                y: y,
                life: 1.0,
                decay: 0.02
            });
        };

        const drawStars = () => {
            stars.forEach(star => {
                const alpha = 0.4 + 0.6 * Math.abs(Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset));
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Sparkle cross for larger stars
                if (star.size > 1.2) {
                    ctx.strokeStyle = star.color;
                    ctx.lineWidth = 0.4;
                    ctx.globalAlpha = alpha * 0.5;
                    const len = star.size * 2;
                    ctx.beginPath();
                    ctx.moveTo(star.x - len, star.y);
                    ctx.lineTo(star.x + len, star.y);
                    ctx.moveTo(star.x, star.y - len);
                    ctx.lineTo(star.x, star.y + len);
                    ctx.stroke();
                }

                ctx.restore();
            });
        };

        const drawTrail = () => {
            for (let i = trail.length - 1; i >= 0; i--) {
                const t = trail[i];
                t.life -= t.decay;
                if (t.life <= 0) {
                    trail.splice(i, 1);
                    continue;
                }
                ctx.save();
                const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 8);
                grad.addColorStop(0, `rgba(139, 92, 246, ${t.life * 0.3})`);
                grad.addColorStop(0.5, `rgba(167, 139, 250, ${t.life * 0.15})`);
                grad.addColorStop(1, `rgba(139, 92, 246, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        };

        const drawRocket = (x, y) => {
            ctx.save();
            ctx.translate(x, y);

            // Engine Glow — purple/pink
            ctx.shadowBlur = 35;
            ctx.shadowColor = '#a78bfa';

            // Main Fuselage — purple-to-pink gradient
            const bodyGrad = ctx.createLinearGradient(-45, -12, 45, 12);
            bodyGrad.addColorStop(0, '#6d28d9');
            bodyGrad.addColorStop(0.3, '#8b5cf6');
            bodyGrad.addColorStop(0.5, '#c084fc');
            bodyGrad.addColorStop(0.7, '#e879f9');
            bodyGrad.addColorStop(1, '#a855f7');

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Fuselage highlight stripe
            ctx.shadowBlur = 0;
            const stripeGrad = ctx.createLinearGradient(-40, -4, 40, -4);
            stripeGrad.addColorStop(0, 'rgba(255,255,255,0)');
            stripeGrad.addColorStop(0.3, 'rgba(255,255,255,0.15)');
            stripeGrad.addColorStop(0.7, 'rgba(255,255,255,0.15)');
            stripeGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = stripeGrad;
            ctx.beginPath();
            ctx.ellipse(0, -3, 42, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cockpit Window — glowing accent color
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#818cf8';

            const windowGrad = ctx.createRadialGradient(22, -4, 1, 22, -4, 11);
            windowGrad.addColorStop(0, '#ffffff');
            windowGrad.addColorStop(0.35, '#a5b4fc');
            windowGrad.addColorStop(0.6, '#818cf8');
            windowGrad.addColorStop(1, '#4f46e5');

            ctx.fillStyle = windowGrad;
            ctx.beginPath();
            ctx.ellipse(22, -4, 12, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Window shine
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.ellipse(25, -7, 4, 2, -0.4, 0, Math.PI * 2);
            ctx.fill();

            // Rear Fins — dark with purple tint
            const finGrad = ctx.createLinearGradient(-45, -25, -10, 0);
            finGrad.addColorStop(0, '#1e1b4b');
            finGrad.addColorStop(1, '#312e81');

            ctx.fillStyle = finGrad;
            // Top Fin
            ctx.beginPath();
            ctx.moveTo(-20, -10);
            ctx.lineTo(-48, -28);
            ctx.lineTo(-10, -5);
            ctx.closePath();
            ctx.fill();
            // Bottom Fin
            ctx.beginPath();
            ctx.moveTo(-20, 10);
            ctx.lineTo(-48, 28);
            ctx.lineTo(-10, 5);
            ctx.closePath();
            ctx.fill();

            // Engine Nozzle — darker with glow
            const nozzleGrad = ctx.createLinearGradient(-40, 0, -58, 0);
            nozzleGrad.addColorStop(0, '#4c1d95');
            nozzleGrad.addColorStop(1, '#1e1b4b');
            ctx.fillStyle = nozzleGrad;
            ctx.beginPath();
            ctx.moveTo(-40, -9);
            ctx.lineTo(-58, -14);
            ctx.lineTo(-58, 14);
            ctx.lineTo(-40, 9);
            ctx.closePath();
            ctx.fill();

            // Inner nozzle glow
            ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
            ctx.beginPath();
            ctx.moveTo(-45, -5);
            ctx.lineTo(-56, -8);
            ctx.lineTo(-56, 8);
            ctx.lineTo(-45, 5);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frameCount++;

            // 1. Background stars
            drawStars();

            // 2. Trail
            drawTrail();

            // 3. Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life > 0) {
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;

                    if (p.type === 'spark') {
                        // Spark glow
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = p.color;
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * (p.type === 'smoke' ? (2 - p.life) : 1), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    particles.splice(i, 1);
                }
            }

            // 4. Rocket movement — continuous loop
            const rocketY = rocketBaseY + Math.sin(frameCount * 0.04) * 4;

            if (rocketX < canvas.width + 160) {
                rocketX += 3.5;
                createParticles(rocketX - 58, rocketY);

                // Trigger text when rocket passes center
                if (!textTriggeredRef.current && rocketX >= canvas.width * 0.45) {
                    textTriggeredRef.current = true;
                    setShowText(true);
                }
            } else {
                // Reset for continuous loop
                rocketX = -150;
                textTriggeredRef.current = false;
                setShowText(false);
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
        <div style={{ width: '100%', padding: 0, overflow: 'hidden', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '150px', display: 'block' }}
            />

            {/* Typewriter text overlay */}
            <div
                className={`thankyou-text ${showText ? 'thankyou-text--visible' : ''}`}
            >
                {displayedText}
                <span className="thankyou-cursor">|</span>
            </div>

            <style>{`
                .thankyou-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: var(--font-heading, 'Inter', sans-serif);
                    font-size: 1.4rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    background: linear-gradient(135deg, #a78bfa, #f472b6, #fbbf24);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: none;
                    filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.4));
                }

                .thankyou-text--visible {
                    opacity: 1;
                }

                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }

                .thankyou-cursor {
                    animation: blink 0.8s step-end infinite;
                    background: linear-gradient(135deg, #a78bfa, #f472b6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-left: 1px;
                }

                @media (max-width: 600px) {
                    .thankyou-text {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ThankYouCar;
