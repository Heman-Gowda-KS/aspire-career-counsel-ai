
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ScrollButtonProps {
  onClick: () => void;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ onClick }) => {
  return (
    <Button
      size="icon"
      variant="outline"
      className="absolute bottom-20 right-4 rounded-full opacity-80 hover:opacity-100"
      onClick={onClick}
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
};

export default ScrollButton;
