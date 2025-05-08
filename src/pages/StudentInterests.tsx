
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Flask, Stethoscope, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectionCard from '@/components/selection-card';
import Logo from '@/components/logo';

const StudentInterests = () => {
  const navigate = useNavigate();
  
  const handleInterestSelect = (interest: string) => {
    navigate(`/chat`, { state: { userType: 'student', userPath: interest } });
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">What interests you?</h1>
          <p className="text-lg text-muted-foreground">
            Select an area of interest to get personalized career guidance.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SelectionCard
            title="Technology"
            icon={Code}
            color="bg-student"
            onClick={() => handleInterestSelect('Technology')}
            className="border-student/20 hover:border-student"
          />
          
          <SelectionCard
            title="Science"
            icon={Flask}
            color="bg-student"
            onClick={() => handleInterestSelect('Science')}
            className="border-student/20 hover:border-student"
          />
          
          <SelectionCard
            title="Medicine"
            icon={Stethoscope}
            color="bg-student"
            onClick={() => handleInterestSelect('Medicine')}
            className="border-student/20 hover:border-student"
          />
          
          <SelectionCard
            title="Art & Design"
            icon={Palette}
            color="bg-student"
            onClick={() => handleInterestSelect('Art and Design')}
            className="border-student/20 hover:border-student"
          />
        </div>
      </main>
      
      <footer className="container mx-auto py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Aspire - AI Career Counseling</p>
      </footer>
    </div>
  );
};

export default StudentInterests;
