import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default Button;
