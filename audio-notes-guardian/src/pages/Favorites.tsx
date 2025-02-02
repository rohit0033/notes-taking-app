import React from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import NoteCard from "@/components/NoteCard";
import { useNotes } from "@/hooks/useNotes";

const Favorites = () => {
  const { notes, setSearchQuery, isLoadingNotes } = useNotes();

  // Only show favorite notes
  const favoriteNotes = notes.filter((note) => note.isFavorite);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Sidebar />
      <div className="pl-0 md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="w-full md:w-96">
              <SearchBar onSearch={setSearchQuery} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingNotes ? (
              <div>Loading notes...</div>
            ) : favoriteNotes.length === 0 ? (
              <div>No favorite notes yet.</div>
            ) : (
              favoriteNotes.map((note) => (
                <NoteCard key={note._id} {...note} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;