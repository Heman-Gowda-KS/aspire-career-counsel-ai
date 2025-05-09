
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
        "flex max-w-[80%] rounded-lg p-4",
        message.sender === 'user'
          ? "ml-auto bg-primary text-primary-foreground"
          : "mr-auto bg-muted",
        userType === 'student' && message.sender === 'user' && "bg-student",
        userType === 'professional' && message.sender === 'user' && "bg-professional"
      )}
    >
      {message.content}
    </div>
  );
};

export default MessageBubble;
