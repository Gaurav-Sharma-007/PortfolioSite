import React from 'react';
import { portfolioData } from '../data';
import ProjectCard from './ProjectCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProjectCardWrapper = ({ project, index }) => {
    const [ref, isVisible] = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`project-card-wrapper fade-in-section ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <ProjectCard project={project} />
        </div>
    );
};

const Projects = () => {
    const { projects } = portfolioData;

    return (
        <section id="projects">
            <h2>Featured Projects</h2>
            <div className="projects-grid">
                {projects.map((project, index) => (
                    <ProjectCardWrapper key={project.id} project={project} index={index} />
                ))}
            </div>

            <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
        }
        
        /* Wrapper ensures animation doesn't conflict with card hover effects */
        .project-card-wrapper {
            display: flex; /* Ensure child fills it */
            flex-direction: column;
        }
      `}</style>
        </section>
    );
};

export default Projects;
