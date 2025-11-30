// src/lib/socket.js
import { io } from 'socket.io-client';
import constants from '../utils/constants';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || constants.API_BASE_URL || 'https://loceal.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
});

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export default socket;