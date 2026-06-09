import React, { useState, useCallback } from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

const categoryConfig = {
  'Languages and Frameworks': { color: '#a855f7', icon: 'code' },
  'Cloud & Tools': { color: '#60a5fa', icon: 'cloud' },
  'Enterprise Tech': { color: '#f59e0b', icon: 'building' },
};

const CategoryIcon = ({ type, color }) => {
  if (type === 'code') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    );
  }
  if (type === 'cloud') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="2" />
      <line x1="15" y1="22" x2="15" y2="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
};

const SkillTag = ({ item, color, delay }) => {
  const [ripple, setRipple] = useState(null);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, key: Date.now() });
    setTimeout(() => setRipple(null), 600);
  }, []);

  return (
    <span
      className="skill-tag-enhanced"
      style={{
        '--tag-color': color,
        transitionDelay: delay,
      }}
      onClick={handleClick}
    >
      {item}
      {ripple && (
        <span
          className="skill-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          key={ripple.key}
        />
      )}
    </span>
  );
};

const Skills = () => {
  const { skills } = portfolioData;
  const [sectionRef, sectionVisible] = useScrollAnimation(0.1);
  const [staggerRef, staggerVisible, getDelay] = useStaggerAnimation(0.1, 150);

  return (
    <section id="skills" ref={sectionRef} className={`fade-in-section ${sectionVisible ? 'is-visible' : ''}`}>
      <h2 className="gradient-text">Skills</h2>
      <div className="skills-grid" ref={staggerRef}>
        {skills.map((category, catIndex) => {
          const config = categoryConfig[category.category] || { color: '#a855f7', icon: 'code' };
          return (
            <div
              key={catIndex}
              className={`skill-card-enhanced glass-card ${staggerVisible ? 'skill-card-visible' : ''}`}
              style={{
                '--cat-color': config.color,
                ...getDelay(catIndex),
              }}
            >
              <div className="skill-card-glow" />
              <div className="skill-card-header">
                <div className="skill-icon-wrap" style={{ background: `${config.color}15` }}>
                  <CategoryIcon type={config.icon} color={config.color} />
                </div>
                <h3 style={{ color: config.color }}>{category.category}</h3>
              </div>
              <div className="skill-tags-wrap">
                {category.items.map((item, itemIndex) => (
                  <SkillTag
                    key={item}
                    item={item}
                    color={config.color}
                    delay={`${(catIndex * 150) + (itemIndex * 60)}ms`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .skill-card-enhanced {
          position: relative;
          padding: 2rem;
          border-radius: 16px;
          border-left: 4px solid var(--cat-color);
          overflow: hidden;
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.6s ease, transform 0.6s var(--transition-bounce),
                      box-shadow 0.3s ease;
        }

        .skill-card-enhanced.skill-card-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .skill-card-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--cat-color);
          box-shadow: 0 0 20px var(--cat-color), 0 0 40px var(--cat-color);
          opacity: 0.4;
          pointer-events: none;
        }

        .skill-card-enhanced:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.2),
                      inset 0 0 30px rgba(255,255,255,0.02);
        }

        .skill-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .skill-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .skill-card-header h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0;
          font-family: var(--font-heading);
        }

        .skill-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
        }

        .skill-tag-enhanced {
          position: relative;
          font-size: 0.9rem;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          color: var(--text-primary);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          overflow: hidden;
          user-select: none;
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.4s ease, transform 0.4s ease,
                      background 0.25s, border-color 0.25s,
                      box-shadow 0.25s, color 0.25s;
        }

        .skill-card-visible .skill-tag-enhanced {
          opacity: 1;
          transform: translateX(0);
        }

        .skill-tag-enhanced:hover {
          background: color-mix(in srgb, var(--tag-color) 15%, transparent);
          border-color: var(--tag-color);
          color: var(--tag-color);
          box-shadow: 0 0 16px color-mix(in srgb, var(--tag-color) 30%, transparent);
          transform: translateY(-2px);
        }

        .skill-ripple {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--tag-color);
          opacity: 0.25;
          transform: translate(-50%, -50%) scale(0);
          animation: skillRipple 0.6s ease-out forwards;
          pointer-events: none;
        }

        @keyframes skillRipple {
          to {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }

        @media (max-width: 600px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;
