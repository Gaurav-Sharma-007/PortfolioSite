import { useEffect, useState } from 'react';

export const getPerformanceProfile = () => {
  if (typeof window === 'undefined') {
    return {
      reducedMotion: false,
      lowPower: false,
      coarsePointer: false,
      maxDpr: 1.5,
      backgroundFps: 30,
    };
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const saveData = navigator.connection?.saveData || false;
  const smallViewport = window.innerWidth < 768;
  const lowPower = reducedMotion || saveData || coarsePointer || smallViewport || cores <= 4 || memory <= 4;

  return {
    reducedMotion,
    lowPower,
    coarsePointer,
    maxDpr: lowPower ? 1 : 1.5,
    backgroundFps: reducedMotion ? 0 : lowPower ? 18 : 30,
  };
};

export const usePerformancePreferences = () => {
  const [profile, setProfile] = useState(() => getPerformanceProfile());

  useEffect(() => {
    const updateProfile = () => setProfile(getPerformanceProfile());
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');

    motionQuery.addEventListener?.('change', updateProfile);
    pointerQuery.addEventListener?.('change', updateProfile);
    window.addEventListener('resize', updateProfile, { passive: true });

    return () => {
      motionQuery.removeEventListener?.('change', updateProfile);
      pointerQuery.removeEventListener?.('change', updateProfile);
      window.removeEventListener('resize', updateProfile);
    };
  }, []);

  return profile;
};

export const useIsInViewport = (targetRef, rootMargin = '300px') => {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [targetRef, rootMargin]);

  return isInViewport;
};
