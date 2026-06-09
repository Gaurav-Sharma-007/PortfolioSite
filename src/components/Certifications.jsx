import React from 'react';
import { portfolioData } from '../data';
import { useStaggerAnimation } from '../hooks/useScrollAnimation';

const Certifications = () => {
  const { certifications } = portfolioData;
  const [ref, isVisible, getDelay] = useStaggerAnimation(0.1, 180);

  return (
    <section id="certifications" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <h2 className="gradient-text">Certifications</h2>
      <div className="cert-grid-enhanced">
        {certifications.map((cert, index) => (
          <a
            key={index}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`cert-card-enhanced glass-card ${isVisible ? 'cert-card-visible' : ''}`}
            style={getDelay(index)}
          >
            {/* Holographic overlay */}
            <div className="cert-holo-overlay" />

            {/* Shimmer on shield */}
            <div className="cert-shield-wrap">
              <div className="cert-shimmer" />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="var(--accent-color)" fillOpacity="0.1" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" stroke="var(--accent-color)" strokeWidth="2" />
              </svg>
            </div>

            <div className="cert-text-area">
              <h3 className="cert-name-enhanced">{cert.name}</h3>
              <span className="cert-verify-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Verify Credential
              </span>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .cert-grid-enhanced {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .cert-card-enhanced {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          opacity: 0;
          transform: translateY(24px) scale(0.96);
          transition: opacity 0.6s ease, transform 0.6s var(--transition-bounce),
                      box-shadow 0.4s ease, border-color 0.3s;
        }

        .cert-card-enhanced.cert-card-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .cert-card-enhanced:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3),
                      0 0 30px var(--accent-glow);
          border-color: var(--accent-color);
        }

        /* Holographic gradient overlay */
        .cert-holo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(168, 85, 247, 0.05) 0%,
            rgba(96, 165, 250, 0.05) 25%,
            rgba(52, 211, 153, 0.05) 50%,
            rgba(251, 191, 36, 0.05) 75%,
            rgba(239, 68, 68, 0.05) 100%
          );
          background-size: 400% 400%;
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .cert-card-enhanced:hover .cert-holo-overlay {
          opacity: 1;
          animation: certHolo 3s ease infinite;
        }

        @keyframes certHolo {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Shield with shimmer */
        .cert-shield-wrap {
          position: relative;
          flex-shrink: 0;
          width: 72px;
          height: 72px;
          border-radius: 16px;
          background: rgba(168, 85, 247, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cert-shimmer {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.08) 45%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0.08) 55%,
            transparent 60%
          );
          transform: translateX(-100%);
          pointer-events: none;
        }

        .cert-card-enhanced:hover .cert-shimmer {
          animation: certShimmer 1.5s ease-in-out infinite;
        }

        @keyframes certShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Text */
        .cert-text-area {
          flex: 1;
          min-width: 0;
        }

        .cert-name-enhanced {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.6rem;
          line-height: 1.4;
          font-family: var(--font-heading);
          transition: color 0.3s;
        }

        .cert-card-enhanced:hover .cert-name-enhanced {
          color: var(--accent-color);
        }

        .cert-verify-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.3s, transform 0.3s;
          letter-spacing: 0.03em;
        }

        .cert-card-enhanced:hover .cert-verify-label {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 600px) {
          .cert-grid-enhanced {
            grid-template-columns: 1fr;
          }

          .cert-card-enhanced {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Certifications;
