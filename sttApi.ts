// sttApi.ts
export const sendAudioToSTT = async (
  audioBase64: string
): Promise<{ transcript: string; fullResponse: any }> => {
  // 실제 Google Cloud Speech API 키 또는 인증 토큰을 입력하세요.
  const API_KEY = 'your-stt-api-key';
  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`;

  // 녹음된 오디오의 인코딩과 샘플레이트는 AudioRecorderPlayer 설정과 일치해야 합니다.
  const requestBody = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'ko-KR',
    },
    audio: {
      content: audioBase64,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`STT API error: ${response.statusText}, ${errorText}`);
  }

  const data = await response.json();

  // 전체 JSON 응답을 콘솔에 출력 (필요시 호출하는 쪽에서 로그에 추가할 수 있음)
  console.log("STT full response:", data);

  if (
    data.results &&
    data.results.length > 0 &&
    data.results[0].alternatives &&
    data.results[0].alternatives.length > 0
  ) {
    return {
      transcript: data.results[0].alternatives[0].transcript,
      fullResponse: data,
    };
  }
  throw new Error('STT 응답에 변환된 텍스트가 없습니다.');
};
