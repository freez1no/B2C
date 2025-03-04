import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SurveyScreen from './SurveyScreen';
import LogScreen from './LogScreen';
import { LogProvider } from './LogContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LogProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Survey" component={SurveyScreen} />
          <Stack.Screen name="Log" component={LogScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LogProvider>
  );
}
