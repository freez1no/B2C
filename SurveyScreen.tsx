import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Video from 'react-native-video';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { fetchTTS } from './ttsApi';
import { sendAudioToSTT } from './sttApi';
import { fetchSurveyData, updateSheetResponse } from './sheetsApi';
import { LogContext } from './LogContext';

const audioRecorderPlayer = new AudioRecorderPlayer();

const SurveyScreen = ({ navigation }: { navigation: any }) => {
  const [surveyData, setSurveyData] = useState<Array<{ id: number; question: string }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [ttsAudio, setTtsAudio] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('대기 중...');
  const { addLog } = useContext(LogContext);

  // 데이터불러오기 버튼 핸들러
  const handleLoadData = async () => {
    setStatus('설문조사 데이터를 불러오는 중...');
    try {
      const data = await fetchSurveyData();
      setSurveyData(data);
      setStatus('설문조사 데이터 로드 완료');
      addLog('설문조사 데이터 로드 완료');
    } catch (error) {
      setStatus('데이터 불러오기 실패');
      addLog('데이터 불러오기 실패: ' + error);
    }
  };

  // 시작/다음 버튼 핸들러
  const handlePlayQuestion = async () => {
    if (surveyData.length === 0) {
      setStatus('먼저 데이터를 불러오세요.');
      addLog('데이터 없음: 설문조사 데이터를 불러오지 않음');
      return;
    }
    if (currentQuestionIndex >= surveyData.length) {
      setStatus('모든 설문 문항을 재생했습니다.');
      addLog('모든 설문 문항 재생 완료');
      return;
    }
    const question = surveyData[currentQuestionIndex].question;
    setStatus(`TTS 요청 중: "${question}"`);
    addLog(`TTS 요청: "${question}"`);
    try {
      const audioData = await fetchTTS(question);
      if (audioData) {
        setTtsAudio(audioData);
        setStatus('TTS 데이터 수신 완료');
        addLog('TTS 데이터 수신 완료');
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStatus('TTS 데이터 수신 실패');
        addLog('TTS 데이터 수신 실패');
      }
    } catch (error) {
      setStatus('TTS 요청 오류');
      addLog('TTS 요청 오류: ' + error);
    }
  };

  // 응답하기 버튼 핸들러 (녹음 및 STT 전송)
  const handleRecordResponse = async () => {
    if (recording) {
      setStatus('녹음 중지 및 STT 전송...');
      addLog('녹음 중지 및 STT 전송 시작');
      const audioPath = await audioRecorderPlayer.stopRecorder();
      const base64Audio = await RNFS.readFile(audioPath, 'base64');
      setRecording(false);
      try {
        const sttResult = await sendAudioToSTT(base64Audio);
        if (sttResult && sttResult.script) {
          setStatus('STT 변환 완료');
          addLog('STT 변환 완료: ' + sttResult.script);
          // Google Sheets에 응답 기록 업데이트 (타임스탬프와 함께 기록)
          const sheetResult = await updateSheetResponse(sttResult.script);
          if(sheetResult) {
            addLog('Google Sheets 업데이트 완료');
          } else {
            addLog('Google Sheets 업데이트 실패');
          }
        } else {
          setStatus('STT 변환 실패');
          addLog('STT 변환 실패');
        }
      } catch (error) {
        setStatus('STT 요청 오류');
        addLog('STT 요청 오류: ' + error);
      }
    } else {
      setStatus('녹음 시작');
      addLog('녹음 시작');
      setRecording(true);
      await audioRecorderPlayer.startRecorder();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>설문조사 기능화면</Text>

      {/* 상태 표시 영역 */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* 설문조사 데이터 테이블 */}
      <View style={styles.tableContainer}>
        <FlatList
          data={surveyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableText}>{item.question}</Text>
            </View>
          )}
        />
      </View>

      {/* TTS로 재생되는 오디오 */}
      {ttsAudio && (
        <Video
          source={{ uri: `data:audio/mpeg;base64,${ttsAudio}` }}
          style={styles.audioPlayer}
          controls
          resizeMode="contain"
        />
      )}

      {/* 하단 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLoadData}>
          <Text style={styles.buttonText}>데이터불러오기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePlayQuestion}>
          <Text style={styles.buttonText}>{currentQuestionIndex === 0 ? '시작' : '다음'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRecordResponse}>
          <Text style={styles.buttonText}>{recording ? '녹음 중지' : '응답하기'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Log')}>
          <Text style={styles.buttonText}>로그</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  statusBox: { backgroundColor: '#222', padding: 10, borderRadius: 8, marginBottom: 10 },
  statusText: { color: '#00FF00', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  tableContainer: { flex: 1, marginVertical: 10 },
  tableRow: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tableText: { fontSize: 16 },
  audioPlayer: { width: '100%', height: 50, marginVertical: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default SurveyScreen;
