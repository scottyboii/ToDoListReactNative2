import { Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import ToDoScreen from './src/screens/ToDoScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
          name="ToDo"
          component={ToDoScreen}/>
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});
