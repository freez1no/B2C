// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import FunctionScreen from './FunctionScreen';
import LogScreen from './LogScreen';
import { LogProvider } from './LogContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LogProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Function" component={FunctionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Log" component={LogScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </LogProvider>
  );
}
