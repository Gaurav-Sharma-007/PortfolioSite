import React, { useEffect, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ImpactGraph = ({ label, value, prefix = "", suffix = "%", color = "#646cff" }) => {
    const [ref, isVisible] = useScrollAnimation(0.2);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (isVisible) {
            // Delay slightly to let the container fade in first
            const timer = setTimeout(() => {
                setWidth(value);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, value]);

    return (
        <div ref={ref} className="impact-graph-container">
            <div className="impact-header">
                <span className="impact-label">{label}</span>
                <span className="impact-value" style={{ color: color }}>
                    {prefix}{width}{suffix}
                </span>
            </div>
            <div className="impact-track">
                <div
                    className="impact-bar"
                    style={{
                        width: `${width}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}80`
                    }}
                >
                    <div className="vehicle-wrapper">
                        {/* Rocket / Vehicle Icon */}
                        <svg
                            viewBox="0 0 24 24"
                            className="vehicle-icon"
                            style={{ fill: color }}
                        >
                            <path d="M2.5 19.6L3.8 20.2C3.8 20.2 6 21.5 7.6 18.6L12.7 9.3L15.6 16.5C15.6 16.5 16 17.5 17.1 17.5C18.2 17.5 18.6 16.5 18.6 16.5L21.5 9.3L22.9 5.8L2.5 19.6Z" />
                            <path d="M14.5 5.5C14.5 6.9 13.4 8 12 8C10.6 8 9.5 6.9 9.5 5.5C9.5 4.1 10.6 3 12 3C13.4 3 14.5 4.1 14.5 5.5Z" />
                            <path d="M12 11L9.5 17.5L4.5 20.5L12 11Z" fillOpacity="0.5" />
                        </svg>
                        {/* Thrust effect */}
                        <div className="thrust" style={{ borderRightColor: color }}></div>
                    </div>
                </div>
            </div>

            <style>{`
                .impact-graph-container {
                    margin-bottom: 1.5rem;
                    width: 100%;
                }

                .impact-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .impact-track {
                    width: 100%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    overflow: visible; /* Allow vehicle to pop out */
                    position: relative;
                }

                .impact-bar {
                    height: 100%;
                    border-radius: 4px;
                    transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
                    position: relative;
                    width: 0%;
                }

                .vehicle-wrapper {
                    position: absolute;
                    right: -12px;
                    top: 50%;
                    transform: translateY(-50%) rotate(90deg); /* Rotate for rightward movement */
                    width: 24px;
                    height: 24px;
                    z-index: 2;
                }

                .vehicle-icon {
                    width: 100%;
                    height: 100%;
                    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
                }

                .thrust {
                    position: absolute;
                    top: 100%; /* Behind the rocket since rotated */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0; 
                    height: 0; 
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-top: 10px solid orange; /* Acts as thrust because rotated */
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                /* Show thrust only when moving roughly - precise targeting hard with simple CSS, 
                   so we just animate generic opacity or keep it visible */
                .impact-bar[style*="width: 0%"] .thrust {
                    opacity: 0;
                }
                
                .impact-bar:not([style*="width: 0%"]) .thrust {
                     animation: flicker 0.1s infinite;
                     opacity: 1;
                }
                
                /* Once graph settles (approx 1.5s), hide thrust. 
                   Since we can't detect "settled" easily in CSS alone without complex class logic,
                   we'll let it keep burning or use keyframes to fade it out. 
                   For now, constant burn implies "high speed performance". 
                */

                @keyframes flicker {
                    0% { border-top-width: 8px; opacity: 0.8; }
                    50% { border-top-width: 12px; opacity: 1; }
                    100% { border-top-width: 8px; opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default ImpactGraph;
