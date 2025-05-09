
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  userType: 'student' | 'professional';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, userType }) => {
  return (
    <div
      key={message.id}
      className={cn(
        "flex max-w-[80%] rounded-lg p-4 transform transition-all duration-300 animate-fade-in shadow-md",
        message.sender === 'user'
          ? "ml-auto text-white scale-100 hover:scale-[1.02]"
          : "mr-auto bg-white/90 border border-muted/30 scale-100 hover:scale-[1.02]",
        userType === 'student' && message.sender === 'user' && "bg-gradient-to-r from-violet-600 to-indigo-500",
        userType === 'professional' && message.sender === 'user' && "bg-gradient-to-r from-blue-500 to-cyan-400"
      )}
    >
      {message.content}
    </div>
  );
};

export default MessageBubble;
