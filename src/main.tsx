import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatBot } from './components/ChatBot';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ChatBot />
  </StrictMode>
);