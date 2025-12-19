import React, { useEffect, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Counter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [ref, isVisible] = useScrollAnimation(0.5);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isVisible && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const end = parseInt(value, 10);
            if (start === end) return;

            const incrementTime = (duration / end) * 0.8; // Faster at start
            let timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start === end) clearInterval(timer);
            }, incrementTime);

            // Fallback to ensure it ends exactly on value if calculation drifts
            setTimeout(() => setCount(end), duration);

            return () => clearInterval(timer);
        }
    }, [isVisible, value, duration, hasAnimated]);

    return (
        <span ref={ref} className={`counter ${isVisible ? 'visible' : ''}`}>
            {prefix}{count}{suffix}
        </span>
    );
};

export default Counter;
