import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const InternetConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const containerStyle = {
    backgroundColor: isConnected ? 'green' : 'red',
  };

  const textStyle = {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.buttondesign, textStyle]}>
        {isConnected ? 'Connected to Internet' : 'No Internet Connection'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',

  },

});

export default InternetConnectionStatus;
