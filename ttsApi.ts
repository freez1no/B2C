export const fetchTTS = async (text: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=%EACT_APP_GOOGLE_CLOUD_API_KEY%`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: "ko-KR", name: "ko-KR-Standard-A" },
          audioConfig: { audioEncoding: "MP3" },
        }),
      }
    );
    const json = await response.json();
    if (json.audioContent) {
      return json.audioContent; // base64 인코딩된 MP3 데이터
    } else {
      console.error("TTS API 응답 오류:", json);
      return null;
    }
  } catch (error) {
    console.error('TTS API error:', error);
    return null;
  }
};
