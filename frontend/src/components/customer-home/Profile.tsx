import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";

const Profile = () => {
  const { handleGetProfile, handleUpdateProfile, handleLogout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [editableUser, setEditableUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchProfile = async () => {
    const data = await handleGetProfile();
    setUser(data);
    setEditableUser(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditableUser((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    const updatedUser = await handleUpdateProfile(editableUser);
    console.log(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  if (!user) return <div className="w-full h-screen flex justify-center items-center text-2xl">Loading Please Wait</div>;

  return (
    <div className="w-full h-full py-5">
      <div className="text-center text-xl lg:mb-0 mb-7">Account Information</div>
      <div className="flex lg:flex-row flex-col items-center py-5">
        <div className="rounded-xl flex flex-col items-center w-full lg:mb-0 mb-5">
          <img
            src="https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"
            alt="Profile"
            className="rounded-xl lg:w-[30vw] w-[50vw]"
          />
        </div>
        <div className="w-2/3 space-y-4">
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
            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-green-700 h-[45px]"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              <Button
                className="w-full bg-red-600 h-[45px]"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
          {isEditing && (
            <>
              <Button className="w-full bg-green-700" onClick={handleConfirm}>
                Confirm
              </Button>
              <Button
                variant="ghost"
                className="w-full text-green-700"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
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
