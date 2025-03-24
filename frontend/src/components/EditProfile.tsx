import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EditProfileProps {
  user: Profile;
  onSave: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    contact_number: user.contact_number,
    description: user.description || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to update profile
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="contact_number">Contact Number</Label>
        <Input
          id="contact_number"
          value={formData.contact_number}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          className="h-20"
        />
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

export default EditProfile;
