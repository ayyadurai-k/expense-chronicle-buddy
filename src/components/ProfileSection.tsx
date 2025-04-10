
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Edit, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface ProfileSectionProps {
  onBack: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onBack }) => {
  const [userName, setUserName] = useState<string>('User Profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');
  
  // Load user name from local storage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleEditName = () => {
    setEditedName(userName);
    setIsEditing(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      setUserName(editedName);
      localStorage.setItem('userName', editedName);
      setIsEditing(false);
      toast.success('Name updated successfully');
    } else {
      toast.error('Name cannot be empty');
    }
  };

  return (
    <div className="bg-background min-h-screen px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-white" />
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <Input 
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-center"
              placeholder="Enter your name"
              autoFocus
            />
            <Button onClick={handleSaveName} size="icon" variant="ghost">
              <Check className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{userName}</h2>
            <Button onClick={handleEditName} size="icon" variant="ghost" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <p className="text-gray-500">user@example.com</p>
      </div>
      
      <div className="space-y-4">
        <div className="expense-card flex items-center">
          <span>Settings</span>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is a placeholder for future user profile settings.</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
