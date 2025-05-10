
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/chat';

interface UseChatSessionProps {
  userType: 'student' | 'professional';
  userPath?: string;
}

export const useChatSession = ({ userType, userPath }: UseChatSessionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userContext, setUserContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
          .eq('user_type', userType)
          .eq('user_path', userPath || '')
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
            .order('created_at', { ascending: true });
            
          if (messagesError) throw messagesError;
          
          if (sessionMessages && sessionMessages.length > 0) {
            // Format and set messages
            const formattedMessages = sessionMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              sender: msg.sender as 'user' | 'ai'
            }));
            
            setMessages(formattedMessages);
            console.log('Loaded messages:', formattedMessages.length);
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
              user_type: userType,
              user_path: userPath || '',
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
      id: Date.now().toString(),
      content: greeting,
      sender: 'ai' as const,
    };
    
    setMessages([initialMessage]);
    if (sessionId && user) {
      saveMessage(initialMessage);
    }
  };

  return {
    messages,
    setMessages,
    userContext,
    isLoading,
    setIsLoading,
    saveMessage
  };
};
