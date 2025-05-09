
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import ChatInterface from '@/components/chat-interface';

interface LocationState {
  userType: 'student' | 'professional';
  userPath?: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const { userType, userPath } = state || { userType: 'student' };
  
  const getBackLink = () => {
    if (userType === 'student') {
      return '/student-interests';
    } else {
      return '/professional-path';
    }
  };
  
  const getPageTitle = () => {
    if (userType === 'student') {
      return userPath 
        ? `${userPath} Career Guidance` 
        : 'Student Career Guidance';
    } else {
      return userPath === 'upgrade'
        ? 'Career Advancement Guidance'
        : userPath === 'switch'
          ? 'Career Transition Guidance'
          : 'Professional Career Guidance';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 flex flex-col">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(getBackLink())}
            className="border-indigo-200 bg-white hover:bg-indigo-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-indigo-700" />
          </Button>
          <Logo />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-indigo-600">
              Chat with your AI career counselor to get personalized advice and guidance.
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ChatInterface userType={userType} userPath={userPath} />
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-6 text-center text-indigo-700">
        <p>© {new Date().getFullYear()} Aspire - AI Career Counseling</p>
      </footer>
    </div>
  );
};

export default Chat;
