import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { fetchTTS } from './ttsApi';
import { sendAudioToSTT } from './sttApi';

const audioRecorderPlayer = new AudioRecorderPlayer();

const PlaybackScreen = () => {
  const [mp4Data, setMp4Data] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>('');
  const [status, setStatus] = useState<string>('대기 중...');
  const [textData, setTextData] = useState<string | null>(null);

  useEffect(() => {
    listenForServerData();
  }, []);

  // 서버에서 데이터를 받으면 자동 실행 (요청 X, 서버가 보낼 때만)
  const listenForServerData = async () => {
    try {
      setStatus('서버 데이터 대기 중...');

      // 서버에서 파일 수신
      const response = await fetch('http://test.server/testfile.txt');
      const data = await response.json();

      if (data.text) {
        setTextData(data.text);
        setStatus(`서버에서 데이터 수신: "${data.text}"`);
        requestTTSData(data.text);
      }
    } catch (error) {
      console.error('서버 데이터 수신 오류:', error);
      setStatus('서버 데이터 수신 실패');
    }
  };

  //Google Cloud TTS
  const requestTTSData = async (text: string) => {
    setStatus(`Google TTS 요청 중: "${text}"`);
    const base64Audio = await fetchTTS(text);

    if (base64Audio) {
      setStatus('Google TTS 데이터 수신 완료');
      setMp4Data(base64Audio);
    } else {
      setStatus('Google TTS 데이터 수신 실패');
    }
  };

  //
  const startRecording = async () => {
    if (recording) {
      setStatus('녹음 중지... 변환 중...');
      const audioPath = await audioRecorderPlayer.stopRecorder();
      const base64Audio = await RNFS.readFile(audioPath, 'base64');
      sendToSTT(base64Audio);
      setRecording(false);
    } else {
      setStatus('녹음 시작');
      setRecording(true);
      await audioRecorderPlayer.startRecorder();
    }
  };

  // 📌 Google STT로 녹음된 데이터 전송
  const sendToSTT = async (base64Audio: string) => {
    setStatus('Google STT 요청 중...');
    const textResult = await sendAudioToSTT(base64Audio);

    if (textResult) {
      setStatus('Google STT 변환 완료');
      setTranscription(textResult);
    } else {
      setStatus('Google STT 변환 실패');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>재생화면</Text>

      {/*상태 표시 UI (어두운 배경, 잘 보이는 글씨) */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* 서버에서 받은 txt 데이터 표시 */}
      {textData && (
        <Text style={styles.textDisplay}>서버 데이터: "{textData}"</Text>
      )}

      {/* Google Cloud TTS 변환된 MP4 자동 재생 */}
      {mp4Data && (
        <Video
          source={{ uri: `data:audio/mp4;base64,${mp4Data}` }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
      )}

      {/* 녹음 버튼 */}
      <TouchableOpacity style={styles.button} onPress={startRecording}>
        <Text style={styles.buttonText}>{recording ? '녹음 중지' : '녹음 시작'}</Text>
      </TouchableOpacity>

      {/* Google STT 변환된 텍스트 표시 */}
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  statusBox: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center'
  },
  statusText: { color: '#00FF00', fontSize: 16, fontWeight: 'bold' },

  textDisplay: { fontSize: 18, marginBottom: 10, fontWeight: 'bold', color: '#333' },

  button: { backgroundColor: '#FF3B30', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  video: { width: 300, height: 50, marginBottom: 20 },

  transcription: { marginTop: 20, fontSize: 16, fontWeight: 'bold', color: '#333' },
});

export default PlaybackScreen;
