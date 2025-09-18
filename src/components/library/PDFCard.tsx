import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Trash2, Eye } from "lucide-react";
import { PDF } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface PDFCardProps {
  pdf: PDF;
  onDelete: (id: string) => void;
}

const PDFCard = ({ pdf, onDelete }: PDFCardProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/reader/${pdf.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth group border-0 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-smooth">
            <FileText className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-card-foreground truncate group-hover:text-primary transition-smooth">
              {pdf.title}
            </h3>
            
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Uploaded {formatDate(pdf.uploadDate)}</span>
            </div>
            
            <Badge variant="secondary" className="mt-3">
              PDF Document
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="library" 
            size="sm" 
            onClick={handleView}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View & Notes
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(pdf.id)}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PDFCard;