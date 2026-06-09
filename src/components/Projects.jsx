import React from 'react';
import { portfolioData } from '../data';
import ProjectCard from './ProjectCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProjectCardWrapper = ({ project, index }) => {
    const [ref, isVisible] = useScrollAnimation(0.05);

    return (
        <div
            ref={ref}
            className={`pc-wrapper fade-in-section ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <ProjectCard project={project} />
        </div>
    );
};

const Projects = () => {
    const { projects } = portfolioData;
    const [sectionRef, sectionVisible] = useScrollAnimation(0.05);

    return (
        <section id="projects" className="projects-section">
            <h2
                ref={sectionRef}
                className={`projects-heading fade-in-section ${sectionVisible ? 'is-visible' : ''}`}
            >
                <span className="gradient-text">Featured Projects</span>
            </h2>
            <p className={`projects-subtitle fade-in-section ${sectionVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
                A showcase of data science, AI/ML, and enterprise solutions
            </p>

            <div className="projects-grid">
                {projects.map((project, index) => (
                    <ProjectCardWrapper key={project.id} project={project} index={index} />
                ))}
            </div>

            <style>{`
                .projects-section {
                    padding: 2rem 0;
                }

                .projects-heading {
                    text-align: center;
                    margin-bottom: 0.5rem;
                    font-family: var(--font-heading);
                    font-size: 2.2rem;
                }

                .projects-subtitle {
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: 1.05rem;
                    margin-bottom: 3rem;
                    opacity: 0.8;
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 2.5rem;
                }

                .pc-wrapper {
                    display: flex;
                    flex-direction: column;
                }

                @media (max-width: 400px) {
                    .projects-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
};

export default Projects;
