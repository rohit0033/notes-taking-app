import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import NoteCard from "@/components/NoteCard";
import { ArrowDownAZ } from "lucide-react";
import { Pencil, Image } from "lucide-react";
import RecordButton from "@/components/RecordButton";
import { useState, useEffect, useMemo } from 'react';
import { useNotes } from '@/hooks/useNotes';
interface RecordButtonProps {

  onTranscriptionComplete: (text: string) => Promise<void>;

}

const Index = () => {
  const [textInput, setTextInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTranscript, setEditingTranscript] = useState('');
  const { notes, createNote, isLoading, isLoadingNotes, setSearchQuery } = useNotes();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedNotes = useMemo(() => {
    const sorted = [...notes];
    if (sortOrder === 'asc') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [notes, sortOrder]);

  const handleTranscriptionEdit = (text: string) => {
    setEditingTranscript(text);
  };

  const handleEditTranscript = () => {
    if (editingTranscript) {
      setTextInput(editingTranscript);
      setIsEditing(true);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    try {
      await createNote({
        content: textInput.trim(),
        type: 'text'  // Always 'text' for manual text input
      });
      setTextInput('');
      // Reset editing states even if they weren't being used
      setIsEditing(false);
      setEditingTranscript('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleTranscriptionComplete = async (data: { content: string, type: 'audio' }) => {
    if (!data.content.trim()) return;
    
    try {
      await createNote(data);
      setEditingTranscript('');
      setTextInput(''); // Clear the input after saving
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving transcription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Sidebar />
      <div className="pl-0 md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="w-full md:w-96">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowDownAZ size={20} />
              <span>Sort {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingNotes ? (
              <div>Loading notes...</div>
            ) : sortedNotes.length === 0 ? (
              <div>No notes yet. Create your first note!</div>
            ) : (
              sortedNotes.map((note) => (
                <NoteCard 
                  key={note._id} // Change from id to _id
                  {...note}
                  hasAudio={note.type === 'audio'}
                  hasImage={false} // You can set this based on your note data structure
                />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white md:pl-64">
        <form onSubmit={handleTextSubmit} className="container max-w-screen-xl mx-auto flex items-center justify-center gap-2">
          <div className="relative flex items-center w-full max-w-xl">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="border rounded-full px-4 py-2 w-full outline-none"
              placeholder="Take notes..."
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !textInput.trim()}
              className="absolute right-2 rounded-full hover:bg-gray-100 p-2"
            >
              <Image className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <button 
            type="button" // Changed to button type
            onClick={handleEditTranscript}
            disabled={!editingTranscript || isLoading}
            className={`rounded-full hover:bg-gray-100 p-2 ${
              editingTranscript ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Pencil className="h-5 w-5" />
          </button>
          
          <RecordButton 
            onTranscriptionComplete={handleTranscriptionComplete}
            onTranscriptionEdit={handleTranscriptionEdit}
            editedText={isEditing ? textInput : undefined}
          />
        </form>
      </div>
    </div>
  );
};

export default Index;