import axios from 'axios';
import { Note, NoteData, CreateNoteDto } from '@/types/note';
import env from '@/config/env.config';

const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) => api.post('/auth/login', JSON.stringify(credentials), {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  signup: (userData: { name: string; email: string; password: string }) => api.post('/auth/signup', JSON.stringify(userData), {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
};

export const notesApi = {
  getAllNotes: () => api.get<Note[]>('/notes'),
  getNote: (id: string) => api.get<Note>(`/notes/${id}`),
  createNote: (noteData: CreateNoteDto) => api.post<Note>('/notes', noteData),
  updateNote: (id: string, noteData: Partial<NoteData>) => {
    if (!id) throw new Error('Note ID is required');
    return api.put<Note>(`/notes/${id}`, noteData);
  },
  deleteNote: (id: string) => {
    console.log('API delete request for ID:', id); // Debug log
    if (!id || typeof id !== 'string') {
      throw new Error('Valid note ID is required');
    }
    return api.delete<void>(`/notes/${id}`);
  },
  toggleFavorite: (id: string) => api.patch<Note>(`/notes/${id}/favorite`),
  updateNoteWithImage: (id: string, formData: FormData) => 
    api.put<Note>(`/notes/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
