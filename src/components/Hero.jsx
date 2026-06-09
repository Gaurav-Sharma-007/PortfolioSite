import React, { useState, useEffect, useMemo } from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
  const { name, title, bio, socials } = portfolioData;
  const [ref, isVisible] = useScrollAnimation(0.05);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [titleDone, setTitleDone] = useState(false);
  const [bioVisible, setBioVisible] = useState(false);

  const bioWords = useMemo(() => bio.split(' '), [bio]);

  // Typing effect for title
  useEffect(() => {
    if (!isVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(title.slice(0, i));
      if (i >= title.length) {
        clearInterval(interval);
        setTitleDone(true);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [isVisible, title]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Show bio after title finishes
  useEffect(() => {
    if (titleDone) {
      const timeout = setTimeout(() => setBioVisible(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [titleDone]);

  const socialIcons = {
    linkedin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    github: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    kaggle: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.238-.034.27l-6.555 6.636 6.836 8.507c.095.118.116.211.073.336z"/>
      </svg>
    )
  };

  return (
    <header className="hero-section" ref={ref}>
      <div className="hero-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`hero-particle hero-particle-${i}`} />
        ))}
      </div>

      <div className={`hero-content ${isVisible ? 'hero-entered' : ''}`}>
        <div className="hero-name-wrapper">
          <h1 className="gradient-text hero-name">{name}</h1>
        </div>

        <div className="hero-title-line">
          <h3 className="hero-title">
            {typedText}
            <span className={`hero-cursor ${showCursor ? 'hero-cursor-on' : ''}`}>|</span>
          </h3>
        </div>

        <div className={`hero-bio ${bioVisible ? 'hero-bio-visible' : ''}`}>
          {bioWords.map((word, i) => (
            <span
              key={i}
              className="hero-bio-word"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {word}{' '}
            </span>
          ))}
        </div>

        <div className={`hero-socials ${titleDone ? 'hero-socials-visible' : ''}`}>
          {Object.entries(socials).map(([platform, url], i) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-pill"
              style={{ transitionDelay: `${i * 120 + 400}ms` }}
            >
              <span className="hero-social-icon">{socialIcons[platform]}</span>
              <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              <span className="hero-social-glow" />
            </a>
          ))}
        </div>
      </div>

      <div className={`hero-scroll-indicator ${titleDone ? 'hero-scroll-visible' : ''}`}>
        <span className="hero-scroll-text">Scroll to explore</span>
        <div className="hero-scroll-chevron">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Floating particles */
        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .hero-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-color);
          opacity: 0.15;
        }

        .hero-particle-0 {
          top: 15%; left: 10%;
          animation: heroFloat 8s ease-in-out infinite;
        }
        .hero-particle-1 {
          top: 70%; left: 85%;
          width: 8px; height: 8px;
          animation: heroFloat 10s ease-in-out infinite reverse;
        }
        .hero-particle-2 {
          top: 30%; left: 80%;
          width: 4px; height: 4px;
          animation: heroFloat 7s ease-in-out 1s infinite;
        }
        .hero-particle-3 {
          top: 80%; left: 20%;
          animation: heroFloat 9s ease-in-out 0.5s infinite reverse;
        }
        .hero-particle-4 {
          top: 50%; left: 50%;
          width: 10px; height: 10px;
          opacity: 0.08;
          animation: heroFloat 12s ease-in-out 2s infinite;
        }
        .hero-particle-5 {
          top: 20%; left: 60%;
          width: 5px; height: 5px;
          animation: heroFloat 6s ease-in-out 1.5s infinite reverse;
        }

        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.2); }
          50% { transform: translate(-15px, 25px) scale(0.8); }
          75% { transform: translate(20px, 15px) scale(1.1); }
        }

        /* Content container */
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .hero-content.hero-entered {
          opacity: 1;
          transform: translateY(0);
        }

        /* Name */
        .hero-name-wrapper {
          margin-bottom: 1rem;
          animation: heroNameFloat 6s ease-in-out infinite;
        }

        .hero-name {
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-family: var(--font-heading);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0;
        }

        @keyframes heroNameFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Title typing */
        .hero-title-line {
          min-height: 2.5rem;
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          color: var(--accent-color);
          font-weight: 500;
          margin: 0;
          font-family: var(--font-body);
        }

        .hero-cursor {
          color: var(--accent-color);
          font-weight: 300;
          opacity: 0;
          transition: opacity 0.1s;
          margin-left: 2px;
        }

        .hero-cursor-on {
          opacity: 1;
        }

        /* Bio words */
        .hero-bio {
          max-width: 650px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          font-size: 1.1rem;
          min-height: 4rem;
        }

        .hero-bio-word {
          display: inline;
          color: var(--text-secondary);
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .hero-bio-visible .hero-bio-word {
          opacity: 1;
          transform: translateY(0);
        }

        /* Social pills */
        .hero-socials {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-social-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.4rem;
          border-radius: 999px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          transition: opacity 0.5s ease, transform 0.5s var(--transition-bounce),
                      border-color 0.3s, color 0.3s, box-shadow 0.3s;
        }

        .hero-socials-visible .hero-social-pill {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .hero-social-icon {
          display: flex;
          align-items: center;
        }

        .hero-social-glow {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          opacity: 0;
          background: radial-gradient(circle at center, var(--accent-glow), transparent 70%);
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .hero-social-pill:hover {
          border-color: var(--accent-color);
          color: var(--accent-color);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 4px 20px var(--accent-glow);
        }

        .hero-social-pill:hover .hero-social-glow {
          opacity: 0.15;
        }

        /* Scroll indicator */
        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.8s ease 0.8s;
        }

        .hero-scroll-visible {
          opacity: 1;
        }

        .hero-scroll-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .hero-scroll-chevron {
          color: var(--accent-color);
          animation: heroBounce 2s ease-in-out infinite;
        }

        @keyframes heroBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(8px); }
          60% { transform: translateY(4px); }
        }

        @media (max-width: 600px) {
          .hero-socials {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Hero;
