import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Volunteering = () => {
    const { volunteering } = portfolioData;
    const [ref, isVisible] = useScrollAnimation();

    return (
        <section id="volunteering" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <h2>Volunteering</h2>
            <div className="volunteering-grid">
                {volunteering.map((vol) => (
                    <div key={vol.id} className="vol-card">
                        <div className="vol-header">
                            <div className="header-text">
                                <h3>{vol.role}</h3>
                                <span className="vol-org">{vol.organization}</span>
                            </div>
                            <span className="vol-period">{vol.period}</span>
                        </div>
                        <span className="vol-category">{vol.category}</span>
                        <p className="vol-desc">{vol.description}</p>
                    </div>
                ))}
            </div>

            <style>{`
                .volunteering-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .vol-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    padding: 2rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .vol-card:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 10px 30px rgba(0,255,136, 0.1);
                    border-color: #00ff88;
                }

                .vol-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #00ff88; /* Green for Robin Hood Army vibe */
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                    transform-origin: bottom;
                }

                .vol-card:hover::before {
                    transform: scaleY(1);
                }

                .vol-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .header-text h3 {
                    margin: 0;
                    font-size: 1.3rem;
                    color: var(--text-primary);
                }

                .vol-org {
                    color: #00ff88;
                    font-weight: 500;
                    font-size: 1rem;
                }

                .vol-period {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    background: rgba(255,255,255,0.05);
                    padding: 0.3rem 0.6rem;
                    border-radius: 20px;
                    white-space: nowrap;
                }

                .vol-category {
                    display: inline-block;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    border: 1px solid var(--border-color);
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }

                .vol-desc {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    font-size: 0.95rem;
                }
            `}</style>
        </section>
    );
};

export default Volunteering;
