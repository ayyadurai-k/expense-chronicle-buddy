
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Expense, Category, formatDateToString } from '@/services/expenseService';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'> | Expense) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  selectedDate: Date;
  expenseToEdit?: Expense;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  onAddCategory,
  selectedDate,
  expenseToEdit
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  
  // Reset form when opened or when expense to edit changes
  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setTitle(expenseToEdit.title);
        setAmount(expenseToEdit.amount.toString());
        
        const category = categories.find(c => c.name === expenseToEdit.category);
        if (category) {
          setCategoryId(category.id);
        }
        
        setNotes(expenseToEdit.notes || '');
      } else {
        resetForm();
      }
    }
  }, [isOpen, expenseToEdit, categories]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategoryId('');
    setNotes('');
    setNewCategory('');
    setShowCategoryInput(false);
  };

  const handleSave = () => {
    // Basic validation
    if (!title.trim() || !amount || isNaN(parseFloat(amount)) || !categoryId) {
      return;
    }

    const selectedCategory = categories.find(c => c.id === categoryId);
    if (!selectedCategory) return;

    const expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category: selectedCategory.name,
      notes: notes.trim(),
      date: formatDateToString(selectedDate),
      ...(expenseToEdit && { id: expenseToEdit.id })
    };

    onSave(expenseData as any);
    resetForm();
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What did you spend on?"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            {showCategoryInput ? (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
                <Button onClick={handleAddCategory} type="button">Add</Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCategoryInput(false)}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCategoryInput(true)}
                  className="flex items-center"
                  type="button"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
