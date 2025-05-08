
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectionCard from '@/components/selection-card';
import Logo from '@/components/logo';

const ProfessionalPath = () => {
  const navigate = useNavigate();
  
  const handlePathSelect = (path: string) => {
    navigate(`/chat`, { state: { userType: 'professional', userPath: path } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/user-type')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">What's your career goal?</h1>
          <p className="text-lg text-muted-foreground">
            Choose your current professional objective to get targeted guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SelectionCard
            title="Advance in Current Field"
            description="Get guidance on moving up in your current career path"
            icon={TrendingUp}
            color="bg-professional"
            onClick={() => handlePathSelect('upgrade')}
            className="border-professional/20 hover:border-professional"
          />
          
          <SelectionCard
            title="Switch to a New Field"
            description="Explore opportunities in a different career domain"
            icon={Shuffle}
            color="bg-professional"
            onClick={() => handlePathSelect('switch')}
            className="border-professional/20 hover:border-professional"
          />
        </div>
      </main>
      
      <footer className="container mx-auto py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Aspire - AI Career Counseling</p>
      </footer>
    </div>
  );
};

export default ProfessionalPath;
