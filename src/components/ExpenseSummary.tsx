
import React from 'react';
import { format, isToday } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseSummaryProps {
  totalAmount: number;
  date: Date;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ totalAmount, date }) => {
  const dateIsToday = isToday(date);
  
  return (
    <div className="expense-card mb-6">
      <h2 className="text-lg font-medium text-foreground flex items-center">
        <span>Expenses for {format(date, 'dd MMMM yyyy')}</span>
        {dateIsToday && <span className="today-badge">Today</span>}
      </h2>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-muted-foreground">Total</p>
        <p className="text-3xl font-bold text-primary">
          {formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
};

export default ExpenseSummary;
