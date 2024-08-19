import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

function HomeScreen(props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            props.navigation.navigate('MqttScreen');
        }, 5000);

        // Clean up the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.viewStyle}>
            <Image source={require('../assets/logo.png')} style={styles.logoStyle} />
            <Text style={styles.headingStyle}>Welcome to ArchidTech</Text>
            <Text style={styles.textStyle}>This is Home screen</Text>
            <Button title='START' onPress={() => props.navigation.navigate('MqttScreen')} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f0f0f0', // Adding a light background color
    },
    logoStyle: {
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        marginBottom: 20,
    },
    textStyle: {
        fontSize: 20,
        color: 'black',
        marginBottom: 20,
    },
    headingStyle: {
        fontSize: 24,
        color: '#333333',
        textAlign: "center",
        marginBottom: 20,
        fontWeight: 'bold', // Make the text bold
    }
});

export default HomeScreen;
