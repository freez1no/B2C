export const sendAudioToSTT = async (audioBase64: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=%REACT_APP_GOOGLE_CLOUD_API_KEY%`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            encoding: "LINEAR16",
            sampleRateHertz: 16000,
            languageCode: "ko-KR",
          },
          audio: { content: audioBase64 },
        }),
      }
    );
    const json = await response.json();
    if (json.results && json.results.length > 0) {
      const transcript = json.results[0].alternatives[0].transcript;
      return { script: transcript };
    } else {
      console.error("STT API 응답 오류:", json);
      return null;
    }
  } catch (error) {
    console.error('STT API error:', error);
    return null;
  }
};
