import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LogContext } from './LogContext';

const LogScreen = ({ navigation }: { navigation: any }) => {
  const { logs } = useContext(LogContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>로그 화면</Text>
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  logContainer: { flex: 1, marginVertical: 10, borderWidth: 1, borderColor: '#ccc', padding: 10 },
  logText: { fontSize: 14, marginBottom: 5 },
  backButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'center', marginBottom: 20 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LogScreen;
