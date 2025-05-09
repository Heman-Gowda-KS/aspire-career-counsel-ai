
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Lightbulb, Rocket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/user-type');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 flex flex-col">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <Logo />
      </header>
      
      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 md:px-6 text-center space-y-12 py-12">
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Discover Your Ideal Career Path with <span className="text-pink-500">AI</span> Guidance
          </h1>
          <p className="text-xl text-indigo-700 max-w-2xl mx-auto">
            Get personalized career advice tailored to your unique journey, whether you're a student exploring options or a professional looking to grow.
          </p>
          <Button 
            size="lg" 
            className="mt-4 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all" 
            onClick={handleGetStarted}
          >
            {user ? 'Continue' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full w-fit mx-auto mb-4 text-white">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-indigo-800">Personalized Guidance</h3>
            <p className="text-indigo-600">Get AI-powered advice that's tailored to your specific situation and career goals.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full w-fit mx-auto mb-4 text-white">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-indigo-800">Discover Possibilities</h3>
            <p className="text-indigo-600">Explore career paths and opportunities you might not have considered before.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-pink-100">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-full w-fit mx-auto mb-4 text-white">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-indigo-800">Actionable Next Steps</h3>
            <p className="text-indigo-600">Get clear recommendations on skills to develop and actions to take for career growth.</p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-6 text-center text-indigo-800">
        <p>© {new Date().getFullYear()} Aspire - AI Career Counseling</p>
      </footer>
    </div>
  );
};

export default Home;
