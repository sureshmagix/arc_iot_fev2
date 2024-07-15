import { Text, StyleSheet, View } from 'react-native';
import {NavigationContainer, useNavigation, DrawerActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserScreen from './src/screens/UserScreen';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
<NavigationContainer>
  <Stack.Navigator initialRouteName='Home' screenOptions={
      {
        statusBarColor:"blue",
        headerTintColor:'white',
        headerTitleAlign:"center",
        headerStyle:{
          backgroundColor:"blue",
                        
        }
      }
      } >
    <Stack.Screen name='Home' component = {HomeScreen} 
    />
    <Stack.Screen name='Profile' component = {ProfileScreen} />
    <Stack.Screen name='User' component = {UserScreen} />
  </Stack.Navigator>
</NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
