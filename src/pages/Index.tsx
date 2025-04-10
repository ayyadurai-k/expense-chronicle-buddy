
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import ExpenseSummary from '@/components/ExpenseSummary';
import ExpenseList from '@/components/ExpenseList';
import ExpenseForm from '@/components/ExpenseForm';
import ProfileSection from '@/components/ProfileSection';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Expense, 
  Category,
  getAllExpenses,
  getExpensesByDate,
  getTotalExpensesByDate,
  getAllCategories,
  addExpense,
  updateExpense,
  deleteExpense,
  addCategory
} from '@/services/expenseService';
import { toast } from 'sonner';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState<boolean>(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  
  // For delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Load expenses and categories on mount and when selected date changes
  useEffect(() => {
    loadExpensesForDate(selectedDate);
    loadCategories();
  }, [selectedDate]);

  const loadExpensesForDate = (date: Date) => {
    const expensesForDate = getExpensesByDate(date);
    const total = getTotalExpensesByDate(date);
    
    setExpenses(expensesForDate);
    setTotalAmount(total);
  };

  const loadCategories = () => {
    const allCategories = getAllCategories();
    setCategories(allCategories);
  };

  const handleAddExpense = () => {
    setExpenseToEdit(undefined);
    setIsExpenseFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsExpenseFormOpen(true);
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'> | Expense) => {
    if ('id' in expenseData) {
      // Update existing expense
      updateExpense(expenseData);
      toast.success('Expense updated successfully');
    } else {
      // Add new expense
      addExpense(expenseData);
      toast.success('Expense added successfully');
    }
    
    // Refresh expense data
    loadExpensesForDate(selectedDate);
  };

  const handleDeleteExpense = (id: string) => {
    // Instead of deleting immediately, open confirmation dialog
    setExpenseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      toast.success('Expense deleted successfully');
      
      // Refresh expense data
      loadExpensesForDate(selectedDate);
      
      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleAddCategory = (name: string) => {
    addCategory(name);
    toast.success(`Category "${name}" added`);
    loadCategories();
  };

  // Show profile section
  if (showProfile) {
    return <ProfileSection onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onProfileClick={() => setShowProfile(true)}
      />
      
      <main className="container mx-auto p-4 max-w-md">
        <ExpenseSummary totalAmount={totalAmount} date={selectedDate} />
        
        <ExpenseList 
          expenses={expenses}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
        
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
          onClick={handleAddExpense}
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        <ExpenseForm 
          isOpen={isExpenseFormOpen}
          onClose={() => setIsExpenseFormOpen(false)}
          onSave={handleSaveExpense}
          categories={categories}
          onAddCategory={handleAddCategory}
          selectedDate={selectedDate}
          expenseToEdit={expenseToEdit}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this expense? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteExpense} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Index;
