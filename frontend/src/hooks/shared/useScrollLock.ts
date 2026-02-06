import { useEffect } from 'react';

let lockCount = 0;

export function useScrollLock(isLocked: boolean = true) {
  useEffect(() => {
    if (isLocked) {
      lockCount++;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      if (isLocked) {
        lockCount--;
        if (lockCount <= 0) {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          lockCount = 0; // Reset to ensure no negative values
        }
      }
    };
  }, [isLocked]);
}
