import React from 'react';
import { ChatBot } from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Our Website</h1>
        <p className="text-gray-600 mb-4">This is a sample page to demonstrate the chat interface. The chat button should appear in the bottom right corner.</p>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sample Content</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default App;