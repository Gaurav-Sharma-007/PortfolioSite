import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

const Hero = () => {
  const { name, title, bio, socials } = portfolioData;
  const [titleRef, titleVisible] = useScrollAnimation();
  const [bioRef, bioVisible] = useScrollAnimation();
  const [socialRef, socialVisible] = useScrollAnimation();

  return (
    <header className="hero">
      <div className="hero-content">
        <h1
          ref={titleRef}
          className={`fade-in-section ${titleVisible ? 'is-visible' : ''}`}
        >
          {name}
        </h1>
        <h3
          ref={titleRef} // Reusing ref for valid simpler staggering effect if wanted, but let's keep it simple
          className={`fade-in-section delay-100 ${titleVisible ? 'is-visible' : ''}`}
        >
          {title}
        </h3>
        <p
          ref={bioRef}
          className={`fade-in-section delay-200 ${bioVisible ? 'is-visible' : ''}`}
        >
          {bio}
        </p>
        <div
          ref={socialRef}
          className={`social-links fade-in-section delay-300 ${socialVisible ? 'is-visible' : ''}`}
        >
          {Object.entries(socials).map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="social-btn">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .hero {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }
        
        .hero h3 {
          font-size: 1.5rem;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        
        .hero p {
          max-width: 600px;
          margin: 0 auto 2rem;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .social-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.9rem;
          background: var(--card-bg);
          color: var(--text-secondary);
        }
        
        .social-btn:hover {
          border-color: var(--accent-color);
          color: var(--accent-color);
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>
    </header>
  );
};

export default Hero;
