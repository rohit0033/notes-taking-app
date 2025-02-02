export const transcribeAudio = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      reject(event.error);
    };

    recognition.onend = () => {
      resolve(finalTranscript);
    };

    recognition.start();
  });
};
