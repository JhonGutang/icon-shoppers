import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useToken from "@/stores/useToken";
import axiosInstance from "@/hooks/useAxios";
import axios from "axios";

interface EditProfileProps {
  user: Profile | undefined;
  onSave?: (updatedProfile: Profile) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useToken((state) => state.accessToken);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contact_number: user.contact_number || "",
        description: user.description || "",
      });
    }
  }, [user]);

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
    if (!user?.id || !accessToken) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.put(`shop/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Profile updated successfully");
      onSave?.(response.data.data);

      const closeButton = document.querySelector(
        '[aria-label="Close"]'
      ) as HTMLButtonElement;
      closeButton?.click();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error updating profile:",
          err.response?.data || err.message
        );
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else {
        console.error("Unexpected error:", err);
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-sm md:max-w-md w-full p-4 sm:p-6">
        <DialogTitle className="text-lg sm:text-xl">Edit Profile</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full"
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
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="h-20 w-full"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
