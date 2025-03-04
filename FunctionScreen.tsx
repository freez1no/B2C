// FunctionScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { fetchTTS } from './ttsApi';
import { sendAudioToSTT } from './sttApi';
import { fetchSurveyData } from './sheetsApi';
import { LogContext } from './LogContext';
import Video from 'react-native-video';

const audioRecorderPlayer = new AudioRecorderPlayer();

const FunctionScreen = () => {
  const navigation = useNavigation();
  const { addLog } = useContext(LogContext);

  const [surveyData, setSurveyData] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [ttsAudio, setTtsAudio] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [sttResult, setSttResult] = useState<string>('');

  // Google Sheets API로부터 설문 데이터 불러오기
  const handleFetchData = async () => {
    addLog('Google Sheets API 호출: 데이터 불러오기 시작');
    try {
      const data = await fetchSurveyData();
      setSurveyData(data);
      addLog(`Google Sheets API 응답: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Google Sheets API 오류: ${error}`);
    }
  };

  // 현재 설문 문항을 Google TTS를 통해 재생
  const handleStart = async () => {
    if (surveyData.length === 0) {
      Alert.alert('오류', '먼저 데이터를 불러와주세요.');
      return;
    }
    if (currentQuestionIndex >= surveyData.length) {
      Alert.alert('완료', '모든 설문 문항이 재생되었습니다.');
      return;
    }
    const question = surveyData[currentQuestionIndex];
    addLog(`Google TTS 호출: "${question}"`);
    try {
      const audioData = await fetchTTS(question);
      setTtsAudio(audioData);
      addLog(`Google TTS 응답 수신 완료 (문항 ${currentQuestionIndex + 1})`);
      setCurrentQuestionIndex(prev => prev + 1);
    } catch (error) {
      addLog(`Google TTS 오류: ${error}`);
    }
  };

  // 사용자 음성 녹음 및 STT 변환
  const handleResponse = async () => {
    if (recording) {
      addLog('녹음 중지 및 STT 전송 요청');
      const audioPath = await audioRecorderPlayer.stopRecorder();
      const base64Audio = await RNFS.readFile(audioPath, 'base64');
      setRecording(false);
      try {
        const transcript = await sendAudioToSTT(base64Audio);
        setSttResult(transcript);
        addLog(`Google STT 응답: ${transcript}`);
      } catch (error) {
        addLog(`Google STT 오류: ${error}`);
        addLog(`Google STT 응답: ${JSON.stringify(fullResponse)}`);
      }
    } else {
      addLog('녹음 시작');
      setRecording(true);
      await audioRecorderPlayer.startRecorder();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>설문조사 데이터</Text>
      <View style={styles.tableContainer}>
        <FlatList
          data={surveyData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableText}>{item}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFetchData}>
          <Text style={styles.buttonLabel}>데이터불러오기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleStart}>
          <Text style={styles.buttonLabel}>{currentQuestionIndex === 0 ? '시작' : '다음'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleResponse}>
          <Text style={styles.buttonLabel}>{recording ? '녹음 중지' : '응답'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Log')}>
          <Text style={styles.buttonLabel}>로그</Text>
        </TouchableOpacity>
      </View>
      {ttsAudio && (
        <Video
          source={{ uri: `data:audio/mp4;base64,${ttsAudio}` }}
          style={styles.audioPlayer}
          controls
          resizeMode="contain"
          onEnd={() => {}}
        />
      )}
      {sttResult !== '' && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>응답 결과: {sttResult}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  tableContainer: { flex: 1, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  tableRow: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  tableText: { fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  actionButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  audioPlayer: { width: '100%', height: 50, marginTop: 10 },
  responseContainer: { marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
  responseText: { fontSize: 16, color: '#333' },
});

export default FunctionScreen;
