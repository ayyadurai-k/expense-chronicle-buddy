
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '@/firebase/config';

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

// Collection references
const EXPENSES_COLLECTION = 'expenses';
const CATEGORIES_COLLECTION = 'categories';

// Format date to YYYY-MM-DD
export const formatDateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Initialize Firestore with default categories if needed
export const initializeFirestore = async (): Promise<void> => {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const categoriesSnapshot = await getDocs(categoriesRef);
  
  if (categoriesSnapshot.empty) {
    // Add default categories to Firestore
    for (const category of DEFAULT_CATEGORIES) {
      await addDoc(categoriesRef, category);
    }
  }
};

// Get all expenses
export const getAllExpenses = async (): Promise<Expense[]> => {
  const expensesRef = collection(db, EXPENSES_COLLECTION);
  const expensesSnapshot = await getDocs(expensesRef);
  
  return expensesSnapshot.docs.map(doc => {
    const data = doc.data() as Omit<Expense, 'id'>;
    return { id: doc.id, ...data };
  });
};

// Get expenses by date
export const getExpensesByDate = async (date: Date): Promise<Expense[]> => {
  const formattedDate = formatDateToString(date);
  const expensesRef = collection(db, EXPENSES_COLLECTION);
  const q = query(expensesRef, where("date", "==", formattedDate));
  const expensesSnapshot = await getDocs(q);

  return expensesSnapshot.docs.map(doc => {
    const data = doc.data() as Omit<Expense, 'id'>;
    return { id: doc.id, ...data };
  });
};

// Get total expenses by date
export const getTotalExpensesByDate = async (date: Date): Promise<number> => {
  const expenses = await getExpensesByDate(date);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Add expense
export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<void> => {
  const expensesRef = collection(db, EXPENSES_COLLECTION);
  await addDoc(expensesRef, expense);
};

// Update expense
export const updateExpense = async (expense: Expense): Promise<void> => {
  const { id, ...expenseData } = expense;
  const expenseRef = doc(db, EXPENSES_COLLECTION, id);
  await updateDoc(expenseRef, expenseData);
};

// Delete expense
export const deleteExpense = async (id: string): Promise<void> => {
  const expenseRef = doc(db, EXPENSES_COLLECTION, id);
  await deleteDoc(expenseRef);
};

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  await initializeFirestore(); // Ensure categories are initialized
  
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const categoriesSnapshot = await getDocs(categoriesRef);
  
  return categoriesSnapshot.docs.map(doc => {
    const data = doc.data() as Omit<Category, 'id'>;
    return { id: doc.id, ...data };
  });
};

// Add category
export const addCategory = async (name: string): Promise<void> => {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  await addDoc(categoriesRef, { name });
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(categoryRef);
};
