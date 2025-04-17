'use client';

import { useEffect } from 'react';
import { useFirework } from '@/hooks/useFirework';
import FireworkEffect from './FireworkEffect';

export const FireworkProvider = () => {
  const { fireworks, createFirework } = useFirework();

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        const rect = target.getBoundingClientRect();
        createFirework(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [createFirework]);

  return (
    <>
      {fireworks.map(fw => (
        <FireworkEffect key={fw.id} x={fw.x} y={fw.y} />
      ))}
    </>
  );
}; 