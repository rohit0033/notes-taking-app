import { useState, useEffect } from "react";
import { Mic, Image as ImageIcon, Copy, Trash2, Edit2, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNotes } from "@/hooks/useNotes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import NoteModal from "./NoteModal";
import { Note } from '@/types/note';
import { formatDate } from '@/utils/formatDate';

interface NoteCardProps extends Note {
  hasAudio?: boolean;
  hasImage?: boolean;
}

const NoteCard = ({ _id, content: initialContent, type, createdAt, updatedAt, hasAudio, hasImage, isFavorite }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [currentContent, setCurrentContent] = useState(initialContent);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteNote, updateNote } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event bubbling
    try {
      await navigator.clipboard.writeText(initialContent);
      toast({
        title: "Copied!",
        description: "Note content copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Attempting to delete note:', _id); // Debug log
      if (!_id) {
        console.error('Missing note ID');
        return;
      }

      await deleteNote(_id);
      setShowDeleteDialog(false);
      toast({
        title: "Success",
        description: "Note deleted successfully"
      });
    } catch (err) {
      console.error('Delete error:', err);
      setShowDeleteDialog(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete note. Please try again."
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event bubbling
    setIsEditing(!isEditing);
  };

  const handleUpdate = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!editedContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Note content cannot be empty"
      });
      return;
    }

    try {
      await updateNote.mutateAsync({
        id: _id,
        data: {
          content: editedContent.trim(),
          type
        }
      });
      
      setCurrentContent(editedContent.trim());
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Note updated successfully"
      });
    } catch (err) {
      console.error('Update error:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update note. Please try again."
      });
      setEditedContent(currentContent);
    }
  };

  // Ensure content stays in sync with prop changes
  useEffect(() => {
    setEditedContent(initialContent);
    setCurrentContent(initialContent);
  }, [initialContent]);

  return (
    <>
      <div 
        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
        onClick={() => !isEditing && setIsModalOpen(true)} // Only open modal if not editing
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 items-center text-gray-500">
            {type === 'audio' && <Mic size={16} />}
            {hasImage && <ImageIcon size={16} />}
          </div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}> {/* Stop event bubbling for all buttons */}
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit note"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="p-1 hover:bg-gray-100 rounded text-red-500"
              title="Delete note"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div onClick={e => e.stopPropagation()} className="flex flex-col gap-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  setEditedContent(initialContent); // Reset content on cancel
                }}
                className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate();
                }}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 mb-2">{currentContent}</p>
        )}

        <div className="text-xs text-gray-500">
          {formatDate(createdAt)}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
              disabled={!_id}
            >
              Delete
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NoteModal
        note={{
          _id,
          content: initialContent,
          type,
          createdAt,
          updatedAt: updatedAt || createdAt, // Use createdAt as fallback
          isFavorite: isFavorite || false,
          image: hasImage ? 'path/to/image' : undefined,
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default NoteCard;