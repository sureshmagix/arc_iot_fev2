import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Svg, { Path } from 'react-native-svg';

const Pump = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const iconColor = isConnected ? 'green' : 'red';

  return (
    <View style={styles.container}>
      <Svg width="200" height="200" viewBox="0 0 1024 1024">
        {/* Replace the below Path's d attribute with your SVG's path data */}
        <Path d="M164.327 88.809h232.902v308.103h-11.572l20.326 47.279a11.763 11.763 0 011.181 5.155c0 6.529-5.294 11.823-11.823 11.823H195.626v-.047c-1.318 0-2.658-.223-3.971-.693-6.122-2.192-9.305-8.934-7.113-15.055l17.363-48.462h-37.578c-10.333 0-19.732-4.231-26.547-11.045l-.026-.026c-6.814-6.815-11.046-16.214-11.046-26.548v-15.651H79.376c-5.759 0-11.008-2.358-14.8-6.151-3.785-3.785-6.148-9.022-6.148-14.797v-59.423H20.411C9.139 263.271 0 254.132 0 242.86c0-11.271 9.139-20.41 20.411-20.41h38.017v-59.423c0-5.773 2.351-11.011 6.144-14.803 3.793-3.793 9.03-6.144 14.804-6.144h47.332v-15.652c0-10.334 4.232-19.733 11.046-26.548l.026-.026c6.815-6.813 16.214-11.045 26.547-11.045zM247.214 0h105.097c17.73 0 32.233 14.536 32.233 32.233v.004c0 17.696-14.535 32.233-32.233 32.233H247.214c-17.697 0-32.233-14.505-32.233-32.233v-.004C214.981 14.503 229.486 0 247.214 0zM122.04 165.726H82.075v154.269h39.965V165.726zm298.836-76.238c23.617 2.73 44.866 13.533 60.888 29.557C500.421 137.7 512 163.44 512 191.757v109.537c0 26.302-10.757 50.211-28.083 67.535-16.333 16.334-38.515 26.828-63.041 27.976V89.488zm-58.625 312.798H224.994l-12.624 35.236h165.029l-15.148-35.236zm-161.583-218.22c-7.45 0-13.492-6.042-13.492-13.492 0-7.451 6.042-13.493 13.492-13.493h146.274c7.45 0 13.492 6.042 13.492 13.493 0 7.45-6.042 13.492-13.492 13.492H200.668zm0 147.512c-7.45 0-13.492-6.042-13.492-13.493 0-7.45 6.042-13.492 13.492-13.492h146.274c7.45 0 13.492 6.042 13.492 13.492 0 7.451-6.042 13.493-13.492 13.493H200.668zm0-73.756c-7.45 0-13.492-6.041-13.492-13.492 0-7.45 6.042-13.492 13.492-13.492h146.274c7.45 0 13.492 6.042 13.492 13.492 0 7.451-6.042 13.492-13.492 13.492H200.668" fill={iconColor} />
      </Svg>
      {/* <Text style={styles.text}>
        {isConnected ? 'Connected to Internet' : 'No Internet Connection'}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Pump;
