import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, FileText, StickyNote } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/library");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-20 w-20 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Digital
              <span className="block gradient-primary bg-clip-text text-transparent">
                Library Experience
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Upload, organize, and annotate your PDF documents with powerful note-taking features. 
              Access your personal library from anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="library"
                size="xl"
                onClick={() => navigate("/register")}
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything you need for digital reading
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to enhance your reading and research experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-elevated border-0 text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                PDF Management
              </h3>
              <p className="text-muted-foreground">
                Upload, organize, and manage your PDF documents in a clean, intuitive interface.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-0 text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <StickyNote className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                Smart Notes
              </h3>
              <p className="text-muted-foreground">
                Add, edit, and organize notes for each document. Never lose track of important insights.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-0 text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                Personal Library
              </h3>
              <p className="text-muted-foreground">
                Secure, private access to your documents. Only you can see your uploaded content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-card-foreground mb-4">
            Ready to build your digital library?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of readers who have organized their documents with E-Library
          </p>
          <Button
            variant="library"
            size="xl"
            onClick={() => navigate("/register")}
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
