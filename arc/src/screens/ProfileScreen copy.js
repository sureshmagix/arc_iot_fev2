import React from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';

function ProfileScreen(props){
    console.log(props);
    return(
        <View style={styles.viewStyle}>

        <Text style={styles.headingStyle}>React Native </Text>
        <Text style={styles.textStyle}>This is Profile screen </Text>
        <Button title='User' onPress={()=> props.navigation.navigate('User')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewStyle:{
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        flex:1,

    },

    textStyle:{
        fontSize: 28,
        color:'black',
    },
    headingStyle:{
        fontSize: 30,
        color:'black',
        textAlign:"center",
    }

}
)
export default ProfileScreen;