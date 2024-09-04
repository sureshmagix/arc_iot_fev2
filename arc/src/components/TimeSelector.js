import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimerSelector = ({ visible, onClose }) => {
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
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>Timer Selector</Text>
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%', // Adjust max height to ensure everything fits, including the close button
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-between', // Ensure close button is always visible
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  timerRow: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
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
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TimerSelector;

// const [isTimerSelectorVisible, setTimerSelectorVisible] = useState(false);

// <Button title="Open Timer Selector" onPress={() => setTimerSelectorVisible(true)} />
// <TimerSelector visible={isTimerSelectorVisible} onClose={() => setTimerSelectorVisible(false)} />
