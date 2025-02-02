import { Home, Star, Menu, LogIn, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/LoginDialog';
import { SignupDialog } from './SignupDialog';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <span className="text-xl font-semibold">AI Notes</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive("/")
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        
        <Link
          to="/favorites"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive("/favorites")
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Star size={20} />
          <span>Favourites</span>
        </Link>
      </nav>

      <div className="mt-auto">
        {isAuthenticated ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <>
            <Button
              variant="default"
              className="w-full"
              onClick={() => setShowLoginDialog(true)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button
              variant="default"
              className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setIsSignupOpen(true)}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
        <SidebarContent />
      </div>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <SignupDialog open={isSignupOpen} onOpenChange={setIsSignupOpen} />
    </>
  );
};

export default Sidebar;