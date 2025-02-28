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

  useEffect(() => {
    requestTTSData('Hello, this is a test message.');
  }, []);

  // Google TTS에서 오디오 가져오기
  const requestTTSData = async (text: string) => {
    const base64Audio = await fetchTTS(text);
    if (base64Audio) {
      setMp4Data(base64Audio);
    }
  };

  // 녹음 시작 및 종료
  const startRecording = async () => {
    if (recording) {
      const audioPath = await audioRecorderPlayer.stopRecorder();
      const base64Audio = await RNFS.readFile(audioPath, 'base64');
      sendToSTT(base64Audio);
      setRecording(false);
    } else {
      setRecording(true);
      await audioRecorderPlayer.startRecorder();
    }
  };

  // Google STT로 음성 데이터 전송
  const sendToSTT = async (base64Audio: string) => {
    const textResult = await sendAudioToSTT(base64Audio);
    setTranscription(textResult);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TEST_SCREEN</Text>
      {mp4Data && (
        <Video
          source={{ uri: `data:audio/mp3;base64,${mp4Data}` }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
      )}
      <TouchableOpacity style={styles.button} onPress={startRecording}>
        <Text style={styles.buttonText}>{recording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#FF3B30', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  video: { width: 300, height: 50, marginBottom: 20 },
  transcription: { marginTop: 20, fontSize: 16 },
});

export default PlaybackScreen;
