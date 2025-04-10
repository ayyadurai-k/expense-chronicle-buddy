
import React from 'react';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { cn } from '@/lib/utils';

interface HeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedDate, onDateChange, onProfileClick }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-primary">Expense Chronicle</h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 pl-3 text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(selectedDate, 'PPP')}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onProfileClick}
        className="rounded-full"
      >
        <User className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;
