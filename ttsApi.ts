export const fetchTTS = async (text: string) => {
  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=%REACT_APP_GOOGLE_CLOUD_API_KEY%`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' }
      })
    });

    const data = await response.json();
    return data.audioContent; // Base64 MP3 데이터 반환
  } catch (error) {
    console.error('Google TTS API 호출 오류:', error);
    return null;
  }
};
