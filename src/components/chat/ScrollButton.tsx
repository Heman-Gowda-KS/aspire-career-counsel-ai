
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollButtonProps {
  onClick: () => void;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ onClick }) => {
  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        "absolute bottom-20 right-4 rounded-full opacity-0 shadow-lg",
        "hover:opacity-100 hover:shadow-xl hover:scale-110",
        "transition-all duration-300 transform animate-pulse",
        "opacity-90 bg-gradient-to-r from-indigo-400 to-purple-500 text-white border-none"
      )}
      onClick={onClick}
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  );
};

export default ScrollButton;
