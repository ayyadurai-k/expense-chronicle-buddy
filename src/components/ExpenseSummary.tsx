
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseSummaryProps {
  totalAmount: number;
  date: Date;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ totalAmount, date }) => {
  const isToday = new Date().toDateString() === date.toDateString();
  
  return (
    <div className="expense-card mb-6">
      <h2 className="text-lg font-medium text-gray-700">
        {isToday ? "Today's" : "Selected Date's"} Expenses
      </h2>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-gray-500">Total</p>
        <p className="text-3xl font-bold text-expense-blue">
          {formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
};

export default ExpenseSummary;
