import React, { useRef, useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { AlzheimerViz, ChurnViz, SharePointViz, TitanicViz, MovieViz, MusicViz, DiabetesViz, YoutubeViz, McqViz } from './ProjectAnimations';

import Counter from './Counter';

const ProjectCard = ({ project, index }) => {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  // Handle video hover play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovering) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Video play interrupted/failed", error);
        });
      }
    } else {
      video.pause();
      video.currentTime = 0; // Reset to start
    }
  }, [isHovering]);

  // Determine which visualization to show
  const renderViz = () => {
    if (project.title.includes('Alzheimer')) return <AlzheimerViz />;
    if (project.title.includes('Churn')) return <ChurnViz />;
    if (project.title.includes('SharePoint')) return <SharePointViz />;
    if (project.title.includes('Titanic')) return <TitanicViz />;
    if (project.title.includes('Movie')) return <MovieViz />;
    if (project.title.includes('Music')) return <MusicViz />;
    if (project.title.includes('Diabetes')) return <DiabetesViz />;
    if (project.title.includes('YouTube')) return <YoutubeViz />;
    if (project.title.includes('MCQ')) return <McqViz />;
    return null;
  };

  const handleVideoError = () => {
    setHasVideoError(true);
  };

  return (
    <div className="project-card">
      <div
        className="project-media"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {project.video ? (
          <>
            {/* Show Viz if available, else Image */}
            <div className="viz-container">
              {renderViz() || <img src={project.image} alt={project.title} loading="lazy" />}
            </div>
            <video
              ref={videoRef}
              src={project.video}
              loop
              muted
              playsInline
              onError={handleVideoError}
              className={`project-video ${isHovering ? 'is-playing' : ''}`}
            />
          </>
        ) : (
          <div className="viz-container">
            {renderViz() || <img src={project.image} alt={project.title} loading="lazy" />}
          </div>
        )}
        <div className={`video-indicator ${isHovering ? 'active' : ''}`}>
          {isHovering ? 'Playing' : 'Paused'}
        </div>
      </div>

      <div className="content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        {project.stats && (
          <div className="project-stats">
            {project.stats.map((stat, i) => (
              <div key={i} className="stat-pill">
                <span className="stat-val">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </span>
                <span className="stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="links">
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Code</a>
        </div>
      </div>

      <style>{`
        /* ... existing styles ... */
        .project-card {
          background: var(--card-bg); /* Now translucent */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
          border: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* ... */ 
        
        .project-stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .stat-pill {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .stat-val {
            color: var(--accent-color);
            font-weight: 700;
        }
        
        .stat-lbl {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        /* ... existing styles ... */


        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border-color: var(--accent-color);
        }

        .project-media {
            position: relative;
            height: 200px;
            overflow: hidden;
            background: #000; /* Dark background for viz */
        }

        .viz-container {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .project-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .video-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            color: #fff;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        
        .media-container:hover .video-indicator {
            opacity: 1;
        }

        .content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .content h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .content p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        /* ... */ 
        
        .project-stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }

        /* ... */

        .links {
            margin-top: auto;
            display: flex;
            gap: 1rem;
        }

        .links a {
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
