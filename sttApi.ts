export const sendAudioToSTT = async (base64Audio: string) => {
  try {
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=%REACT_APP_GOOGLE_CLOUD_API_KEY%`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS', // WebM으로 녹음될 경우
          sampleRateHertz: 16000,
          languageCode: 'en-US'
        },
        audio: {
          content: base64Audio
        }
      })
    });

    const data = await response.json();
    return data.results[0]?.alternatives[0]?.transcript || '인식 실패';
  } catch (error) {
    console.error('Google STT API 호출 오류:', error);
    return '오류 발생';
  }
};
