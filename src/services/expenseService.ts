
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
}

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: uuidv4(), name: 'Food' },
  { id: uuidv4(), name: 'Transportation' },
  { id: uuidv4(), name: 'Entertainment' },
  { id: uuidv4(), name: 'Shopping' },
  { id: uuidv4(), name: 'Utilities' },
  { id: uuidv4(), name: 'Health' },
  { id: uuidv4(), name: 'Other' }
];

// Local Storage Keys
const EXPENSES_KEY = 'expenses';
const CATEGORIES_KEY = 'categories';

// Initialize storage if empty
const initializeStorage = () => {
  if (!localStorage.getItem(EXPENSES_KEY)) {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
};

// Format date to YYYY-MM-DD
export const formatDateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Get all expenses
export const getAllExpenses = (): Expense[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
};

// Get expenses by date
export const getExpensesByDate = (date: Date): Expense[] => {
  const formattedDate = formatDateToString(date);
  return getAllExpenses().filter(expense => expense.date === formattedDate);
};

// Get total expenses by date
export const getTotalExpensesByDate = (date: Date): number => {
  const expenses = getExpensesByDate(date);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Add expense
export const addExpense = (expense: Omit<Expense, 'id'>): void => {
  const expenses = getAllExpenses();
  const newExpense = { ...expense, id: uuidv4() };
  expenses.push(newExpense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

// Update expense
export const updateExpense = (expense: Expense): void => {
  const expenses = getAllExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);
  
  if (index !== -1) {
    expenses[index] = expense;
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }
};

// Delete expense
export const deleteExpense = (id: string): void => {
  const expenses = getAllExpenses();
  const updatedExpenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
};

// Get all categories
export const getAllCategories = (): Category[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
};

// Add category
export const addCategory = (name: string): void => {
  const categories = getAllCategories();
  const newCategory = { id: uuidv4(), name };
  categories.push(newCategory);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// Delete category
export const deleteCategory = (id: string): void => {
  const categories = getAllCategories();
  const updatedCategories = categories.filter(category => category.id !== id);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
};
