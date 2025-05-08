
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
  className?: string;
  hoverEffect?: boolean;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon: Icon,
  color = "bg-primary",
  onClick,
  className,
  hoverEffect = true,
}) => {
  return (
    <Card 
      className={cn(
        "flex flex-col items-center p-6 cursor-pointer transition-all duration-300 h-full",
        hoverEffect && "hover:shadow-lg hover:-translate-y-1",
        className
      )} 
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 text-center gap-4">
        <div className={cn("p-3 rounded-full", color)}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectionCard;
