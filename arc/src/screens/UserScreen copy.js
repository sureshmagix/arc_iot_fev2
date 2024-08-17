import React from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';

function UserScreen(props){

    return(
        <View style={styles.viewStyle}>

        <Text style={styles.headingStyle}>Comming Soon</Text>
        <Text style={styles.textStyle}>This is User screen </Text>
        <Button title='Home' onPress={()=> props.navigation.navigate('Home')}/>
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

export default UserScreen;