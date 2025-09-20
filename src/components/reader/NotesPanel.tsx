import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X, StickyNote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/lib/api';

interface NotesPanelProps {
  pdfId: string;
}

const NotesPanel = ({ pdfId }: NotesPanelProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Local storage key and helpers
  const storageKey = `demo-notes:${pdfId}`;
  const saveNotesToStorage = (items: Note[]) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, [pdfId]);

  const loadNotes = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setNotes(JSON.parse(raw));
      } else {
        setNotes([]);
      }
    } catch (e) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSaving(true);
    try {
      const mockNote: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pdfId,
        userId: 'demo-user'
      };
      const updated = [mockNote, ...notes];
      setNotes(updated);
      saveNotesToStorage(updated);
      setNewNote('');
      toast({ title: 'Note added', description: 'Your note has been saved locally' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    setSaving(true);
    try {
      const updated = notes.map(n =>
        n.id === noteId ? { ...n, content: editContent.trim(), updatedAt: new Date().toISOString() } : n
      );
      setNotes(updated);
      saveNotesToStorage(updated);
      setEditingNote(null);
      setEditContent('');
      toast({ title: 'Note updated', description: 'Your changes have been saved locally' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const updated = notes.filter(n => n.id !== noteId);
    setNotes(updated);
    saveNotesToStorage(updated);
    toast({ title: 'Note deleted', description: 'The note has been removed' });
  };

  const startEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="note-panel h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-panel h-full flex flex-col">
      {/* Header */}
      <Card className="border-b rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5 text-accent" />
            <span>Notes</span>
            <Badge variant="secondary">{notes.length}</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Add New Note */}
      <Card className="border-b rounded-none">
        <CardContent className="p-4">
          <Textarea
            placeholder="Add a new note about this document..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-3 resize-none transition-smooth focus:shadow-primary"
            rows={3}
          />
          <Button
            variant="default"
            size="sm"
            onClick={handleAddNote}
            disabled={!newNote.trim() || saving}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {saving ? 'Adding...' : 'Add Note'}
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No notes yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first note to get started
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="shadow-card border-l-4 border-l-accent">
                <CardContent className="p-4">
                  {editingNote === note.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="resize-none transition-smooth focus:shadow-primary"
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleEditNote(note.id)}
                          disabled={!editContent.trim() || saving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <p className="text-card-foreground whitespace-pre-wrap mb-3">
                        {note.content}
                      </p>
                      
                      <Separator className="mb-3" />
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {note.createdAt !== note.updatedAt ? (
                            <span>Updated {formatDate(note.updatedAt)}</span>
                          ) : (
                            <span>Created {formatDate(note.createdAt)}</span>
                          )}
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(note)}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotesPanel;