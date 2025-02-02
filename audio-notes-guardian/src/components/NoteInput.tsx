import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NoteData } from '@/types/note';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const NoteInput = () => {
  const [textInput, setTextInput] = useState('');
  const { createNote, isLoading } = useNotes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    try {
      const noteData: NoteData = {
        title: 'Text Note',
        content: textInput.trim(),
        type: 'text'
      };
      
      await createNote(noteData);
      setTextInput('');
      toast({
        title: "Success",
        description: "Note created successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create note"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <Textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Type your note here..."
        className="min-h-[100px]"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !textInput.trim()}>
        {isLoading ? 'Saving...' : 'Save Note'}
      </Button>
    </form>
  );
};
