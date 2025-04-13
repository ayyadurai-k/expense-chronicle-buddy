
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
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
  // Disable future dates
  const isDateInFuture = (date: Date) => {
    return date > new Date(new Date().setHours(23, 59, 59, 999));
  };

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    if (!isDateInFuture(nextDay)) {
      onDateChange(nextDay);
    }
  };

  const isNextDayDisabled = isDateInFuture(addDays(selectedDate, 1));

  return (
    <header className="bg-secondary shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-primary">Expense Chronicle</h1>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePreviousDay}
            className="mr-1"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 pl-3 text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(selectedDate, 'MMMM do, yyyy')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                disabled={isDateInFuture}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay}
            disabled={isNextDayDisabled}
            className={cn("ml-1", isNextDayDisabled && "opacity-50 cursor-not-allowed")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
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
