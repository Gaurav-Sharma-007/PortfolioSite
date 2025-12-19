import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ImpactGraph from './ImpactGraph';

const ExperienceCard = ({ exp, index }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`experience-card fade-in-section ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="exp-header">
        <h3>{exp.role}</h3>
        <span className="company">{exp.company}</span>
        <span className="period">{exp.period}</span>
      </div>
      <p className="exp-description">{exp.description}</p>

      {exp.details && (
        <ul className="exp-details">
          {exp.details.map((detail, i) => <li key={i}>{detail}</li>)}
        </ul>
      )}

      {exp.stats && (
        <div className="stats-container-graph">
          {exp.stats.map((stat, i) => (
            <ImpactGraph
              key={i}
              label={stat.label}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              color={stat.prefix === '-' ? '#4CAF50' : '#646cff'} // Green for reduction (good), Purple for speed
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Experience = () => {
  const { experience } = portfolioData;

  return (
    <section id="experience">
      <h2>Experience</h2>
      <div className="experience-list">
        {experience.map((exp, index) => (
          <ExperienceCard key={exp.id} exp={exp} index={index} />
        ))}
      </div>

      <style>{`
        .experience-list {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .experience-card {
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid var(--card-border);
            border-left: 4px solid var(--accent-color);
            transition: transform 0.2s, opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s;
        }

        .experience-card:hover {
            transform: translateX(10px);
        }

        .experience-card.is-visible:hover {
            transform: translateX(10px);
        }

        .exp-header {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .exp-header h3 {
            margin: 0;
            font-size: 1.5rem;
            color: var(--text-primary);
        }

        .company {
            color: var(--accent-color);
            font-weight: 600;
        }

        .exp-description {
            margin-bottom: 1rem;
            color: var(--text-secondary);
        }

        .exp-details {
            margin-bottom: 1.5rem;
            padding-left: 1.2rem;
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        .exp-details li {
            margin-bottom: 0.5rem;
        }

        .stats-container-graph {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .period {
            margin-left: auto;
            font-size: 0.9rem;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.05);
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
        }

        @media (max-width: 600px) {
            .exp-header {
                flex-direction: column;
                gap: 0.5rem;
            }
            .period {
                margin-left: 0;
            }
        }
      `}</style>
    </section>
  );
};

export default Experience;
