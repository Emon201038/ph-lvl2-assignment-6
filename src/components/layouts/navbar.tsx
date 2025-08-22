import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Package, User, LogOut, Home, History, Menu } from "lucide-react";
import { Link } from "react-router";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(!open);
  };
  const isAuthenticated = false;
  const user: { role: "admin" | "sender" | "receiver"; name: string } | null =
    null;
  // {
  //   name: "Emon",
  //   role: "receiver",
  // };
  const handleLogout = () => {};

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    switch (user?.role) {
      case "sender":
        return "/dashboard/sender";
      case "receiver":
        return "/dashboard/receiver";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                ParcelPro
              </span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
              <Link
                to="/track"
                className="text-muted-foreground hover:text-foreground"
              >
                Track Parcel
              </Link>
              {isAuthenticated && user?.role === "receiver" && (
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
                  <Link to={getDashboardLink()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </Button>
                  </Link>
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

                  {isAuthenticated && user?.role === "receiver" && (
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
          </div>
        </div>
      </div>
    </nav>
  );
}
