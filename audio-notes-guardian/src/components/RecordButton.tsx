import { Mic, Save } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useTranscription } from "../hooks/useTranscription";
import { useNotes } from "../hooks/useNotes";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface RecordButtonProps {
  onTranscriptionComplete: (note: { content: string, type: 'audio' }) => Promise<void>;
  onTranscriptionEdit: (text: string) => void;
  editedText?: string; // Add this prop
}

const RecordButton = ({ onTranscriptionComplete, onTranscriptionEdit, editedText }: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const { startRecording, stopRecording, transcript, error } = useTranscription();
  const { createNote, isLoading: isNoteCreating } = useNotes();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleRecording = useCallback(async () => {
    if (!isRecording) {
      try {
        setIsRecording(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
        };

        mediaRecorder.start();
        await startRecording();

        // Automatically stop after 3 minutes
        recordingTimeoutRef.current = setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            stopRecording().then((data) => {
              if (data) onTranscriptionEdit(data.content);
            });
          }
        }, 60000); // 3 minutes in ms
      } catch (err) {
        console.error('Failed to start recording:', err);
        toast({
          variant: "destructive",
          title: "Recording failed",
          description: "Could not start recording. Please check your microphone permissions."
        });
      }
    } else {
      setIsRecording(false);
      mediaRecorderRef.current?.stop();
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }
      const noteData = await stopRecording();
      if (noteData) {
        setCurrentTranscript(noteData.content);
        onTranscriptionEdit(noteData.content); // Add this line to emit transcript for editing
      }
    }
  }, [isRecording, startRecording, stopRecording, onTranscriptionEdit]);

  const handleSave = async () => {
    // Use editedText if available, otherwise use currentTranscript
    const textToSave = editedText || currentTranscript;
    
    if (!textToSave) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No transcription to save"
      });
      return;
    }

    try {
      await onTranscriptionComplete({
        content: textToSave,
        type: 'audio'
      });
      setCurrentTranscript('');
      setAudioBlob(null);
      toast({
        title: "Success",
        description: "Note saved successfully"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save note"
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleToggleRecording}
          disabled={isNoteCreating}
          variant={isRecording ? "destructive" : "default"}
          className={`flex items-center gap-2 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`${
              isRecording ? 'animate-ping' : ''
            } absolute inline-flex h-full w-full rounded-full bg-white opacity-75`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <Mic className="h-4 w-4 mr-1" />
          {isRecording ? 'Recording...' : 'Record'}
        </Button>
        
        {!isRecording && currentTranscript && (
          <Button
            onClick={handleSave}
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Note
          </Button>
        )}
      </div>

      {/* Transcript display - now above the buttons */}
      {(isRecording || currentTranscript) && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <p className="text-sm font-medium text-gray-500 mb-1">
            {isRecording ? 'Recording transcript:' : 'Recorded transcript:'}
          </p>
          <p className="text-gray-700 text-sm max-h-32 overflow-y-auto">
            {isRecording ? transcript : currentTranscript || 'No transcript available'}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default RecordButton;