import React, { useEffect, useState, useRef } from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ImpactGraph from './ImpactGraph';

const ExperienceCard = ({ exp, index }) => {
  const [ref, isVisible] = useScrollAnimation(0.15);
  const isLeft = index % 2 === 0;
  const animClass = isLeft ? 'fade-in-left' : 'fade-in-right';

  return (
    <div
      className={`timeline-item ${isLeft ? 'timeline-left' : 'timeline-right'}`}
    >
      {/* Connector dot on the timeline */}
      <div className={`timeline-dot ${isVisible ? 'dot-visible' : ''}`} />

      {/* Connector line from dot to card */}
      <div className={`timeline-connector ${isVisible ? 'connector-visible' : ''}`} />

      <div
        ref={ref}
        className={`exp-card glass-card ${animClass} ${isVisible ? 'is-visible' : ''}`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="exp-card-header">
          <div className="exp-card-title-group">
            <h3 className="exp-role">{exp.role}</h3>
            <span className="exp-company">{exp.company}</span>
          </div>
          <span className="exp-period-pill">{exp.period}</span>
        </div>

        <p className="exp-desc">{exp.description}</p>

        {exp.details && exp.details.length > 0 && (
          <ul className="exp-detail-list">
            {exp.details.map((detail, i) => (
              <li key={i}>
                <span className="detail-bullet">▹</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {exp.stats && exp.stats.length > 0 && (
          <div className="exp-stats-section">
            {exp.stats.map((stat, i) => (
              <ImpactGraph
                key={i}
                label={stat.label}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                color={stat.prefix === '-' ? '#4CAF50' : '#646cff'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Experience = () => {
  const { experience } = portfolioData;
  const [sectionRef, sectionVisible] = useScrollAnimation(0.05);
  const timelineRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    if (!sectionVisible) return;

    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;

      // Calculate how far the user has scrolled through this section
      const scrolled = windowHeight - rect.top;
      const percentage = Math.min(Math.max(scrolled / (totalHeight + windowHeight * 0.3), 0), 1);
      setLineHeight(percentage * 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionVisible]);

  return (
    <section id="experience" ref={sectionRef}>
      <h2 className="gradient-text">Experience</h2>

      <div className="timeline-wrapper" ref={timelineRef}>
        {/* The animated vertical line */}
        <div className="timeline-track">
          <div
            className="timeline-line-fill"
            style={{ height: `${lineHeight}%` }}
          />
        </div>

        {experience.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            index={index}
          />
        ))}
      </div>

      <style>{`
        .timeline-wrapper {
          position: relative;
          padding: 2rem 0;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ─── Vertical Timeline Track ─── */
        .timeline-track {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 3px;
          background: rgba(255, 255, 255, 0.06);
          transform: translateX(-50%);
          border-radius: 3px;
          overflow: hidden;
          z-index: 0;
        }

        .timeline-line-fill {
          width: 100%;
          background: linear-gradient(
            180deg,
            var(--accent-color),
            var(--accent-hover),
            var(--accent-color)
          );
          border-radius: 3px;
          transition: height 0.15s linear;
          box-shadow:
            0 0 12px var(--accent-glow),
            0 0 24px var(--accent-glow);
        }

        /* ─── Timeline Item ─── */
        .timeline-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          margin-bottom: 3rem;
          width: 100%;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-left {
          justify-content: flex-start;
          padding-right: calc(50% + 30px);
        }

        .timeline-right {
          justify-content: flex-end;
          padding-left: calc(50% + 30px);
        }

        /* ─── Connector Dot ─── */
        .timeline-dot {
          position: absolute;
          left: 50%;
          top: 28px;
          width: 16px;
          height: 16px;
          background: var(--bg-color);
          border: 3px solid var(--accent-color);
          border-radius: 50%;
          transform: translateX(-50%) scale(0);
          z-index: 2;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .timeline-dot.dot-visible {
          transform: translateX(-50%) scale(1);
          animation: dot-glow-pulse 3s ease-in-out infinite;
        }

        @keyframes dot-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 var(--accent-glow), 0 0 8px var(--accent-glow);
          }
          50% {
            box-shadow: 0 0 0 6px transparent, 0 0 16px var(--accent-glow);
          }
        }

        /* ─── Connector Line (dot to card) ─── */
        .timeline-connector {
          position: absolute;
          top: 34px;
          height: 2px;
          background: var(--accent-color);
          z-index: 1;
          transform: scaleX(0);
          transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) 0.2s;
        }

        .timeline-left .timeline-connector {
          right: calc(50% + 8px);
          left: calc(100% - 50% - 30px + 2px);
          transform-origin: right center;
          width: 22px;
          left: auto;
          right: calc(50% - 8px);
          transform-origin: right center;
        }

        .timeline-right .timeline-connector {
          left: calc(50% + 8px);
          width: 22px;
          transform-origin: left center;
        }

        .connector-visible {
          transform: scaleX(1);
        }

        /* ─── Experience Card ─── */
        .exp-card {
          position: relative;
          padding: 1.8rem;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          backdrop-filter: blur(var(--glass-blur, 12px));
          -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
          transition:
            transform var(--transition-speed) var(--transition-bounce),
            box-shadow var(--transition-speed) ease,
            opacity 0.6s ease-out,
            transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
          width: 100%;
        }

        .exp-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 12px 40px var(--shadow-color),
            0 0 20px var(--accent-glow);
          border-color: var(--accent-color);
        }

        /* ─── Card Header ─── */
        .exp-card-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .exp-card-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .exp-role {
          margin: 0;
          font-size: 1.35rem;
          font-family: var(--font-heading);
          color: var(--text-primary);
          line-height: 1.3;
        }

        .exp-company {
          color: var(--accent-color);
          font-weight: 600;
          font-size: 1rem;
          text-shadow: 0 0 20px var(--accent-glow);
        }

        .exp-period-pill {
          font-size: 0.8rem;
          color: var(--accent-color);
          background: rgba(100, 108, 255, 0.1);
          border: 1px solid rgba(100, 108, 255, 0.2);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          white-space: nowrap;
          font-weight: 500;
          flex-shrink: 0;
        }

        /* ─── Description & Details ─── */
        .exp-desc {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .exp-detail-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }

        .exp-detail-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .detail-bullet {
          color: var(--accent-color);
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ─── Stats Section ─── */
        .exp-stats-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        /* ─── Mobile Responsive ─── */
        @media (max-width: 768px) {
          .timeline-wrapper {
            padding-left: 28px;
          }

          .timeline-track {
            left: 12px;
            transform: none;
          }

          .timeline-left,
          .timeline-right {
            padding-left: 40px;
            padding-right: 0;
            justify-content: flex-start;
          }

          .timeline-dot {
            left: 12px;
          }

          .timeline-left .timeline-connector,
          .timeline-right .timeline-connector {
            left: 20px;
            right: auto;
            width: 20px;
            transform-origin: left center;
          }

          .exp-card {
            width: 100%;
          }

          /* Override: all cards animate from left on mobile */
          .timeline-right .exp-card.fade-in-right {
            opacity: 0;
            transform: translateX(-30px);
          }
          .timeline-right .exp-card.fade-in-right.is-visible {
            opacity: 1;
            transform: translateX(0);
          }

          .exp-card-header {
            flex-direction: column;
          }

          .exp-period-pill {
            align-self: flex-start;
          }
        }

        @media (max-width: 480px) {
          .exp-card {
            padding: 1.2rem;
          }

          .exp-role {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
