import { Button } from "@/components/ui/enhanced-button";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="library-nav border-b border-border/20 shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/library" className="flex items-center space-x-2 group">
            <BookOpen className="h-8 w-8 text-accent transition-smooth group-hover:scale-110" />
            <span className="text-xl font-bold text-library-nav-foreground">
              E-Library
            </span>
          </Link>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-library-nav-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {user?.username || 'User'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-library-nav-foreground hover:bg-library-hover hover:text-foreground transition-smooth"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;