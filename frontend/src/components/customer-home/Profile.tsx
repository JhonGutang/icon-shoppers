import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import useAuth from "@/hooks/auth/useAuth";
import { Button } from "@/components/shared/ui/button";
import { EditProfile } from "@/types/auth";
import { Store, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shared/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { Separator } from "@/components/shared/ui/separator";

const Profile = () => {
  const router = useRouter();
  const { handleGetProfile, handleUpdateProfile, handleLogout } = useAuth();
  const [user, setUser] = useState<EditProfile>();
  const [editableUser, setEditableUser] = useState<EditProfile | undefined>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchProfile = useCallback(async () => {
    const data = await handleGetProfile();
    setUser(data);
    setEditableUser(data);
  }, [handleGetProfile]);

  useEffect(() => {
    // Decouple state updates from the effect body to avoid cascading renders
    Promise.resolve().then(() => fetchProfile());
  }, [fetchProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditableUser((prev) => prev ? { ...prev, [id]: value } : undefined);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    if(editableUser) {
      const updatedUser = await handleUpdateProfile(editableUser);
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  const handleRedirectToCreateShop = () => {
    router.push("/create-shop");
  };

  if (!user) return <div className="w-full h-screen flex justify-center items-center text-2xl">Loading Please Wait</div>;

  return (
    <div className="w-full h-full py-5 space-y-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-2xl font-bold mb-8">Account Information</div>
        <div className="flex lg:flex-row flex-col items-center gap-10">
          <div className="rounded-2xl flex flex-col items-center w-full lg:w-1/3">
            <div className="relative group overflow-hidden rounded-2xl shadow-md border-4 border-white">
              <img
                src={user.profile_picture ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${user.profile_picture}` : "https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"}
                alt="User Profile"
                className="rounded-xl w-full aspect-square object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </div>
          <div className="flex-1 space-y-4 w-full">
            {renderInputField(
              "name",
              "Name",
              "text",
              editableUser?.name,
              handleInputChange,
              !isEditing
            )}
            {renderInputField(
              "middleName",
              "Middle Name (Optional)",
              "text",
              editableUser?.middleName,
              handleInputChange,
              !isEditing
            )}
            {renderInputField(
              "email",
              "Email Address",
              "text",
              editableUser?.email,
              handleInputChange,
              !isEditing
            )}
            {renderInputField(
              "address",
              "Address",
              "text",
              editableUser?.address,
              handleInputChange,
              !isEditing
            )}
            {renderInputField(
              "contactNumber",
              "Contact Number",
              "text",
              editableUser?.contactNumber,
              handleInputChange,
              !isEditing
            )}
            {!isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  className="flex-1 bg-green-700 hover:bg-green-800 h-[50px] font-semibold text-lg rounded-xl transition-all active:scale-95"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 h-[50px] font-semibold text-lg rounded-xl transition-all active:scale-95"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button className="flex-1 bg-green-700 hover:bg-green-800 h-[50px] font-semibold text-lg rounded-xl" onClick={handleConfirm}>
                  Confirm Changes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-green-700 border-green-700 hover:bg-green-50 h-[50px] font-semibold text-lg rounded-xl"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {!user.shop && (
          <>
            <Separator className="my-12" />
            
            <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-white overflow-hidden rounded-3xl border border-green-100">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-200">
                    <Store size={28} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 border-none px-0">Start Selling on Icon Shoppers</CardTitle>
                    <CardDescription className="text-gray-600 text-lg">Reach local customers and grow your business today.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 px-6 pb-8">
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 p-1 rounded-full text-green-700">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Trusted Platform</h4>
                      <p className="text-sm text-gray-500">Secure transactions and verified local community.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 p-1 rounded-full text-green-700">
                      <ArrowRight size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Easy Setup</h4>
                      <p className="text-sm text-gray-500">Create your shop in minutes and start listing products.</p>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full sm:w-auto px-10 h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-2xl shadow-xl shadow-green-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                    >
                      Get Started
                      <ArrowRight size={20} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-bold">Ready to open your shop?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 text-lg">
                        You are about to be redirected to our specialized shop creation page. Please have your shop details and images ready!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                      <AlertDialogCancel className="h-12 rounded-xl text-lg font-semibold">Maybe Later</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleRedirectToCreateShop}
                        className="h-12 rounded-xl text-lg font-bold bg-green-600 hover:bg-green-700"
                      >
                        Yes, Let&apos;s Go!
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

const renderInputField = (
  id: string,
  label: string,
  type: string = "text",
  value: string | undefined,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  disabled: boolean
) => (
  <div>
    <Label htmlFor={id} className="mb-2">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export default Profile;
