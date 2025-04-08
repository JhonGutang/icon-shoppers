import { ProfileDisplay } from "@/types/auth";
import { Button } from "../ui/button";
import StarRating from "../Rating";
import CreateProduct from "./CreateProduct";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";
import EditProfile from "../EditProfile";
import { CircleUserRound } from "lucide-react";

interface HeaderProps {
  user: ProfileDisplay | undefined;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const {handleLogout} = useAuth()
  const { redirectLink } = useRedirectLink();

  const getImageUrl = (path: string | undefined): string | undefined => {
    console.log("Path:", path);
    if (!path) return undefined;
    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.6:8000"
    }/storage/${path}`;
  };

  return (
    <div className="lg:w-[50%] flex flex-col items-center p-6">
      <div className="w-full h-[45%] lg:h-[40%] border-black border-3 rounded-xl">
        <img
          src="https://i.pinimg.com/736x/4a/78/44/4a7844faf49677e5f2b602f929bd9ad6.jpg"
          className="object-cover w-full h-full rounded-xl shadow-xl"
        />
      </div>
      <div className="px-5">
        <div className="lg:w-full flex lg:flex-row flex-col lg:items-start items-center lg:gap-4 -translate-y-4">
          <div className="lg:w-40 lg:h-40 w-50 border-4 border-white rounded-xl">
            {user?.profileImage ? (
              <img
                src={getImageUrl(user.profileImage)}
                alt={`${user.name}'s logo`}
                className="rounded-xl w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                <CircleUserRound className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex flex-col lg:items-start items-center gap-1">
            <div className="text-3xl capitalize font-semibold lg:pt-10">
              {user?.name || "Guest"}
            </div>
            <div className="text-sm font-mono">{user?.email}</div>
            <div></div>
            <div className="text-sm font-mono">{user?.contactNumber}</div>
            <StarRating />
          </div>
        </div>

        <div>{user?.description || "No description provided."}</div>

        <div className="w-full mt-5">
          <div className="text-xl mb-2">Actions</div>
          <div className="space-y-2">
            <div className="flex gap-3">
              <CreateProduct />
              <Button
                className="bg-green-700 text-white hover:bg-white hover:text-green-700"
                onClick={() => redirectLink("dashboard")}
              >
                Check Orders
              </Button>
            </div>
            <div className="space-x-2">
              <EditProfile
                user={user}
                onSave={() => window.location.reload()}
              />
              <Button className="bg-red-600 text-white hover:bg-white hover:text-red-600" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
