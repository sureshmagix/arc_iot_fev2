import 'react-native-gesture-handler';
import {Text, StyleSheet, View} from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {useEffect, useState} from 'react';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserScreen from './src/screens/UserScreen';
import Icon from 'react-native-vector-icons/Entypo';
import DrawerContent from './DrawerContent';
import SmsScreen from './src/screens/SmsScreen';
import LoginPage from './src/screens/Login&Register/LoginScreen';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import RegisterScreen from './src/screens/Login&Register/RegisterScreen';
import UpdateProfile from './src/screens/Login&Register/UpdateProfile/UpdateProfile';
import CallScreen from './src/screens/CallScreen';
import StarterScreen from './src/screens/StarterScreen';
import UpdateStarter from './src/screens/UpdateStarter'
import updateStarter from './src/screens/UpdateStarter';
import RegisterStarter from './src/screens/RegisterStarter';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'green',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: 'red',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'red',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarColor: '#0163d2',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0163d2',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>

<Stack.Screen
        name="App Home"
        component={HomeScreen}
        options={
          {
            headerLeft: () => {
              return (
                <Icon
                  name="menu"
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  size={30}
                  color="#fff"
                />
              );
            },
          }
        }
      />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{
          headerShown: false,
        }}
      />

<Stack.Screen name="StarterScreen" component={StarterScreen} options={{
          headerShown: false,
        }} />

<Stack.Screen name="UpdateStarter" component={updateStarter} options={{
          headerShown: false,
        }} />

<Stack.Screen name="RegisterStarter" component={RegisterStarter} options={{
          headerShown: false,
        }} />

            <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerShown: false,
        }}
      />
<Stack.Screen name="SmsScreen" component={SmsScreen}  options={
          {
            title: 'SMS Command',
            headerLeft: () => {
              return (
                <Icon
                  name="menu"
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  size={30}
                  color="#fff"
                />
              );
            },
          }
        }/>
  
  <Stack.Screen name="CallScreen" component={CallScreen}  options={
          {
            title: 'Call Starter',
            headerLeft: () => {
              return (
                <Icon
                  name="menu"
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  size={30}
                  color="#fff"
                />
              );
            },
          }
        }/>

    </Stack.Navigator>
  );
};


const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="Home" component={StackNav} />
    </Drawer.Navigator>
  );
};


const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={DrawerNav} />

    </Stack.Navigator>
  );
};

const AdminStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          statusBarColor: '#0163d2',
          headerShown: true,
          headerBackVisible:false,
          headerStyle: {
            backgroundColor: '#0163d2',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
        name="AdminScreen"
        component={AdminScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={LoginNav}
      />
    </Stack.Navigator>
  );
};



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setuserType] = useState(false);
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    const userType1 = await AsyncStorage.getItem('userType');
    console.log(data, 'at app.jsx');
    setIsLoggedIn(data);
    setuserType(userType1);
  }

  useEffect(() => {
    getData();
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 900);
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
 {isLoggedIn && userType == 'Admin' ? (
        <AdminStack/>
      ) : isLoggedIn ? (
        <DrawerNav />
      ) : (
        <LoginNav />
      )}
      <Toast config={toastConfig} />
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