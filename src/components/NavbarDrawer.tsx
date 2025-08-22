import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { History, Home, LogOut, Menu, User } from "lucide-react";
import { Link } from "react-router";
import { UserRole, type IUser } from "@/types";
import { useSession } from "@/providers/auth-provider";
import authApi, { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarDrawer: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const session = useSession();

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleNavClick = () => {
    setIsOpen(!open);
  };
  const isAuthenticated = session?.data?._id ? true : false;
  const user: IUser | undefined = session?.data;
  const handleLogout = async () => {
    await logout(null);
    dispatch(authApi.util.resetApiState());
    session?.refetch?.();
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    switch (user?.role) {
      case "SENDER":
        return "/dashboard/sender";
      case "RECEIVER":
        return "/dashboard/receiver";
      case "ADMIN":
        return "/dashboard/admin";
      case "SUPER_ADMIN":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-lg font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
            onClick={handleNavClick}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
            onClick={handleNavClick}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
            onClick={handleNavClick}
          >
            Contact
          </Link>
          <Link
            to="/track"
            className="text-lg font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
            onClick={handleNavClick}
          >
            Track Parcel
          </Link>

          {isAuthenticated && user?.role === UserRole.RECEIVER && (
            <Link
              to="/dashboard/receiver/history"
              className="flex items-center space-x-2 text-lg font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
              onClick={handleNavClick}
            >
              <History className="h-5 w-5" />
              <span>History</span>
            </Link>
          )}

          <div className="border-t border-border pt-4 mt-4">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link to={getDashboardLink()} onClick={handleNavClick}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={handleNavClick}>
                  <Button variant="ghost" className="w-full text-lg">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={handleNavClick}>
                  <Button className="w-full text-lg">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarDrawer;
