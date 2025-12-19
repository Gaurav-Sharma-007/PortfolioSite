import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Education = () => {
    const { education } = portfolioData;
    const [ref, isVisible] = useScrollAnimation();

    return (
        <section id="education" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <h2>Education</h2>
            <div className="education-list">
                {education.map((edu) => (
                    <div key={edu.id} className="education-card">
                        <div className="edu-header">
                            <h3>{edu.institution}</h3>
                            <span className="edu-period">{edu.period}</span>
                        </div>
                        <div className="edu-details">
                            <span className="degree">{edu.degree}</span>
                            <span className="score">{edu.score}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        .education-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .education-card {
            background: var(--card-bg);
            padding: 1.5rem 2rem;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color);
            transition: transform 0.2s;
        }

        .education-card:hover {
            transform: translateX(10px);
        }

        .edu-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .edu-header h3 {
            margin: 0;
            font-size: 1.3rem;
            color: var(--text-primary);
        }

        .edu-period {
            font-size: 0.9rem;
            color: var(--text-secondary);
            background: rgba(255,255,255,0.05);
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
        }

        .edu-details {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .degree {
            color: var(--accent-color);
            font-weight: 600;
        }

        .score {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
      `}</style>
        </section>
    );
};

export default Education;
