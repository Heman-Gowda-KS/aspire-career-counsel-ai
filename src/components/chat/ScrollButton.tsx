
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
        "absolute bottom-20 right-4 rounded-full opacity-0 shadow-md",
        "hover:opacity-100 hover:shadow-lg hover:scale-110 hover:bg-primary hover:text-primary-foreground",
        "transition-all duration-300 transform animate-bounce",
        "opacity-80 bg-background border-primary"
      )}
      onClick={onClick}
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
};

export default ScrollButton;
