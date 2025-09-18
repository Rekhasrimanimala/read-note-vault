import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import PDFCard from '@/components/library/PDFCard';
import UploadButton from '@/components/library/UploadButton';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PDF, pdfAPI } from '@/lib/api';
import { Search, BookOpen, Plus, Grid, List } from 'lucide-react';

const Library = () => {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [filteredPdfs, setFilteredPdfs] = useState<PDF[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPDFs();
  }, []);

  useEffect(() => {
    // Filter PDFs based on search query
    const filtered = pdfs.filter(pdf =>
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPdfs(filtered);
  }, [pdfs, searchQuery]);

  const loadPDFs = async () => {
    try {
      // For demo purposes, show mock data instead of hitting the API
      const existingPDFs = JSON.parse(localStorage.getItem('demo-pdfs') || '[]');
      
      if (existingPDFs.length === 0) {
        // Initial mock PDFs for demo
        const mockPDFs: PDF[] = [
          {
            id: '1',
            title: 'Introduction to Machine Learning',
            filename: 'ml-introduction.pdf',
            uploadDate: new Date().toISOString(),
            userId: 'demo-user'
          },
          {
            id: '2',
            title: 'React Development Guide',
            filename: 'react-guide.pdf',
            uploadDate: new Date(Date.now() - 24*60*60*1000).toISOString(),
            userId: 'demo-user'
          },
          {
            id: '3',
            title: 'Database Design Principles',
            filename: 'database-design.pdf',
            uploadDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
            userId: 'demo-user'
          }
        ];
        localStorage.setItem('demo-pdfs', JSON.stringify(mockPDFs));
        setPdfs(mockPDFs);
      } else {
        setPdfs(existingPDFs);
      }
    } catch (error) {
      console.error('Error loading PDFs:', error);
      // Fallback to empty array
      setPdfs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePDF = async (id: string) => {
    try {
      // For demo purposes, delete from localStorage instead of API
      const currentPDFs = JSON.parse(localStorage.getItem('demo-pdfs') || '[]');
      const updatedPDFs = currentPDFs.filter((pdf: PDF) => pdf.id !== id);
      localStorage.setItem('demo-pdfs', JSON.stringify(updatedPDFs));
      setPdfs(updatedPDFs);
      
      toast({
        title: "PDF deleted",
        description: "The document has been removed from your library",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Unable to delete the document",  
        variant: "destructive",
      });
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    
    // Add the uploaded file to demo storage
    if (localStorage.getItem('demo-last-upload')) {
      const uploadedFile = JSON.parse(localStorage.getItem('demo-last-upload') || '{}');
      const currentPDFs = JSON.parse(localStorage.getItem('demo-pdfs') || '[]');
      
      const newPDF: PDF = {
        id: Date.now().toString(),
        title: uploadedFile.name?.replace('.pdf', '') || 'Uploaded Document',
        filename: uploadedFile.name || 'document.pdf',
        uploadDate: new Date().toISOString(),
        userId: 'demo-user'
      };
      
      const updatedPDFs = [newPDF, ...currentPDFs];
      localStorage.setItem('demo-pdfs', JSON.stringify(updatedPDFs));
      setPdfs(updatedPDFs);
      
      // Clear the temp upload data
      localStorage.removeItem('demo-last-upload');
    } else {
      loadPDFs();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your library...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <BookOpen className="h-8 w-8 text-primary mr-3" />
                My Library
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.username}! You have {pdfs.length} documents in your collection.
              </p>
            </div>
            
            <Button
              variant="library"
              size="lg"
              onClick={() => setShowUpload(!showUpload)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload PDF
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 transition-smooth focus:shadow-primary"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">
                    {filteredPdfs.length} document{filteredPdfs.length !== 1 ? 's' : ''}
                  </Badge>
                  
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'library' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'library' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="mb-8">
            <UploadButton onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* PDF Grid/List */}
        {filteredPdfs.length === 0 ? (
          <Card className="shadow-card text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {searchQuery ? 'No documents found' : 'Your library is empty'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No documents match "${searchQuery}". Try a different search term.`
                  : 'Start building your digital collection by uploading your first PDF document.'
                }
              </p>
              {!searchQuery && (
                <Button
                  variant="library"
                  size="lg"
                  onClick={() => setShowUpload(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Upload Your First PDF
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredPdfs.map((pdf) => (
              <PDFCard
                key={pdf.id}
                pdf={pdf}
                onDelete={handleDeletePDF}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;