import 'react-native-gesture-handler';
import {Text, StyleSheet, View} from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserScreen from './src/screens/UserScreen';
import Icon from 'react-native-vector-icons/Entypo';
import DrawerContent from './DrawerContent';

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
          headerStyle: {
          backgroundColor: 'blue',
        },
        statusBarColor: 'blue',
        headerTintColor: 'white',
        headerTitleAlign: 'center',

      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{        
        headerLeft:()=>{
          return(
            <Icon 
            name='menu' 
            onPress={()=>navigation.dispatch(DrawerActions.openDrawer)}
            size={30} 
            color="white" />
          )
        }}}/>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
};

const DrawerNav=()=>{
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
    drawerContent={props=><DrawerContent {...props}/>}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="Home" component={StackNav} />
    </Drawer.Navigator>
  );
}

const App = () => {
  
  return (
    <NavigationContainer>
      <DrawerNav/>
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
