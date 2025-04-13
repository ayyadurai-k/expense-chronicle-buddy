
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
import { getCurrentUser } from '@/services/authService';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  date: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

// Default categories
const DEFAULT_CATEGORIES: Omit<Category, 'userId'>[] = [
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
  const user = await getCurrentUser();
  if (!user) return;
  
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const q = query(categoriesRef, where("userId", "==", user.uid));
  const categoriesSnapshot = await getDocs(q);
  
  if (categoriesSnapshot.empty) {
    // Add default categories to Firestore
    for (const category of DEFAULT_CATEGORIES) {
      await addDoc(categoriesRef, { ...category, userId: user.uid });
    }
  }
};

// Get all expenses for current user
export const getAllExpenses = async (): Promise<Expense[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const expensesRef = collection(db, EXPENSES_COLLECTION);
  const q = query(expensesRef, where("userId", "==", user.uid));
  const expensesSnapshot = await getDocs(q);
  
  return expensesSnapshot.docs.map(doc => {
    const data = doc.data() as Omit<Expense, 'id'>;
    return { id: doc.id, ...data };
  });
};

// Get expenses by date for current user
export const getExpensesByDate = async (date: Date): Promise<Expense[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const formattedDate = formatDateToString(date);
  const expensesRef = collection(db, EXPENSES_COLLECTION);
  const q = query(
    expensesRef, 
    where("date", "==", formattedDate),
    where("userId", "==", user.uid)
  );
  const expensesSnapshot = await getDocs(q);

  return expensesSnapshot.docs.map(doc => {
    const data = doc.data() as Omit<Expense, 'id'>;
    return { id: doc.id, ...data };
  });
};

// Get total expenses by date for current user
export const getTotalExpensesByDate = async (date: Date): Promise<number> => {
  const expenses = await getExpensesByDate(date);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Add expense for current user
export const addExpense = async (expense: Omit<Expense, 'id' | 'userId'>): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const expensesRef = collection(db, EXPENSES_COLLECTION);
  await addDoc(expensesRef, { ...expense, userId: user.uid });
};

// Update expense
export const updateExpense = async (expense: Expense): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  if (expense.userId !== user.uid) throw new Error('Not authorized to update this expense');
  
  const { id, ...expenseData } = expense;
  const expenseRef = doc(db, EXPENSES_COLLECTION, id);
  await updateDoc(expenseRef, expenseData);
};

// Delete expense
export const deleteExpense = async (id: string): Promise<void> => {
  const expenseRef = doc(db, EXPENSES_COLLECTION, id);
  await deleteDoc(expenseRef);
};

// Get all categories for current user
export const getAllCategories = async (): Promise<Category[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  await initializeFirestore(); // Ensure categories are initialized
  
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const q = query(categoriesRef, where("userId", "==", user.uid));
  const categoriesSnapshot = await getDocs(q);
  
  return categoriesSnapshot.docs.map(doc => {
    const data = doc.data() as Omit<Category, 'id'>;
    return { id: doc.id, ...data };
  });
};

// Add category for current user
export const addCategory = async (name: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  await addDoc(categoriesRef, { name, userId: user.uid });
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(categoryRef);
};
