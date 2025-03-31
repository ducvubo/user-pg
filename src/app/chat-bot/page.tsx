// pages/page.tsx
import React from 'react';
import ChatBubble from './ChatBubble';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div>Page Content</div>
      <ChatBubble />
    </div>
  );
}