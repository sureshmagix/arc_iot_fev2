import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Check from 'react-native-vector-icons/FontAwesome5';

const ICSAlert = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        Alert.alert(
          'Check Internet Connection',
          'App Will close',
          [
            {
              text: 'Try Again',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
      }
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const iconColor = isConnected ? 'green' : 'red';

  return (
    <View style={styles.container}>
      <Check name="globe" size={20} color={iconColor} />
      <Text style={styles.text}>
        {isConnected ? 'Connected to Internet' : 'NO INTERNET'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    padding: 5,
    borderRadius: 5,
    borderColor: 'black',
  },
  text: {
    color: 'black',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 5, // Space between the icon and text
  },
});

export default ICSAlert;
