import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CircleUserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useToken from "@/stores/useAuthStore";
import axiosInstance from "@/hooks/useAxios";
import axios from "axios";

interface EditProfileProps {
  user: Profile | undefined;
  onSave?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    description: "",
    logo_image: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useToken((state) => state.accessToken);

  useEffect(() => {
    if (user) {
      console.log("Setting form data with user:", user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contact_number: user.contactNumber || "",
        description: user.description || "",
        logo_image: user.logo_image || "",
      });
      setImagePreview(user.logo_image || "");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error("Unauthorized access");
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        name: formData.name,
        email: formData.email,
        contact_number: formData.contact_number,
        description: formData.description
      };

      console.log("Sending data:", profileData);

      const response = await axiosInstance.put('profile', profileData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("logo_image", imageFile);

        await axiosInstance.post('/profile/upload-logo', imageData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Profile updated successfully");
      onSave?.();

      const closeButton = document.querySelector(
        '[aria-label="Close"]'
      ) as HTMLButtonElement;
      closeButton?.click();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Error data:", err.response?.data);
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else {
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
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border bg-gray-100 flex items-center justify-center">
                  <CircleUserRound className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <label htmlFor="profile_picture">
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <Camera size={16} className="text-gray-600" />
                </div>
              </label>
              <input
                id="profile_picture"
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageChange}
                disabled={isLoading}
                className="hidden"
              />
            </div>
          </div>

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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
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
