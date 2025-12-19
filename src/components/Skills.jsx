import React from 'react';
import { portfolioData } from '../data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Skills = () => {
    const { skills } = portfolioData;
    const [ref, isVisible] = useScrollAnimation();

    return (
        <section id="skills" ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <h2>Skills</h2>
            <div className="skills-container">
                {skills.map((category, index) => (
                    <div key={index} className="skill-category">
                        <h3>{category.category}</h3>
                        <div className="skill-items">
                            {category.items.map(item => (
                                <span key={item} className="skill-tag">{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        .skills-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }

        .skill-category {
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .skill-category h3 {
            font-size: 1.1rem;
            color: var(--accent-color);
            margin-bottom: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 0.5rem;
        }

        .skill-items {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .skill-tag {
            font-size: 0.9rem;
            background: rgba(255,255,255,0.05);
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            color: var(--text-primary);
            transition: all 0.2s;
        }

        .skill-tag:hover {
            background: var(--accent-color);
            color: white;
            transform: translateY(-2px);
        }
      `}</style>
        </section>
    );
};

export default Skills;
