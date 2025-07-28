import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (serverUrl: string = 'ws://localhost:8000'): Socket => {
  if (!socket) {
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: false,
      autoConnect: true,
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};