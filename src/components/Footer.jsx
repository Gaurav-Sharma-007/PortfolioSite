import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Footer = () => {
    const { email, socials, name } = portfolioData;
    const [ripples, setRipples] = useState([]);
    const btnRef = useRef(null);
    const [headingRef, headingVisible] = useScrollAnimation(0.2);
    const [contentRef, contentVisible] = useScrollAnimation(0.2);
    const currentYear = new Date().getFullYear();

    const handleRipple = useCallback((e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { id, x, y }]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 700);
    }, []);

    return (
        <footer className="ft-footer" id="contact">
            {/* Animated gradient divider */}
            <div className="ft-divider" />

            <div className="ft-content">
                <h2
                    ref={headingRef}
                    className={`ft-heading fade-in-section ${headingVisible ? 'is-visible' : ''}`}
                >
                    <span className="gradient-text">Let's Connect</span>
                </h2>

                <p
                    ref={contentRef}
                    className={`ft-description fade-in-section ${contentVisible ? 'is-visible' : ''}`}
                >
                    Interested in working together, have a question, or just want to say hi?
                    <br />
                    I'm always open to discussing new projects, creative ideas, or opportunities.
                </p>

                {/* Say Hello button with ripple */}
                <div className={`ft-btn-wrapper fade-in-section delay-200 ${contentVisible ? 'is-visible' : ''}`}>
                    <a
                        ref={btnRef}
                        href={`mailto:${email}`}
                        className="ft-cta-btn"
                        onClick={handleRipple}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: '-3px' }}>
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        Say Hello
                        {ripples.map((ripple) => (
                            <span
                                key={ripple.id}
                                className="ft-ripple"
                                style={{
                                    left: ripple.x,
                                    top: ripple.y,
                                }}
                            />
                        ))}
                    </a>
                </div>

                {/* Social icons */}
                <div className={`ft-socials fade-in-section delay-300 ${contentVisible ? 'is-visible' : ''}`}>
                    {/* LinkedIn */}
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="LinkedIn" title="LinkedIn">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a href={socials.github} target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="GitHub" title="GitHub">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                    </a>

                    {/* Kaggle */}
                    <a href={socials.kaggle} target="_blank" rel="noopener noreferrer" className="ft-social-icon" aria-label="Kaggle" title="Kaggle">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.013.27-.095.361l-6.555 6.344 6.836 8.507c.095.104.117.208.07.312z"/>
                        </svg>
                    </a>
                </div>

                {/* Copyright */}
                <div className={`ft-copyright fade-in-section delay-400 ${contentVisible ? 'is-visible' : ''}`}>
                    <span className="ft-copyright-line" />
                    <p>
                        © <span className="ft-year">{currentYear}</span> {name}. Crafted with passion & code.
                    </p>
                </div>
            </div>

            <style>{`
                .ft-footer {
                    position: relative;
                    padding: 0 2rem 4rem;
                    text-align: center;
                    margin-top: 0;
                    background: linear-gradient(
                        180deg,
                        transparent 0%,
                        rgba(100, 108, 255, 0.02) 30%,
                        rgba(100, 108, 255, 0.05) 100%
                    );
                }

                /* Animated gradient divider */
                .ft-divider {
                    width: 100%;
                    height: 2px;
                    margin-bottom: 4rem;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        var(--accent-color),
                        var(--accent-hover),
                        var(--accent-color),
                        transparent
                    );
                    background-size: 200% 100%;
                    animation: ft-shimmer 3s ease-in-out infinite;
                    border-radius: 2px;
                }

                @keyframes ft-shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .ft-content {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .ft-heading {
                    font-family: var(--font-heading);
                    font-size: 2.4rem;
                    margin-bottom: 1rem;
                }

                .ft-description {
                    color: var(--text-secondary);
                    font-size: 1.05rem;
                    line-height: 1.7;
                    margin-bottom: 2.5rem;
                }

                /* CTA Button with ripple */
                .ft-btn-wrapper {
                    margin-bottom: 3rem;
                }

                .ft-cta-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
                    color: white;
                    padding: 1rem 2.8rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    font-family: var(--font-heading);
                    text-decoration: none;
                    transition: all 0.3s var(--transition-bounce, ease);
                    box-shadow: 0 4px 20px var(--accent-glow, rgba(100, 108, 255, 0.4));
                    overflow: hidden;
                    cursor: pointer;
                }

                .ft-cta-btn:hover {
                    color: white;
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 8px 30px var(--accent-glow, rgba(100, 108, 255, 0.6));
                }

                .ft-cta-btn:active {
                    transform: translateY(-1px) scale(0.98);
                }

                .ft-ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.35);
                    width: 10px;
                    height: 10px;
                    transform: translate(-50%, -50%) scale(0);
                    animation: ft-ripple-anim 0.7s ease-out forwards;
                    pointer-events: none;
                }

                @keyframes ft-ripple-anim {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(40);
                        opacity: 0;
                    }
                }

                /* Social icons */
                .ft-socials {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                .ft-social-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-secondary);
                    transition: all 0.3s var(--transition-bounce, ease);
                    text-decoration: none;
                }

                .ft-social-icon:hover {
                    color: var(--accent-color);
                    border-color: var(--accent-color);
                    background: rgba(100, 108, 255, 0.08);
                    transform: translateY(-4px) scale(1.08);
                    box-shadow: 0 6px 20px var(--accent-glow, rgba(100, 108, 255, 0.3));
                }

                .ft-social-icon:active {
                    transform: translateY(-2px) scale(1.02);
                }

                /* Copyright */
                .ft-copyright {
                    position: relative;
                }

                .ft-copyright-line {
                    display: block;
                    width: 60px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0 auto 1.5rem;
                }

                .ft-copyright p {
                    font-size: 0.82rem;
                    color: rgba(255, 255, 255, 0.3);
                    letter-spacing: 0.03em;
                }

                .ft-year {
                    color: var(--accent-color);
                    font-weight: 600;
                }

                @media (max-width: 480px) {
                    .ft-heading {
                        font-size: 1.8rem;
                    }

                    .ft-cta-btn {
                        padding: 0.9rem 2rem;
                        font-size: 1rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
