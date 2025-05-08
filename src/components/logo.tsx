
import React from 'react';
import { Compass } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 select-none">
      <Compass className="h-8 w-8 text-primary" />
      <span className="font-bold text-xl tracking-tight">Aspire</span>
    </div>
  );
};

export default Logo;
