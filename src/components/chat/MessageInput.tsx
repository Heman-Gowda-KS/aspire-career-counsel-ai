
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  userType: 'student' | 'professional';
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, userType }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="flex gap-2"
    >
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        className={cn(
          "min-h-[50px] max-h-[150px] transition-all duration-300",
          "border-2 rounded-xl resize-none",
          isFocused && "ring-2 ring-offset-2 border-transparent",
          userType === 'student' 
            ? (isFocused ? "ring-violet-500 border-violet-300" : "border-violet-200") 
            : (isFocused ? "ring-blue-500 border-blue-300" : "border-blue-200")
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !inputMessage.trim()}
        className={cn(
          "transition-all duration-300 transform hover:scale-110 rounded-xl",
          inputMessage.trim() && !isLoading && "animate-pulse shadow-lg",
          userType === 'student' 
            ? "bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600" 
            : "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
        )}
      >
        <Send className="h-4 w-4 text-white" />
      </Button>
    </form>
  );
};

export default MessageInput;
