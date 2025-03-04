// LogScreen.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LogContext } from './LogContext';

const LogScreen = () => {
  const navigation = useNavigation();
  const { logs } = useContext(LogContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>로그 화면</Text>
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonLabel}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  logContainer: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  logText: { fontSize: 14, marginBottom: 5 },
  backButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  buttonLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LogScreen;
