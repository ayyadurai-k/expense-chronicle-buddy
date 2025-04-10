
import React from 'react';
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface ProfileSectionProps {
  onBack: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onBack }) => {
  return (
    <div className="bg-white min-h-screen px-4 py-6">
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
        <h2 className="text-xl font-bold">User Profile</h2>
        <p className="text-gray-500">user@example.com</p>
      </div>
      
      <div className="space-y-4">
        <div className="expense-card flex items-center">
          <Settings className="h-5 w-5 mr-3 text-gray-500" />
          <span>Settings</span>
        </div>
        
        <div className="expense-card flex items-center">
          <LogOut className="h-5 w-5 mr-3 text-gray-500" />
          <span>Log Out</span>
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
