
import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useChatSession } from '@/hooks/useChatSession';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { getGeminiResponse } from '@/lib/gemini-api';
import MessagesList from '@/components/chat/MessagesList';
import MessageInput from '@/components/chat/MessageInput';
import ScrollButton from '@/components/chat/ScrollButton';
import { ChatInterfaceProps } from '@/types/chat';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userType, userPath }) => {
  const { 
    messages, 
    setMessages, 
    userContext, 
    isLoading, 
    setIsLoading, 
    saveMessage 
  } = useChatSession({ userType, userPath });

  const {
    scrollAreaRef,
    messagesEndRef,
    autoScroll,
    scrollToBottom
  } = useScrollToBottom();

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);
  
  const handleSendMessage = async (inputMessage: string) => {
    const newUserMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user' as const,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    
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
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-white to-gray-50 rounded-lg border border-indigo-100 shadow-lg relative overflow-hidden">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto h-full">
        <MessagesList 
          messages={messages} 
          isLoading={isLoading} 
          userType={userType} 
          messagesEndRef={messagesEndRef}
        />
      </ScrollArea>
      
      {!autoScroll && (
        <ScrollButton onClick={() => scrollToBottom(true)} />
      )}
      
      <div className="p-4 border-t border-indigo-100 bg-white/50 backdrop-blur-sm">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          userType={userType} 
        />
      </div>
    </div>
  );
};

export default ChatInterface;
