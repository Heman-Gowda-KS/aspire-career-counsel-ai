
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

// Gemini API key
const GEMINI_API_KEY = "AIzaSyD-S1p0fQSePLvudq03su7iVdvaAuFTBTE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Function to get response from Gemini API
const getGeminiResponse = async (userContext: string, message: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI career counselor providing guidance based on the user's interests and career goals.
                The user is interested in: ${userContext}.
                
                Please provide helpful, realistic career advice that can be implemented. Focus on specific career paths, 
                education requirements, skills needed, and potential opportunities.
                
                User question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
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
  const [userContext, setUserContext] = useState('');
  
  // Set user context based on user type and path
  useEffect(() => {
    let context = '';
    
    if (userType === 'student') {
      context = userPath 
        ? `A student interested in ${userPath}` 
        : 'A student looking for general career guidance';
    } else {
      context = userPath === 'upgrade'
        ? 'A professional looking to advance in their current career'
        : userPath === 'switch'
          ? 'A professional looking to switch to a new career field'
          : 'A professional looking for general career guidance';
    }
    
    setUserContext(context);
  }, [userType, userPath]);

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
      const response = await getGeminiResponse(userContext, inputMessage);
      
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
      toast.error("Error connecting to the AI service. Please try again later.");
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
