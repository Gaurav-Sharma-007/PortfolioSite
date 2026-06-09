import React from 'react';
import { portfolioData } from '../data';
import { useStaggerAnimation } from '../hooks/useScrollAnimation';

const HeartIcon = () => (
    <svg
        className="vol-heart-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
    >
        <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="var(--success-color)"
        />
    </svg>
);

const Volunteering = () => {
    const { volunteering } = portfolioData;
    const [ref, isVisible, getDelay] = useStaggerAnimation(0.1, 150);

    return (
        <section id="volunteering" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <h2>Volunteering</h2>
            <div className="vol-grid">
                {volunteering.map((vol, index) => (
                    <div
                        key={vol.id}
                        className={`vol-card glass-card fade-in-section ${isVisible ? 'is-visible' : ''}`}
                        style={getDelay(index)}
                    >
                        {/* Green left border accent */}
                        <div className="vol-border-accent" />

                        <div className="vol-card-header">
                            <div className="vol-icon-wrap">
                                <HeartIcon />
                            </div>
                            <div className="vol-header-text">
                                <h3 className="vol-role">{vol.role}</h3>
                                <span className="vol-org">{vol.organization}</span>
                            </div>
                            <span className="vol-period">{vol.period}</span>
                        </div>

                        <div className="vol-tags">
                            <span className="vol-category">{vol.category}</span>
                        </div>

                        <p className="vol-desc">{vol.description}</p>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes heartbeat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    14% {
                        transform: scale(1.2);
                    }
                    28% {
                        transform: scale(1);
                    }
                    42% {
                        transform: scale(1.15);
                    }
                    56% {
                        transform: scale(1);
                    }
                }

                .vol-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                    gap: 2rem;
                }

                .vol-card {
                    position: relative;
                    background: var(--card-bg);
                    backdrop-filter: blur(var(--glass-blur, 12px));
                    -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 2rem 2rem 2rem 2.5rem;
                    overflow: hidden;
                    transition:
                        transform var(--transition-speed, 0.3s) var(--transition-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
                        box-shadow var(--transition-speed, 0.3s) var(--transition-smooth, ease);
                }

                .vol-card:hover {
                    transform: translateY(-8px) scale(1.015);
                    box-shadow: 0 10px 30px var(--success-glow);
                }

                /* Animated green left border */
                .vol-border-accent {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(to bottom, var(--success-color), #10b981);
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.4s var(--transition-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
                    border-radius: 4px 0 0 4px;
                }

                .vol-card:hover .vol-border-accent {
                    transform: scaleY(1);
                }

                /* Header layout */
                .vol-card-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }

                .vol-icon-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: rgba(52, 211, 153, 0.1);
                    border-radius: 12px;
                    flex-shrink: 0;
                }

                .vol-heart-icon {
                    animation: heartbeat 1.8s ease-in-out infinite;
                    filter: drop-shadow(0 0 6px var(--success-glow));
                }

                .vol-header-text {
                    flex: 1;
                    min-width: 0;
                }

                .vol-role {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.3rem;
                    font-family: var(--font-heading);
                    color: var(--text-primary);
                    line-height: 1.3;
                }

                .vol-org {
                    display: block;
                    color: var(--success-color);
                    font-weight: 600;
                    font-size: 1rem;
                    line-height: 1.4;
                }

                .vol-period {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    background: rgba(52, 211, 153, 0.08);
                    border: 1px solid rgba(52, 211, 153, 0.2);
                    padding: 0.3rem 0.75rem;
                    border-radius: 20px;
                    white-space: nowrap;
                    font-weight: 500;
                    flex-shrink: 0;
                    align-self: flex-start;
                    margin-top: 0.15rem;
                }

                /* Tags */
                .vol-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .vol-category {
                    display: inline-block;
                    font-size: 0.72rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                    color: var(--success-color);
                    border: 1px solid rgba(52, 211, 153, 0.25);
                    background: rgba(52, 211, 153, 0.06);
                    padding: 0.25rem 0.65rem;
                    border-radius: 6px;
                    transition: background 0.2s ease, border-color 0.2s ease;
                }

                .vol-card:hover .vol-category {
                    background: rgba(52, 211, 153, 0.12);
                    border-color: rgba(52, 211, 153, 0.4);
                }

                /* Description */
                .vol-desc {
                    color: var(--text-secondary);
                    line-height: 1.7;
                    font-size: 0.95rem;
                    font-family: var(--font-body);
                    margin: 0;
                }

                @media (max-width: 600px) {
                    .vol-grid {
                        grid-template-columns: 1fr;
                    }

                    .vol-card {
                        padding: 1.5rem 1.5rem 1.5rem 2rem;
                    }

                    .vol-card-header {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .vol-period {
                        align-self: flex-start;
                    }

                    .vol-role {
                        font-size: 1.15rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Volunteering;
