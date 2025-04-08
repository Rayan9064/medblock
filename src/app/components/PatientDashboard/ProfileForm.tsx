import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      bloodGroup: "",
      allergies: "",
      medications: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Submit profile data
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              {...form.register("dob")}
              className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select {...form.register("bloodGroup")}>
              <SelectTrigger className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            {...form.register("allergies")}
            placeholder="List any allergies..."
            className="min-h-[100px] bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            {...form.register("medications")}
            placeholder="List current medications..."
            className="min-h-[100px] bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-white/20 dark:border-gray-800/20"
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 text-white border-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default ProfileForm;