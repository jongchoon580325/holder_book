'use client';

import { useState, useCallback } from 'react';

interface FireworkPosition {
  x: number;
  y: number;
  id: number;
}

export const useFirework = () => {
  const [fireworks, setFireworks] = useState<FireworkPosition[]>([]);

  const createFirework = useCallback((x: number, y: number) => {
    const id = Date.now();
    setFireworks(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setFireworks(prev => prev.filter(fw => fw.id !== id));
    }, 1000);
  }, []);

  return {
    fireworks,
    createFirework
  };
}; 