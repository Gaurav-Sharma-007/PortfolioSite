import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  AlzheimerViz,
  ChurnViz,
  SharePointViz,
  TitanicViz,
  MovieViz,
  MusicViz,
  DiabetesViz,
  YoutubeViz,
  McqViz,
  OcrViz,
  BlancDJViz,
  FinancierViz,
  EyeTrackerViz,
  ShoppingAgentViz,
  ResilientViz,
  RecipeMixerViz
} from './ProjectAnimations';

import Counter from './Counter';
import { useIsInViewport, usePerformancePreferences } from '../hooks/usePerformancePreferences';

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const tiltFrameRef = useRef(null);
  const pendingPointerRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const perfProfile = usePerformancePreferences();
  const isNearViewport = useIsInViewport(cardRef, '400px');
  const enableMotionEffects = !perfProfile.reducedMotion && !perfProfile.coarsePointer && !perfProfile.lowPower;
  const shouldRenderViz = isNearViewport && !perfProfile.reducedMotion;

  // Handle video auto-play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Always play if motion effects are allowed
    if (enableMotionEffects) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [enableMotionEffects]);

  useEffect(() => {
    return () => {
      if (tiltFrameRef.current) {
        cancelAnimationFrame(tiltFrameRef.current);
      }
    };
  }, []);

  const updateTiltFromPointer = useCallback(({ clientX, clientY }) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY });
    setGlowPos({ x: glowX, y: glowY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!enableMotionEffects) return;

    pendingPointerRef.current = { clientX: e.clientX, clientY: e.clientY };
    if (tiltFrameRef.current) return;

    tiltFrameRef.current = requestAnimationFrame(() => {
      tiltFrameRef.current = null;
      if (pendingPointerRef.current) {
        updateTiltFromPointer(pendingPointerRef.current);
      }
    });
  }, [enableMotionEffects, updateTiltFromPointer]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    pendingPointerRef.current = null;
    if (tiltFrameRef.current) {
      cancelAnimationFrame(tiltFrameRef.current);
      tiltFrameRef.current = null;
    }
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlowPos({ x: 50, y: 50 });
  }, []);

  // Determine which visualization to show
  const renderViz = () => {
    if (project.animationKey === 'financier') return <FinancierViz />;
    if (project.animationKey === 'eyeTracker') return <EyeTrackerViz />;
    if (project.animationKey === 'shoppingAgent') return <ShoppingAgentViz />;
    if (project.animationKey === 'resilient') return <ResilientViz />;
    if (project.animationKey === 'recipeMixer') return <RecipeMixerViz />;
    if (project.title.includes('Alzheimer')) return <AlzheimerViz />;
    if (project.title.includes('Churn')) return <ChurnViz />;
    if (project.title.includes('SharePoint')) return <SharePointViz />;
    if (project.title.includes('Titanic')) return <TitanicViz />;
    if (project.title.includes('Movie')) return <MovieViz />;
    if (project.title.includes('Music')) return <MusicViz />;
    if (project.title.includes('Diabetes')) return <DiabetesViz />;
    if (project.title.includes('YouTube')) return <YoutubeViz />;
    if (project.title.includes('MCQ')) return <McqViz />;
    if (project.title.includes('OCR')) return <OcrViz />;
    if (project.title.includes('BLANCDJ')) return <BlancDJViz />;
    return null;
  };

  // Generate a consistent hue from tech tags for colored dots
  const getTagColor = (tag) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const cardStyle = {
    transform: enableMotionEffects
      ? `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${isHovering ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'}`
      : 'none',
    transition: enableMotionEffects
      ? (isHovering ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.4s var(--transition-bounce), box-shadow 0.4s ease')
      : 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const glowBorderStyle = {
    background: isHovering && enableMotionEffects
      ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, var(--accent-color), var(--accent-hover), transparent 70%)`
      : 'transparent',
    opacity: isHovering && enableMotionEffects ? 1 : 0,
  };

  const holoOverlayStyle = {
    background: isHovering && enableMotionEffects
      ? `linear-gradient(${135 + (glowPos.x - 50) * 0.5}deg, rgba(100, 108, 255, 0.15), rgba(0, 255, 200, 0.1), rgba(255, 100, 200, 0.1), transparent)`
      : 'transparent',
    opacity: isHovering && enableMotionEffects ? 1 : 0,
  };

  const previewSrc = project.image || project.posterUrl;
  const viz = shouldRenderViz ? renderViz() : null;

  return (
    <div
      ref={cardRef}
      className={`pc3d-card ${enableMotionEffects ? 'pc3d-effects-enabled' : 'pc3d-effects-light'}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glowing border pseudo-layer */}
      <div className="pc3d-glow-border" style={glowBorderStyle} />

      {/* Card inner */}
      <div className="pc3d-inner">
        {/* Media / Viz Area */}
        <div className="pc3d-media">
          {project.videoUrl ? (
            <>
              <div className="pc3d-viz-container">
                {viz}
                {!viz && previewSrc && <img src={previewSrc} alt={project.title} loading="lazy" />}
              </div>
              <video
                ref={videoRef}
                src={project.videoUrl}
                loop
                muted
                playsInline
                className={`pc3d-video is-playing`}
              />
            </>
          ) : (
            <div className="pc3d-viz-container">
              {viz}
              {!viz && previewSrc && <img src={previewSrc} alt={project.title} loading="lazy" />}
            </div>
          )}

          {/* Holographic overlay */}
          <div className="pc3d-holo-overlay" style={holoOverlayStyle} />

          {/* Shine sweep on hover */}
          <div className={`pc3d-shine ${isHovering ? 'active' : ''}`} />
        </div>

        {/* Content */}
        <div className="pc3d-content">
          <h3 className="pc3d-title">{project.title}</h3>
          <p className="pc3d-desc">{project.description}</p>

          <div className="pc3d-tags">
            {project.tech.map((t) => (
              <span key={t} className="pc3d-tag">
                <span className="pc3d-tag-dot" style={{ backgroundColor: getTagColor(t) }} />
                {t}
              </span>
            ))}
          </div>

          {project.stats && (
            <div className="pc3d-stats">
              {project.stats.map((stat, i) => (
                <div key={i} className="pc3d-stat-pill">
                  <span className="pc3d-stat-val">
                    <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </span>
                  <span className="pc3d-stat-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pc3d-links">
            {project.repoUrl === 'private' ? (
              <span className="pc3d-client" title="Client project: Code not shared">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.4rem', verticalAlign: '-2px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Client Project
              </span>
            ) : (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="pc3d-repo-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.4rem', verticalAlign: '-2px' }}>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
                View Code
              </a>
            )}
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="pc3d-live-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.3rem', verticalAlign: '-2px' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pc3d-card {
          position: relative;
          border-radius: 16px;
          transform-style: preserve-3d;
          cursor: default;
          height: 100%;
        }

        .pc3d-card.pc3d-effects-enabled:hover {
          will-change: transform;
        }

        .pc3d-glow-border {
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          z-index: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          filter: blur(1px);
        }

        .pc3d-inner {
          position: relative;
          z-index: 1;
          background: var(--card-bg);
          backdrop-filter: blur(var(--glass-blur, 12px));
          -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
          border: 1px solid var(--card-border);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 20px var(--shadow-color, rgba(0,0,0,0.2));
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .pc3d-card:hover .pc3d-inner {
          border-color: var(--accent-color);
          box-shadow: 0 8px 40px var(--shadow-color, rgba(0,0,0,0.3)), 0 0 30px var(--accent-glow, rgba(100,108,255,0.15));
        }

        /* Media / Viz area */
        .pc3d-media {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #050510;
          flex-shrink: 0;
        }

        .pc3d-viz-container {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: #050510;
        }

        .pc3d-viz-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .pc3d-card:hover .pc3d-viz-container img {
          transform: scale(1.05);
        }

        .pc3d-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 2;
        }

        .pc3d-video.is-playing {
          opacity: 1;
        }

        .pc3d-holo-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          transition: opacity 0.4s ease;
          mix-blend-mode: overlay;
        }

        .pc3d-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          z-index: 4;
          pointer-events: none;
          transition: none;
        }

        .pc3d-shine.active {
          animation: pc3d-shine-sweep 0.8s ease-out forwards;
        }

        .pc3d-effects-light .pc3d-shine.active {
          animation: none;
        }

        @keyframes pc3d-shine-sweep {
          0% { left: -60%; }
          100% { left: 120%; }
        }

        /* Content */
        .pc3d-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .pc3d-title {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .pc3d-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          line-height: 1.55;
        }

        /* Tags */
        .pc3d-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 1.2rem;
        }

        .pc3d-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          padding: 0.3rem 0.65rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          transition: all 0.3s ease;
          cursor: default;
        }

        .pc3d-tag:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
          background: rgba(100, 108, 255, 0.08);
        }

        @keyframes pc3d-tag-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(100, 108, 255, 0.3); }
          50% { box-shadow: 0 0 0 4px rgba(100, 108, 255, 0); }
        }

        .pc3d-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Stats */
        .pc3d-stats {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }

        .pc3d-stat-pill {
          background: rgba(100, 108, 255, 0.06);
          border: 1px solid rgba(100, 108, 255, 0.15);
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          transition: all 0.3s ease;
        }

        .pc3d-stat-pill:hover {
          background: rgba(100, 108, 255, 0.12);
          border-color: var(--accent-color);
          transform: translateY(-1px);
        }

        .pc3d-stat-val {
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.9rem;
          font-family: var(--font-heading);
        }

        .pc3d-stat-lbl {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        /* Links */
        .pc3d-links {
          margin-top: auto;
          display: flex;
          gap: 0.8rem;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pc3d-repo-link,
        .pc3d-live-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 500;
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .pc3d-repo-link:hover {
          color: var(--accent-color);
          border-color: var(--accent-color);
          background: rgba(100, 108, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--accent-glow, rgba(100,108,255,0.2));
        }

        .pc3d-live-link:hover {
          color: var(--success-color, #00ffaa);
          border-color: var(--success-color, #00ffaa);
          background: rgba(0, 255, 170, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--success-glow, rgba(0,255,170,0.2));
        }

        .pc3d-client {
          display: inline-flex;
          align-items: center;
          font-size: 0.88rem;
          color: var(--text-secondary);
          cursor: help;
          font-style: italic;
          opacity: 0.75;
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          transition: opacity 0.3s ease;
        }

        .pc3d-client:hover {
          opacity: 1;
        }

        @media (max-width: 768px), (prefers-reduced-motion: reduce) {
          .pc3d-inner {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }

          .pc3d-card,
          .pc3d-viz-container img,
          .pc3d-video,
          .pc3d-holo-overlay,
          .pc3d-glow-border {
            transition-duration: 0.15s;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
