
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
          "border-muted-foreground/20",
          isFocused && "ring-2 ring-offset-2",
          userType === 'student' && isFocused && "ring-student",
          userType === 'professional' && isFocused && "ring-professional"
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
          "transition-all duration-300 transform hover:scale-110 hover:shadow-md",
          inputMessage.trim() && !isLoading && "animate-pulse",
          userType === 'student' ? "bg-student hover:bg-student-dark" : "bg-professional hover:bg-professional-dark"
        )}
      >
        <Send className={cn("h-4 w-4", inputMessage.trim() && !isLoading && "animate-ping")} />
      </Button>
    </form>
  );
};

export default MessageInput;
