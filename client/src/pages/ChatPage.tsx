// src/pages/ChatPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { fetchMessages, markMessagesAsRead } from '../services/messageService';
import { ChatData, Message } from '../types';

const sendSocketMessage = (socket: any, payload: any): Promise<Message> => {
    return new Promise((resolve, reject) => {
        socket.emit('sendMessage', payload, (response: Message | { error: string }) => {
            if (response && 'error' in response) {
                reject(new Error(response.error));
            } else {
                resolve(response as Message);
            }
        });
    });
};

const ChatPage = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const { user } = useAuth();
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const [content, setContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryKey = useMemo(() => ['messages', requestId], [requestId]);

    const { data: chatData, isLoading, isError } = useQuery<ChatData>({
        queryKey,
        queryFn: () => fetchMessages(requestId!),
        enabled: !!requestId && !!user,
    });

    const sendMessageMutation = useMutation({
        mutationFn: (messagePayload: { content: string; receiverId: string; requestId: string }) => 
            sendSocketMessage(socket, messagePayload),
        onSuccess: (newMessage) => {
            queryClient.setQueryData<ChatData>(queryKey, (oldData) => {
                if (!oldData) return;
                if (oldData.messages.some(msg => msg.id === newMessage.id)) return oldData;
                return { ...oldData, messages: [...oldData.messages, newMessage] };
            });
        }
    });

    const markAsReadMutation = useMutation({
        mutationFn: (reqId: string) => markMessagesAsRead(reqId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myConversations'] });
        },
    });

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (newMessage: Message) => {
            if (newMessage.requestId === requestId) {
                queryClient.setQueryData<ChatData>(queryKey, (oldData) => {
                    if (!oldData) return;
                    if (oldData.messages.some(msg => msg.id === newMessage.id)) return oldData;
                    return { ...oldData, messages: [...oldData.messages, newMessage] };
                });
                if (requestId) markAsReadMutation.mutate(requestId);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => { socket.off('newMessage', handleNewMessage); };
    }, [socket, queryClient, queryKey, requestId, markAsReadMutation]);

    useEffect(() => {
        if (chatData && requestId && user?.id) {
            const hasUnread = chatData.messages.some(m => !m.isRead && m.receiverId === user.id);
            if (hasUnread) {
                markAsReadMutation.mutate(requestId);
            }
        }
    }, [chatData, requestId, user?.id, markAsReadMutation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData?.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !chatData) return;
        const receiver = chatData.participants.mentor.id === user?.id ? chatData.participants.mentee : chatData.participants.mentor;
        sendMessageMutation.mutate({ content, receiverId: receiver.id, requestId: requestId! });
        setContent('');
    };

    if (isLoading) return <Spinner />;
    if (isError || !chatData) return <div className="p-4 text-red-500">Could not load chat history.</div>;
  
    // --- THIS IS THE FIX ---
    // We declare these variables here, after the loading/error guards,
    // so they are available for the JSX below.
    const { messages, participants } = chatData;
    const otherParticipant = participants.mentor.id === user?.id
      ? participants.mentee
      : participants.mentor;

    return (
      <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex items-center space-x-3">
          <img
            src={otherParticipant?.avatarUrl || `https://ui-avatars.com/api/?name=${otherParticipant?.name}`}
            alt={otherParticipant?.name}
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-xl font-bold font-display text-brand-primary">
            Chat with {otherParticipant?.name}
          </h2>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 my-2 ${
                msg.senderId === user?.id ? 'justify-end' : ''
              }`}
            >
              {msg.senderId !== user?.id && (
                <img
                  src={msg.sender.avatarUrl || `https://ui-avatars.com/api/?name=${msg.sender.name}`}
                  alt={msg.sender.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                  msg.senderId === user?.id
                    ? 'bg-brand-accent text-white'
                    : 'bg-gray-200 text-brand-text'
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <p
                  className={`text-xs mt-1 text-right ${
                    msg.senderId === user?.id
                      ? 'text-indigo-200'
                      : 'text-gray-500'
                  }`}
                >
                  {format(new Date(msg.createdAt), 'p')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 bg-gray-50">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:border-transparent"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="px-6 py-2 font-semibold bg-brand-accent text-white rounded-md hover:opacity-90 transition-opacity disabled:bg-opacity-50"
          >
            {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    );
};

export default ChatPage;