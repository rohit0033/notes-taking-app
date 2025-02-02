import { useState, useCallback } from 'react';
import { NoteData } from '@/types/note';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

export const useTranscription = () => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  let recognition: SpeechRecognition | null = null;

  const startRecording = useCallback(async () => {
    setTranscript('');
    setError(null);
    return new Promise<void>((resolve, reject) => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error('Speech recognition is not supported in this browser.');
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const finalTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');
          setTranscript(finalTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(event.error);
          reject(event.error);
        };

        recognition.start();
        resolve();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start recording');
        reject(err);
      }
    });
  }, []);

  const stopRecording = useCallback(async (): Promise<NoteData> => {
    return new Promise((resolve, reject) => {
      if (recognition) {
        recognition.onend = () => {
          resolve({
            title: 'Voice Note',
            content: transcript,
            type: 'audio'
          });
        };
        recognition.stop();
      } else {
        resolve({
          title: 'Voice Note',
          content: transcript,
          type: 'audio'
        });
      }
    });
  }, [transcript]);

  return {
    startRecording,
    stopRecording,
    transcript,
    error
  };
};
