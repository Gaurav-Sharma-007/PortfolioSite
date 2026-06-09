import React, { useEffect, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ImpactGraph = ({ label, value, prefix = "", suffix = "%", color = "#646cff" }) => {
    const [ref, isVisible] = useScrollAnimation(0.2);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setWidth(value);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, value]);

    return (
        <div ref={ref} className="ig-container">
            <div className="ig-header">
                <span className="ig-label">{label}</span>
                <span className="ig-value" style={{ color: color }}>
                    {prefix}{width}{suffix}
                </span>
            </div>
            <div className="ig-track">
                <div
                    className="ig-bar"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, var(--accent-color), ${color})`,
                        boxShadow: `0 0 12px ${color}60, 0 0 4px ${color}40`,
                    }}
                >
                    {/* Glowing end-cap */}
                    <div className="ig-endcap" style={{
                        background: color,
                        boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80, 0 0 24px ${color}40`,
                    }} />

                    {/* Sparkle particles */}
                    <div className="ig-sparkle ig-sparkle-1" style={{ background: color }} />
                    <div className="ig-sparkle ig-sparkle-2" style={{ background: color }} />
                    <div className="ig-sparkle ig-sparkle-3" style={{ background: color }} />
                </div>
            </div>

            <style>{`
                .ig-container {
                    margin-bottom: 1.2rem;
                    width: 100%;
                }

                .ig-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .ig-label {
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .ig-value {
                    font-weight: 700;
                    font-family: var(--font-heading);
                    text-shadow: 0 0 8px currentColor;
                    transition: all 0.3s ease;
                }

                .ig-track {
                    width: 100%;
                    height: 8px;
                    background:
                        repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 3px,
                            rgba(255, 255, 255, 0.03) 3px,
                            rgba(255, 255, 255, 0.03) 6px
                        ),
                        rgba(255, 255, 255, 0.08);
                    border-radius: 6px;
                    overflow: visible;
                    position: relative;
                }

                .ig-bar {
                    height: 100%;
                    border-radius: 6px;
                    transition: width 1.8s cubic-bezier(0.22, 0.61, 0.36, 1);
                    position: relative;
                    width: 0%;
                    will-change: width;
                }

                .ig-endcap {
                    position: absolute;
                    right: -5px;
                    top: 50%;
                    transform: translateY(-50%) rotate(45deg);
                    width: 10px;
                    height: 10px;
                    border-radius: 2px;
                    animation: ig-pulse 2s ease-in-out infinite;
                    z-index: 3;
                    transition: opacity 0.3s ease 1.2s;
                }

                .ig-bar[style*="width: 0%"] .ig-endcap {
                    opacity: 0;
                }

                @keyframes ig-pulse {
                    0%, 100% {
                        transform: translateY(-50%) rotate(45deg) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-50%) rotate(45deg) scale(1.3);
                        opacity: 0.7;
                    }
                }

                /* Sparkle particles around end-cap */
                .ig-sparkle {
                    position: absolute;
                    right: -3px;
                    top: 50%;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    opacity: 0;
                    z-index: 2;
                    pointer-events: none;
                }

                .ig-bar:not([style*="width: 0%"]) .ig-sparkle {
                    opacity: 1;
                }

                .ig-sparkle-1 {
                    animation: ig-sparkle-orbit-1 2.2s ease-in-out infinite;
                }
                .ig-sparkle-2 {
                    animation: ig-sparkle-orbit-2 2.6s ease-in-out infinite;
                    width: 3px;
                    height: 3px;
                }
                .ig-sparkle-3 {
                    animation: ig-sparkle-orbit-3 3s ease-in-out infinite;
                    width: 2px;
                    height: 2px;
                }

                @keyframes ig-sparkle-orbit-1 {
                    0%, 100% { transform: translate(4px, -12px); opacity: 0.9; }
                    25% { transform: translate(10px, -4px); opacity: 0.5; }
                    50% { transform: translate(6px, 8px); opacity: 0.8; }
                    75% { transform: translate(-2px, 4px); opacity: 0.4; }
                }

                @keyframes ig-sparkle-orbit-2 {
                    0%, 100% { transform: translate(-6px, -8px); opacity: 0.7; }
                    33% { transform: translate(8px, 6px); opacity: 0.4; }
                    66% { transform: translate(12px, -6px); opacity: 0.9; }
                }

                @keyframes ig-sparkle-orbit-3 {
                    0%, 100% { transform: translate(2px, 10px); opacity: 0.6; }
                    50% { transform: translate(-4px, -10px); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default ImpactGraph;
