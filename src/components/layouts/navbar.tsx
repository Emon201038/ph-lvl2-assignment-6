import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { User, LogOut, History } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useSession } from "@/providers/auth-provider";
import { type IUser } from "@/types";
import authApi, { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import NavbarDrawer from "../NavbarDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const session = useSession();

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const isAuthenticated = session?.data?._id ? true : false;
  const user: IUser | undefined = session?.data;
  const handleLogout = async () => {
    await logout(null);
    dispatch(authApi.util.resetApiState());
    setIsDropdownOpen(false);
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
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              {/* <Package className="h-8 w-8 text-primary" /> */}
              <img
                src="/icons/parcel-pro.svg"
                className="max-w-18 max-h-12 w-full h-full"
              />
              {/* <span className="text-xl font-bold text-foreground">
                ParcelPro
              </span> */}
            </Link>

            <div className="hidden md:flex space-x-6">
              {[
                { title: "About", path: "/about" },
                { title: "Contact", path: "/contact" },
                { title: "Track Parcel", path: "/track" },
              ].map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
              {isAuthenticated && user?.role === "RECEIVER" && (
                <Link
                  to="/dashboard/receiver/history"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        {user?.picture ? (
                          <img
                            src={user?.picture}
                            width={24}
                            height={24}
                            className="rounded-full"
                            alt="Profile"
                            onError={() => <User className="h-4 w-4" />}
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span>
                          {user.name
                            .trim()
                            .split(/\s+/) // split on any amount of whitespace
                            .map((w) => w[0].toUpperCase())
                            .join(".")}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Link to={getDashboardLink()}>Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Link to={"/profile"}>Profile</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              )}
            </div>
            <NavbarDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
}
