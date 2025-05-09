
import React from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
  userType: 'student' | 'professional';
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading, userType, messagesEndRef }) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} userType={userType} />
        ))
      ) : (
        <div className="text-center text-muted-foreground p-4">
          No messages yet. Start a conversation!
        </div>
      )}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
