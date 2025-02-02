export interface NoteData {
  title: string;
  content: string;
  type: 'text' | 'audio';
  audio?: Blob;
  image?: string;
}

export interface Note {
  _id: string; // Update this line - MongoDB uses _id
  content: string;
  type: 'text' | 'audio';
  image?: string; // existing single image field
  images?: string[]; // Added to support multiple images
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  content: string;
  type: 'text' | 'audio';
  image?: string;
}
