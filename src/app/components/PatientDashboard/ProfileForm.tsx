import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormData {
  fullName: string;
  age: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export const ProfileForm = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: "",
    age: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Implement API call to update profile
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Full Name
          </label>
          <Input
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="John Doe"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Age
          </label>
          <Input
            type="number"
            value={profileData.age}
            onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
            placeholder="30"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Phone Number
          </label>
          <Input
            type="tel"
            value={profileData.phoneNumber}
            onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            className="mt-1"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Address
        </label>
        <Input
          value={profileData.address}
          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="123 Medical Street, City, Country"
          className="mt-1"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;