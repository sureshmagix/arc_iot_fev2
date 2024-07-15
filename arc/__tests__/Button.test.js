import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/Button';

test('Button renders correctly and handles press', () => {
  const onPressMock = jest.fn();

  const { getByText } = render(<Button onPress={onPressMock} title="Click Me" />);

  const button = getByText('Click Me');
  
  fireEvent.press(button);

  expect(onPressMock).toHaveBeenCalled();
});
