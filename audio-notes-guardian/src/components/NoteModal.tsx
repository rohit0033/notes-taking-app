import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, Maximize2, Play, Share, Star, X, Edit, Minimize2, Plus } from "lucide-react";
import { Note } from '@/types/note';
import { useState, useRef, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface NoteModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

interface LocalImage {
  id: string;
  url: string;
  file?: File;
}

const NoteModal = ({ note, isOpen, onClose }: NoteModalProps) => {
  const queryClient = useQueryClient();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [uploadedImages, setUploadedImages] = useState(
    note.images || (note.image ? [note.image] : [])
  );
  const { toggleNoteFavorite, updateNote, uploadImage } = useNotes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);

  useEffect(() => {
    // Initialize local images from note
    if (note.images?.length) {
      setLocalImages(note.images.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url
      })));
    } else if (note.image) {
      setLocalImages([{
        id: Math.random().toString(36).substr(2, 9),
        url: note.image
      }]);
    }
  }, [note]);

  useEffect(() => {
    // Update images state when the note prop changes to have correct images
    setUploadedImages(note.images || (note.image ? [note.image] : []));
  }, [note]);

  const handleToggleFavorite = async () => {
    try {
      await toggleNoteFavorite(note._id);
      toast({ title: "Favorite status updated" });
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Failed to update favorite status" 
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      toast({ title: "Content copied to clipboard" });
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Failed to copy content" 
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedContent.trim()) return;
    try {
      await updateNote.mutateAsync({ id: note._id, data: { content: editedContent.trim() } });
      toast({ title: "Note updated successfully" });
    } catch {
      toast({ 
        variant: "destructive",
        title: "Failed to update note" 
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage: LocalImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: reader.result as string,
        file
      };
      setLocalImages(prev => [...prev, newImage]);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', note.type);
    formData.append('content', note.content);

    try {
      const updatedNote = await uploadImage({
        id: note._id,
        formData
      });

      if (updatedNote) {
        // Update cache with server response
        queryClient.setQueryData(['notes'], (oldNotes: Note[]) => {
          return oldNotes.map(n => 
            n._id === note._id ? updatedNote : n
          );
        });
        
        toast({ title: "Image uploaded successfully" });
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      // Remove local preview on error
      setLocalImages(prev => prev.filter(img => img.file !== file));
      toast({
        variant: "destructive",
        title: "Failed to upload image",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-4xl p-0 gap-0",
          isFullscreen && "fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none"
        )}
        style={ isFullscreen ? { top: 0, left: 0, transform: "none" } : {} }
      >
        <DialogHeader className="p-6 flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {isFullscreen ? (
              <Minimize2
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
            ) : (
              <Maximize2
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <Star 
              className={`cursor-pointer ${note.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={handleToggleFavorite}
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Share size={16} />
              Share
            </Button>
            <X className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={onClose} />
          </div>
        </DialogHeader>

        <div className="p-6 pt-0 overflow-y-auto h-[80vh]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">
              {note.type.charAt(0).toUpperCase() + note.type.slice(1)} Note
            </h2>
            <p className="text-sm text-gray-500">{formatDate(note.createdAt)}</p>
          </div>

          {note.type === 'audio' && (
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <Button size="icon" variant="outline" className="rounded-full">
                  <Play size={16} />
                </Button>
                <div className="w-96 h-1 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-full bg-purple-500 rounded-full relative">
                    <div className="absolute -right-1 -top-1.5 w-3 h-3 bg-purple-500 rounded-full" />
                  </div>
                </div>
                <span className="text-sm text-gray-500">00:00 / 00:09</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} />
                Download Audio
              </Button>
            </div>
          )}

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b">
              <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent">
                Notes
              </TabsTrigger>
              {note.type === 'audio' && (
                <>
                  <TabsTrigger value="transcript" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent">
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="speaker-transcript" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent">
                    Speaker Transcript
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger value="create" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent">
                Create
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-4">
              <p className="text-gray-600 mb-4">{note.content}</p>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Attachments</h3>
                
                <div className="flex items-center gap-2">
                  {localImages.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 group">
                      <img
                        src={img.url}
                        alt="Note attachment"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 flex items-center justify-center"
                  >
                    <Plus className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </TabsContent>
            {note.type === 'audio' && (
              <>
                <TabsContent value="transcript" className="mt-4">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-600">{note.content}</p>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={handleCopy}>
                      <Copy size={16} />
                      Copy
                    </Button>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 text-sm mt-4">
                    Read More
                  </button>
                </TabsContent>
                <TabsContent value="speaker-transcript" className="mt-4">
                  Speaker transcript content here
                </TabsContent>
              </>
            )}
            <TabsContent value="create" className="mt-4">
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded resize-none focus:outline-none"
                  rows={5}
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => setEditedContent(note.content)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>Save</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
