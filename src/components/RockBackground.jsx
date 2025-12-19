import React, { useEffect, useRef } from 'react';

const RockBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // SVG Paths for instruments (simplified)
        const guitarPath = new Path2D("M6 2L6 14C4.3 14 3 15.3 3 17C3 18.7 4.3 20 6 20C7.7 20 9 18.7 9 17L9 5L15 5L15 14C13.3 14 12 15.3 12 17C12 18.7 13.3 20 15 20C16.7 20 18 18.7 18 17L18 2L6 2Z");
        const drumPath = new Path2D("M12 2C6.48 2 2 4.01 2 6.5C2 8.99 6.48 11 12 11C17.52 11 22 8.99 22 6.5C22 4.01 17.52 2 12 2ZM12 13C6.48 13 2 10.99 2 8.5V15.5C2 17.99 6.48 20 12 20C17.52 20 22 17.99 22 15.5V8.5C22 10.99 17.52 13 12 13Z");
        const notePath = new Path2D("M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V6H18V3H12Z");

        const particles = [];
        const numParticles = 70; // Increased density

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 0.9 + 0.6, // Slightly larger
                speedY: Math.random() * 0.5 + 0.2,
                speedX: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 1.5,
                type: Math.random() > 0.4 ? 'guitar' : (Math.random() > 0.5 ? 'drum' : 'note'), // 60% Guitars
                color: Math.random() > 0.5 ? '#646cff' : '#ff4444',
                pulse: Math.random() * Math.PI
            });
        }

        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Dark space/stage gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#050505');
            gradient.addColorStop(1, '#110a1a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                p.pulse += 0.05;

                if (p.y > height + 50) p.y = -50;
                if (p.x > width + 50) p.x = -50;
                if (p.x < -50) p.x = width + 50;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);

                // Beat effect for drums/guitars
                const scale = p.size + Math.sin(p.pulse) * 0.1;
                ctx.scale(scale, scale);

                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1;

                ctx.globalAlpha = 0.25; // Increased visibility

                if (p.type === 'guitar') {
                    ctx.stroke(guitarPath);
                    ctx.fill(guitarPath);
                } else if (p.type === 'drum') {
                    ctx.stroke(drumPath);
                    ctx.fill(drumPath);
                } else {
                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = p.color;
                    ctx.fill(notePath);
                }

                ctx.restore();
            });

            // "Star" sparkles logic
            if (Math.random() > 0.95) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default RockBackground;
