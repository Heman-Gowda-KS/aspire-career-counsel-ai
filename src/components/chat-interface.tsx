
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp?: string;
}

// Updated Gemini API key
const GEMINI_API_KEY = "AIzaSyC2s1tUXi7vC-ed-isAuYgnrJk-Zg5238Y";
// Updated API URL to use Gemini 2.0 Flash model
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

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
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
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
  const [userContext, setUserContext] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  
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

  // Create or fetch existing chat session
  useEffect(() => {
    const createOrFetchSession = async () => {
      if (!user) return;
      
      try {
        // Try to get the latest session for this user and context
        const { data: existingSessions, error: fetchError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('context_type', userType)
          .eq('context_path', userPath || '')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (fetchError) throw fetchError;
        
        if (existingSessions && existingSessions.length > 0) {
          // Use existing session
          setSessionId(existingSessions[0].id);
          
          // Load messages for this session
          const { data: sessionMessages, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', existingSessions[0].id)
            .order('timestamp', { ascending: true });
            
          if (messagesError) throw messagesError;
          
          if (sessionMessages && sessionMessages.length > 0) {
            // Format and set messages
            const formattedMessages = sessionMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              sender: msg.sender as 'user' | 'ai',
              timestamp: msg.timestamp
            }));
            
            setMessages(formattedMessages);
          } else {
            // Add initial greeting for empty but existing session
            addInitialGreeting();
          }
        } else {
          // Create new session
          const { data: newSession, error: createError } = await supabase
            .from('chat_sessions')
            .insert({
              user_id: user.id,
              context_type: userType,
              context_path: userPath || '',
            })
            .select()
            .single();
            
          if (createError) throw createError;
          
          setSessionId(newSession.id);
          addInitialGreeting();
        }
      } catch (error) {
        console.error('Error managing chat session:', error);
        toast.error('Failed to load chat history');
        addInitialGreeting();
      }
    };
    
    createOrFetchSession();
  }, [user, userType, userPath]);
  
  // Save message to database
  const saveMessage = async (message: Message) => {
    if (!sessionId || !user) return;
    
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        content: message.content,
        sender: message.sender,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };
  
  // Add initial greeting
  const addInitialGreeting = () => {
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
    
    const initialMessage = {
      id: '1',
      content: greeting,
      sender: 'ai' as const,
    };
    
    setMessages([initialMessage]);
    if (sessionId && user) {
      saveMessage(initialMessage);
    }
  };

  // Scroll functionality
  useEffect(() => {
    // Get access to the viewport element
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewportRef.current = viewport as HTMLDivElement;
      }
    }
  }, []);

  // Handle scrolling to bottom
  const scrollToBottom = (force = false) => {
    if (viewportRef.current && (autoScroll || force)) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect scroll events to manage auto-scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!viewportRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      // If scrolled up more than 100px, disable auto-scroll
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScroll(isNearBottom);
    };
    
    if (viewportRef.current) {
      viewportRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (viewportRef.current) {
        viewportRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
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
    setAutoScroll(true); // Enable auto-scroll when sending a message
    
    // Save user message
    await saveMessage(newUserMessage);
    
    try {
      const response = await getGeminiResponse(userContext, inputMessage);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai' as const,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      // Save AI message
      await saveMessage(aiMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error("Error connecting to the AI service. Please try again later.");
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'ai' as const,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessage(errorMessage);
    } finally {
      setIsLoading(false);
      // Force scroll to bottom after message is sent and response received
      setTimeout(() => scrollToBottom(true), 100);
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[600px] bg-background rounded-lg border relative">
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
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      {!autoScroll && (
        <Button
          size="icon"
          variant="outline"
          className="absolute bottom-20 right-4 rounded-full opacity-80 hover:opacity-100"
          onClick={() => scrollToBottom(true)}
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      
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
