import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimerSelector = () => {
  const [timers, setTimers] = useState(Array.from({ length: 8 }, () => ({ onTime: null, offTime: null })));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTimerIndex, setSelectedTimerIndex] = useState(null);
  const [isOnTimePicker, setIsOnTimePicker] = useState(true);

  const showDatePicker = (index, isOnTime) => {
    setSelectedTimerIndex(index);
    setIsOnTimePicker(isOnTime);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const updatedTimers = [...timers];
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isOnTimePicker) {
      updatedTimers[selectedTimerIndex].onTime = timeString;
    } else {
      updatedTimers[selectedTimerIndex].offTime = timeString;
    }
    setTimers(updatedTimers);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {timers.map((item, index) => (
          <View key={index} style={styles.timerRow}>
            <Text style={styles.timerLabel}>Timer Set {index + 1}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => showDatePicker(index, true)}
              >
                <Text style={styles.buttonText}>Set On Time</Text>
              </TouchableOpacity>
              <Text style={styles.timeText}>{item.onTime || 'Not set'}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => showDatePicker(index, false)}
              >
                <Text style={styles.buttonText}>Set Off Time</Text>
              </TouchableOpacity>
              <Text style={styles.timeText}>{item.offTime || 'Not set'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  timerRow: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    flexGrow: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    minWidth: 70,
    textAlign: 'right',
  },
});

export default TimerSelector;
