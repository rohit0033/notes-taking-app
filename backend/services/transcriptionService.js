class TranscriptionService {
  constructor() {
    if (typeof window !== 'undefined') {
      this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = null;
    }
  }

  startTranscription() {
    return new Promise((resolve, reject) => {
      if (!this.SpeechRecognition) {
        reject(new Error('Speech recognition is not supported in this environment'));
        return;
      }

      try {
        this.recognition = new this.SpeechRecognition();
        
        // Configure the recognition
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        let finalTranscript = '';
        let interimTranscript = '';

        this.recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript = transcript;
            }
          }
        };

        this.recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          reject(new Error(`Speech recognition error: ${event.error}`));
        };

        this.recognition.onend = () => {
          console.log('Speech recognition ended');
          resolve(finalTranscript.trim());
        };

        // Start recording with timeout
        this.recognition.start();
        console.log('Speech recognition started');

        // Stop after 60 seconds (maximum duration)
        setTimeout(() => {
          if (this.recognition) {
            this.recognition.stop();
          }
        }, 60000);

      } catch (error) {
        console.error('Speech recognition setup failed:', error);
        reject(error);
      }
    });
  }

  stopTranscription() {
    return new Promise((resolve) => {
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
        resolve();
      }
    });
  }
}

export const transcriptionService = new TranscriptionService();

// Helper function for direct use
export const transcribeAudio = () => {
  return transcriptionService.startTranscription();
};

// Helper function to stop transcription
export const stopTranscription = () => {
  return transcriptionService.stopTranscription();
};
