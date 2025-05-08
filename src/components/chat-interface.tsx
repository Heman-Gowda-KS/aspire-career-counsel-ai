
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

const mockAIResponse = (message: string): Promise<string> => {
  // This is a placeholder for the Gemini API integration
  return new Promise((resolve) => {
    setTimeout(() => {
      if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
        resolve("Hello! I'm your AI career counselor. How can I help with your career questions today?");
      } else if (message.toLowerCase().includes("technology") || message.toLowerCase().includes("tech")) {
        resolve("Technology is a vast field with many exciting opportunities! Based on your interests, I'd recommend exploring areas like software development, data science, cybersecurity, or UX design. What specific technologies or aspects of tech interest you most?");
      } else if (message.toLowerCase().includes("science")) {
        resolve("Science offers diverse career paths from research to applied fields. You could explore research in biology, chemistry, physics, or consider applied fields like healthcare, environmental science, or materials engineering. What area of science interests you most?");
      } else if (message.toLowerCase().includes("medicine") || message.toLowerCase().includes("healthcare")) {
        resolve("Medicine and healthcare offer rewarding careers with many specializations. Beyond becoming a doctor, you might consider nursing, pharmacy, physical therapy, medical research, healthcare administration, or health informatics. What aspects of healthcare interest you?");
      } else if (message.toLowerCase().includes("art") || message.toLowerCase().includes("design")) {
        resolve("Creative fields offer diverse opportunities! You could explore graphic design, UI/UX design, illustration, animation, fine art, photography, or art direction. Many of these fields have strong digital components today. What type of creative work appeals to you most?");
      } else if (message.toLowerCase().includes("switch")) {
        resolve("Switching careers can be challenging but rewarding! To make a successful transition, focus on transferable skills, consider additional education or certifications if needed, and network with professionals in your target field. What industry are you interested in switching to?");
      } else if (message.toLowerCase().includes("upgrade") || message.toLowerCase().includes("advance")) {
        resolve("To advance in your current career, focus on developing both technical and soft skills specific to your industry. Seek mentorship, take on challenging projects, and consider relevant certifications or advanced degrees. What specific role or position are you aiming for?");
      } else {
        resolve("Thank you for sharing. To provide more tailored advice, could you tell me more about your specific interests, skills, or any particular career paths you're considering?");
      }
    }, 1500);
  });
};

interface ChatInterfaceProps {
  userType: 'student' | 'professional';
  userPath?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userType, userPath }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Initial greeting based on user type and path
  useEffect(() => {
    let greeting = '';
    
    if (userType === 'student') {
      if (userPath) {
        greeting = `Welcome to your AI career counseling session! I see you're interested in ${userPath}. What specific questions do you have about careers in this field?`;
      } else {
        greeting = "Welcome to your AI career counseling session! As a student, what educational or career topics would you like to explore today?";
      }
    } else {
      if (userPath === 'upgrade') {
        greeting = "Welcome to your AI career counseling session! I understand you're looking to advance in your current career field. What's your current role, and what are your advancement goals?";
      } else if (userPath === 'switch') {
        greeting = "Welcome to your AI career counseling session! I understand you're considering changing career paths. What's your current field, and what areas are you interested in exploring?";
      } else {
        greeting = "Welcome to your AI career counseling session! As a working professional, what career challenges or opportunities would you like to discuss today?";
      }
    }
    
    setMessages([
      {
        id: '1',
        content: greeting,
        sender: 'ai',
      },
    ]);
  }, [userType, userPath]);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user' as const,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await mockAIResponse(inputMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'ai',
        },
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
          sender: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[600px] bg-background rounded-lg border">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
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
          ))}
          {isLoading && (
            <div className="flex mr-auto bg-muted max-w-[80%] rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[50px] max-h-[150px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputMessage.trim()}
            className={cn(
              userType === 'student' ? "bg-student hover:bg-student-dark" : "bg-professional hover:bg-professional-dark"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
