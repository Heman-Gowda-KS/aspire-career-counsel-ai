
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <Logo />
        {user && (
          <Button variant="outline" onClick={() => navigate('/user-type')}>
            Dashboard
          </Button>
        )}
      </header>
      
      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 md:px-6 text-center space-y-12 py-12">
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover Your Ideal Career Path with <span className="text-primary">AI</span> Guidance
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized career advice tailored to your unique journey, whether you're a student exploring options or a professional looking to grow.
          </p>
          <Button 
            size="lg" 
            className="mt-4 text-lg px-8 py-6" 
            onClick={handleGetStarted}
          >
            {user ? 'Continue' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-background rounded-lg p-6 shadow-md">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">Personalized Guidance</h3>
            <p className="text-muted-foreground">Get AI-powered advice that's tailored to your specific situation and career goals.</p>
          </div>
          
          <div className="bg-background rounded-lg p-6 shadow-md">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">Discover Possibilities</h3>
            <p className="text-muted-foreground">Explore career paths and opportunities you might not have considered before.</p>
          </div>
          
          <div className="bg-background rounded-lg p-6 shadow-md">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">Actionable Next Steps</h3>
            <p className="text-muted-foreground">Get clear recommendations on skills to develop and actions to take for career growth.</p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Aspire - AI Career Counseling</p>
      </footer>
    </div>
  );
};

export default Home;
