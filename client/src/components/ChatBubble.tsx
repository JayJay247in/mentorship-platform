// src/components/ChatBubble.tsx
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Conversation, fetchMyConversations } from '../services/conversationService';
import Spinner from './Spinner';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  // We reuse the same query. React Query will handle caching.
  const { data: convos, isLoading } = useQuery<Conversation[]>({
    queryKey: ['myConversations'],
    queryFn: fetchMyConversations,
  });

  const totalUnread = convos?.reduce((sum, convo) => sum + convo.unreadCount, 0) || 0;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* The pop-up chat list */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-2xl mb-2 flex flex-col">
          <div className="p-3 border-b">
            <h3 className="font-bold text-brand-primary">Conversations</h3>
          </div>
          <div className="flex-grow overflow-y-auto p-2">
            {isLoading ? <Spinner /> : (
                convos && convos.length > 0 ? (
                    convos.map(convo => (
                        <Link key={convo.requestId} to={`/chat/${convo.requestId}`} onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md">
                             <img src={convo.participant.avatarUrl || `...`} alt={convo.participant.name} className="w-10 h-10 rounded-full" />
                             <span className="font-semibold">{convo.participant.name}</span>
                             {convo.unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {convo.unreadCount}
                            </span>
                        )}
                        </Link>
                    ))
                ) : <p className="text-center text-sm text-gray-500 p-4">No conversations yet.</p>
            )}
          </div>
        </div>
      )}
      
      {/* The main chat bubble button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-transform hover:scale-110"
        aria-label="Toggle chat list"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {totalUnread}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBubble;