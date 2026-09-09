import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-lg border text-sm font-medium transition-all transform ${
        isOnline
          ? 'bg-emerald-600 text-white border-emerald-700'
          : 'bg-amber-600 text-white border-amber-700 animate-pulse'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Connection restored. Live sync active.</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>You are offline. Offline caching enabled.</span>
        </>
      )}
    </div>
  );
};
