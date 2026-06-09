import React, { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';

const navLinks = [
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);

      // Determine active section
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      let current = '';
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${visible ? 'navbar-visible' : ''}`}>
      <div className="navbar-inner">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          GS
        </div>
        <div className="nav-links">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
              <span className="nav-indicator" />
            </button>
          ))}
        </div>
        <DarkModeToggle />
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transform: translateY(-100%);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.5s ease;
          pointer-events: none;
        }

        .navbar-visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0.75rem auto;
          padding: 0.6rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: 50px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
        }

        .nav-brand {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.2rem;
          cursor: pointer;
          background: linear-gradient(135deg, var(--accent-color), #ec4899);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-right: auto;
          transition: transform 0.3s ease;
        }

        .nav-brand:hover {
          transform: scale(1.1);
        }

        .nav-links {
          display: flex;
          gap: 0.25rem;
        }

        .nav-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          cursor: pointer;
          position: relative;
          transition: color 0.3s ease, background 0.3s ease;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(168, 85, 247, 0.08);
        }

        .nav-link.active {
          color: var(--accent-color);
          background: rgba(168, 85, 247, 0.12);
        }

        .nav-indicator {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 16px;
          height: 2px;
          background: var(--accent-color);
          border-radius: 1px;
          transition: transform 0.3s var(--transition-bounce);
        }

        .nav-link.active .nav-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        @media (max-width: 768px) {
          .navbar-inner {
            margin: 0.5rem;
            padding: 0.5rem 1rem;
          }

          .nav-links {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
