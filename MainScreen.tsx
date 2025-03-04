// MainScreen.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LogContext } from './LogContext';

const MainScreen = () => {
  const navigation = useNavigation();
  const { clearLogs } = useContext(LogContext);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.jpg')} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate('Function')}>
        <Text style={styles.buttonText}>입장하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logResetButton} onPress={clearLogs}>
        <Text style={styles.logResetText}>로그초기화</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 200, height: 200, marginBottom: 20 },
  enterButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logResetButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logResetText: { color: '#fff', fontSize: 10, textAlign: 'center' },
});

export default MainScreen;
