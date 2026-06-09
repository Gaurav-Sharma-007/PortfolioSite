import React from 'react';
import { useTheme } from './ThemeContext';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
        <div className="toggle-thumb">
          {isDark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </div>
      </div>

      <style>{`
        .theme-toggle {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
        }

        .toggle-track {
          width: 48px;
          height: 26px;
          border-radius: 13px;
          position: relative;
          transition: background 0.4s ease;
        }

        .toggle-track.dark {
          background: linear-gradient(135deg, #1a1a3e, #2d1b69);
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .toggle-track.light {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .toggle-thumb {
          position: absolute;
          top: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.4s ease;
        }

        .toggle-track.dark .toggle-thumb {
          transform: translateX(25px);
          background: #c084fc;
          color: #1a1a2e;
          box-shadow: 0 0 8px rgba(192, 132, 252, 0.5);
        }

        .toggle-track.light .toggle-thumb {
          transform: translateX(3px);
          background: #ffffff;
          color: #f59e0b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .theme-toggle:hover .toggle-track {
          filter: brightness(1.1);
        }

        .theme-toggle:active .toggle-thumb {
          width: 24px;
        }
      `}</style>
    </button>
  );
};

export default DarkModeToggle;
