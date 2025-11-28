import { ReactNode } from 'react';

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  subDescription: string;
}

export interface LoginTypeProps {
  role: 'User' | 'Admin';
  icon: ReactNode;
  description: string;
  buttonColor: string;
  accentColor: string;
  onClick: () => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}