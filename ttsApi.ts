// ttsApi.ts
export const fetchTTS = async (text: string): Promise<string> => {
  // 실제 Google Cloud TTS API 키 또는 인증 토큰을 입력하세요.
  const API_KEY = '%REACT_APP_GOOGLE_CLOUD_API_KEY%';
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

  const requestBody = {
    input: { text },
    voice: { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-A' },
    audioConfig: { audioEncoding: 'MP3' } // 또는 LINEAR16, OGG_OPUS 등 사용 가능
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.audioContent) {
    return data.audioContent; // base64 인코딩된 오디오 문자열
  }
  throw new Error('TTS 응답에 audioContent가 없습니다.');
};
