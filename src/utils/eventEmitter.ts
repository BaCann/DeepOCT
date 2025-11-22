// src/utils/eventEmitter.ts
import EventEmitter from 'eventemitter3';

class AuthEventEmitter extends EventEmitter {}

export const authEvents = new AuthEventEmitter();

export const AUTH_EVENTS = {
  TOKEN_EXPIRED: 'auth:token_expired',
  LOGOUT: 'auth:logout',
  UNAUTHORIZED: 'auth:unauthorized',
} as const;