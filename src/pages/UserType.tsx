
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectionCard from '@/components/selection-card';
import Logo from '@/components/logo';

const UserType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">I am a...</h1>
          <p className="text-lg text-muted-foreground">
            Choose your current status to get career counseling tailored to your situation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SelectionCard
            title="Student"
            description="Exploring career options based on educational interests and goals"
            icon={GraduationCap}
            color="bg-student"
            onClick={() => navigate('/student-interests')}
            className="border-student/20 hover:border-student"
          />
          
          <SelectionCard
            title="Working Professional"
            description="Seeking advancement or transition in your professional career"
            icon={Briefcase}
            color="bg-professional"
            onClick={() => navigate('/professional-path')}
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

export default UserType;
