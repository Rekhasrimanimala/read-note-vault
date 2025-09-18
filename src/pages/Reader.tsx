import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PDFViewer from '@/components/reader/PDFViewer';
import NotesPanel from '@/components/reader/NotesPanel';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDF, pdfAPI } from '@/lib/api';

const Reader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<PDF | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadPDF();
    }
  }, [id]);

  const loadPDF = async () => {
    if (!id) return;

    try {
      const response = await pdfAPI.getById(id);
      setPdf(response.data);
    } catch (error) {
      console.error('Error loading PDF:', error);
      // For demo purposes, show mock data if API fails
      const mockPDF: PDF = {
        id: id,
        title: 'Sample Document',
        filename: 'sample.pdf',
        uploadDate: new Date().toISOString(),
        userId: 'demo-user'
      };
      setPdf(mockPDF);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/library');
  };

  if (loading) {
    return (
      <div className="h-screen gradient-subtle flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="h-screen gradient-subtle flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="shadow-elevated p-8 text-center">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Document not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The requested document could not be found.
            </p>
            <Button variant="library" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      
      {/* Reader Controls */}
      <div className="border-b bg-card px-4 py-2 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center"
        >
          {showNotes ? (
            <>
              <PanelRightClose className="h-4 w-4 mr-2" />
              Hide Notes
            </>
          ) : (
            <>
              <PanelRightOpen className="h-4 w-4 mr-2" />
              Show Notes
            </>
          )}
        </Button>
      </div>

      {/* Reader Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer */}
        <div className={`flex-1 ${showNotes ? 'border-r' : ''}`}>
          <PDFViewer
            pdfUrl={`/api/pdf/${pdf.id}/file`} // This would be the actual PDF file URL
            title={pdf.title}
          />
        </div>

        {/* Notes Panel */}
        {showNotes && (
          <div className="w-80 xl:w-96 border-l">
            <NotesPanel pdfId={pdf.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reader;