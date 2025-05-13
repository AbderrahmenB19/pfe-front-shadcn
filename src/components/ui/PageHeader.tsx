import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  className,
  icon
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="mt-4 h-1 w-full bg-gradient-to-r from-primary to-primary/20 rounded-full" />
    </div>
  );
}