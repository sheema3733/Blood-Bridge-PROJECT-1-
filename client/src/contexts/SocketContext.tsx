import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Socket.io connection
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('⚡ Connected to BloodBridge Real-Time Network. Socket ID:', socketInstance.id);

      // Join user room and role room if authenticated
      if (user) {
        socketInstance.emit('room:join', `user:${user.id}`);
        socketInstance.emit('room:join', `role:${user.role}`);
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Disconnected from BloodBridge Real-Time Network');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Update room joins whenever logged-in user changes
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('room:join', `user:${user.id}`);
      socket.emit('room:join', `role:${user.role}`);
    }
  }, [socket, isConnected, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
