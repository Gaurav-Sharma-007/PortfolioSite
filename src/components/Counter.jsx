import React, { useEffect, useState, useMemo } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const OdometerDigit = ({ digit, animate, delay }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setOffset(digit);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [animate, digit, delay]);

  return (
    <span className="odometer-digit-container">
      <span
        className="odometer-digit-strip"
        style={{
          transform: `translateY(${-offset * 10}%)`,
          transition: `transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="odometer-digit-cell">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

const Counter = ({ value, prefix = '', suffix = '' }) => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasAnimated]);

  const digits = useMemo(() => {
    return String(Math.abs(parseInt(value, 10) || 0)).split('').map(Number);
  }, [value]);

  return (
    <span ref={ref} className="odometer-counter">
      {prefix && <span className="odometer-affix">{prefix}</span>}
      <span className="odometer-digits-row">
        {digits.map((d, i) => (
          <OdometerDigit
            key={`${i}-${digits.length}`}
            digit={d}
            animate={hasAnimated}
            delay={i * 120}
          />
        ))}
      </span>
      {suffix && <span className="odometer-affix">{suffix}</span>}

      <style>{`
        .odometer-counter {
          display: inline-flex;
          align-items: baseline;
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-primary);
          text-shadow: 0 0 12px var(--accent-glow), 0 0 24px var(--accent-glow);
          line-height: 1;
        }

        .odometer-affix {
          opacity: 0.85;
          font-size: 0.85em;
        }

        .odometer-digits-row {
          display: inline-flex;
          align-items: baseline;
        }

        .odometer-digit-container {
          display: inline-block;
          height: 1.15em;
          overflow: hidden;
          position: relative;
          width: 0.65em;
          text-align: center;
        }

        .odometer-digit-strip {
          display: flex;
          flex-direction: column;
          transform: translateY(0%);
          will-change: transform;
        }

        .odometer-digit-cell {
          display: block;
          height: 1.15em;
          line-height: 1.15em;
          text-align: center;
        }
      `}</style>
    </span>
  );
};

export default Counter;
