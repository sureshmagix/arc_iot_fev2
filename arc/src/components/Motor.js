import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const Motor = ({ onPress }) => {

  const [iconColor, setIconColor] = useState('blue');
  const [info, setInfo] = useState('WAITING');
  const [isTouchable, setIsTouchable] = useState(true);

  

  return (
    <View style={styles.container}>
      <TouchableOpacity  onPress={onPress} disabled={!isTouchable}>
        <Svg width="100" height="100" viewBox="0 0 100 100">
          <Path
            d="M46 69V27c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4zM31 45h3v6h-3zM40 63V33c-2.2 0-4 1.8-4 4v22c0 2.2 1.8 4 4 4zM57 69h18v4H57zM76 67h8V29H48v38h28zM55 33h22c1.7 0 3 1.3 3 3s-1.3 3-3 3H55c-1.7 0-3-1.3-3-3s1.3-3 3-3zm0 12h22c1.7 0 3 1.3 3 3s-1.3 3-3 3H55c-1.7 0-3-1.3-3-3s1.3-3 3-3zm-3 15c0-1.7 1.3-3 3-3h22c1.7 0 3 1.3 3 3s-1.3 3-3 3H55c-1.7 0-3-1.3-3-3zm-23 1V35H15.4L13 37.4v21.2l2.4 2.4H29zm-8.7-20.7c.4-.4 1-.4 1.4 0 .2.2 5.3 5.3 5.3 9.7 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-4.4 5.1-9.5 5.3-9.7zM90 27h-4v42h4c2.2 0 4-1.8 4-4V31c0-2.2-1.8-4-4-4zM18 25h9.6l1.4-1.4V19H15v4.6l1.4 1.4zM19 27h6v6h-6zM6 45h5v6H6zM76 75H16.7l-2.3 6h71.2l-2.3-6z"
            fill={iconColor}
          />
        </Svg>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{info}</Text>
      </View>
    </View>

    
  );
};

export default Motor;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'left',
    padding: 10,
  },
  infoContainer: {
    marginTop: 1,
    alignItems: 'center',
  },
  infoText: {
    marginTop: 0,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#20232a',
    borderRadius: 5,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});