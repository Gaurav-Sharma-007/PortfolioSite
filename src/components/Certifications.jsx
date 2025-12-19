import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Certifications = () => {
    const { certifications } = portfolioData;
    const [ref, isVisible] = useScrollAnimation();

    return (
        <section id="certifications" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <h2>Certifications</h2>
            <div className="cert-grid">
                {certifications.map((cert, index) => (
                    <a
                        key={index}
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-card"
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div className="cert-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="var(--accent-color)" fillOpacity="0.4" />
                                <path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="var(--accent-color)" strokeWidth="2" />
                                <path d="M21 12C21 13.6569 19.6569 15 18 15C16.3431 15 15 13.6569 15 12C15 10.3431 16.3431 9 18 9C19.6569 9 21 10.3431 21 12Z" stroke="var(--accent-color)" strokeWidth="2" />
                                <path d="M12 3V9" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 15V21" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className="cert-title">{cert.name}</h3>
                    </a>
                ))}
            </div>

            <style>{`
                .cert-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .cert-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    padding: 2rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .cert-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    border-color: var(--accent-color);
                }

                .cert-icon {
                    background: rgba(100, 108, 255, 0.1);
                    padding: 1rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cert-title {
                    font-size: 1.1rem;
                    margin: 0;
                    color: var(--text-primary);
                    font-weight: 500;
                    line-height: 1.4;
                }
            `}</style>
        </section>
    );
};

export default Certifications;
