export type ConnectionStatus = 'disconnected' | 'scanning' | 'connected' | 'reconnecting';

export interface Contact {
  nome: string;
  telefone: string;
  valid: boolean;
  error?: string;
}

export type SendStatus = 'pending' | 'sending' | 'sent' | 'failed';

export interface LogEntry {
  id: string;
  contact: Contact;
  status: SendStatus;
  timestamp: Date;
  error?: string;
}

export type DispatchState = 'idle' | 'running' | 'paused' | 'completed';
