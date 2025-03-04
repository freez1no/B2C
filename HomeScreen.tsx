import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LogContext } from './LogContext';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { resetLogs, addLog } = useContext(LogContext);

  const handleResetLogs = () => {
    resetLogs();
    addLog("로그가 초기화되었습니다.");
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.jpg')} style={styles.logo} />
      <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate('Survey')}>
        <Text style={styles.enterButtonText}>입장하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logResetButton} onPress={handleResetLogs}>
        <Text style={styles.logResetText}>로그초기화</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 200, height: 200, resizeMode: 'contain', position: 'absolute', top: 50 },
  enterButton: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 },
  enterButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  logResetButton: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FF3B30', borderRadius: 50, padding: 15 },
  logResetText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});

export default HomeScreen;
