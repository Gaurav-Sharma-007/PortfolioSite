import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Education = () => {
  const { education } = portfolioData;
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <section id="education" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <h2 className="gradient-text">Education</h2>
      <div className="edu-list-enhanced">
        {education.map((edu) => {
          // Extract numeric score for the badge
          const scoreMatch = edu.score.match(/([\d.]+)/);
          const scoreNum = scoreMatch ? parseFloat(scoreMatch[1]) : null;
          const scoreMax = edu.score.includes('/10') ? 10 : 100;
          const scorePercent = scoreNum !== null ? (scoreNum / scoreMax) * 100 : 0;
          // SVG circle params
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const dashOffset = circumference - (scorePercent / 100) * circumference;

          return (
            <div key={edu.id} className="edu-card-enhanced glass-card">
              <div className="edu-border-glow" />

              <div className="edu-card-body">
                <div className="edu-icon-area">
                  <div className="edu-cap-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10L12 5L2 10L12 15L22 10Z" fill="var(--accent-color)" fillOpacity="0.15" />
                      <path d="M22 10L12 5L2 10L12 15L22 10Z" />
                      <path d="M6 12.5V17.5C6 17.5 8 20 12 20C16 20 18 17.5 18 17.5V12.5" />
                      <line x1="22" y1="10" x2="22" y2="16" />
                      <path d="M21 16C21 16 21.5 17.5 22 18C22.5 17.5 23 16 23 16" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                <div className="edu-info">
                  <div className="edu-top-row">
                    <h3 className="edu-institution">{edu.institution}</h3>
                    <span className="edu-period-badge">{edu.period}</span>
                  </div>
                  <p className="edu-degree-text">{edu.degree}</p>
                </div>

                {scoreNum !== null && (
                  <div className="edu-score-ring">
                    <svg width="72" height="72" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r={radius}
                        fill="none"
                        stroke="var(--accent-color)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={isVisible ? dashOffset : circumference}
                        transform="rotate(-90 36 36)"
                        className="edu-score-circle"
                      />
                    </svg>
                    <div className="edu-score-value">
                      <span className="edu-score-num">{scoreNum}</span>
                      <span className="edu-score-max">/{scoreMax}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .edu-list-enhanced {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .edu-card-enhanced {
          position: relative;
          padding: 0;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.4s var(--transition-bounce),
                      box-shadow 0.4s ease;
        }

        .edu-card-enhanced:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25),
                      0 0 30px var(--accent-glow);
        }

        /* Animated left border */
        .edu-border-glow {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #a855f7, #7c3aed, #6d28d9);
          transform: scaleY(0.3);
          transform-origin: center;
          transition: transform 0.5s var(--transition-bounce),
                      box-shadow 0.5s ease;
          border-radius: 0 2px 2px 0;
        }

        .edu-card-enhanced:hover .edu-border-glow {
          transform: scaleY(1);
          box-shadow: 0 0 20px #a855f7, 0 0 40px rgba(168, 85, 247, 0.3);
        }

        .edu-card-body {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem 2rem 2rem 2.5rem;
        }

        /* Graduation cap icon */
        .edu-icon-area {
          flex-shrink: 0;
        }

        .edu-cap-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(168, 85, 247, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s var(--transition-bounce);
        }

        .edu-card-enhanced:hover .edu-cap-icon {
          transform: rotate(-8deg) translateY(-4px);
          animation: eduCapFloat 2s ease-in-out infinite;
        }

        @keyframes eduCapFloat {
          0%, 100% { transform: rotate(-8deg) translateY(-4px); }
          50% { transform: rotate(4deg) translateY(-8px); }
        }

        /* Info block */
        .edu-info {
          flex: 1;
          min-width: 0;
        }

        .edu-top-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
        }

        .edu-institution {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          font-family: var(--font-heading);
        }

        .edu-period-badge {
          font-size: 0.8rem;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.05);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          white-space: nowrap;
        }

        .edu-degree-text {
          font-size: 1.05rem;
          color: var(--accent-color);
          font-weight: 600;
          margin: 0;
        }

        /* Score ring */
        .edu-score-ring {
          position: relative;
          flex-shrink: 0;
          width: 72px;
          height: 72px;
        }

        .edu-score-circle {
          transition: stroke-dashoffset 1.5s ease-out 0.3s;
        }

        .edu-score-value {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          line-height: 1;
        }

        .edu-score-num {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-heading);
        }

        .edu-score-max {
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 1px;
        }

        @media (max-width: 600px) {
          .edu-card-body {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
          }

          .edu-top-row {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Education;
