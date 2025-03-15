import { createContext, useContext, useState, useEffect } from 'react';
import OfflineMessage from '../components/OfflineMessage';

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline, setIsOffline }}>
      {children}
      {isOffline && <OfflineMessage />}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => useContext(OfflineContext); 