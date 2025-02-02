import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/services/api';
import { NoteData, Note, CreateNoteDto } from '@/types/note';

export const useNotes = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: notes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getAllNotes().then(res => res.data),
  });

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim() || !notes) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter((note) => 
      note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const { mutate: createNote, isPending: isLoading } = useMutation({
    mutationFn: (data: { content: string, type: 'text' | 'audio' }) => {
      const noteData: CreateNoteDto = {
        content: data.content,
        type: data.type,
      };
      return notesApi.createNote(noteData).then(res => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Mutation received ID:', id); // Add logging
      if (!id) {
        throw new Error('Note ID is required');
      }
      return await notesApi.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      throw error;
    }
  });

  // Change updateNote to include the full mutation object with mutateAsync
  const updateNote = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoteData> | FormData }) => {
      if (data instanceof FormData) {
        return notesApi.updateNoteWithImage(id, data);
      }
      return notesApi.updateNote(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { mutate: toggleNoteFavorite } = useMutation({
    mutationFn: (id: string) => notesApi.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { mutateAsync: uploadImageAsync } = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await notesApi.updateNoteWithImage(id, formData);
      return response.data;
    },
    onSuccess: () => {
      // Delay the invalidation slightly to ensure the backend has processed the image
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['notes'] });
      }, 500);
    },
  });

  return {
    notes: filteredNotes,
    isLoadingNotes,
    createNote,
    isLoading,
    searchQuery,
    setSearchQuery,
    deleteNote,
    updateNote, // now has mutateAsync
    toggleNoteFavorite,
    uploadImage: uploadImageAsync, // Return mutateAsync instead of mutate
  };
};
