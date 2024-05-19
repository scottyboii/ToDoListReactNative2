import { StyleSheet, View, Image, Text } from "react-native";
import React from 'react';

const Fallback = () => {
    return (
        <View
            style= {{
                alignItems: "center",
            }}>
            <Image 
                source={require("../../assets/to-do-list.png")}
                style={{
                    height: 300,
                    width: 300
                }}
            />
            <Text> Start adding tasks!</Text>
        </View>
    )
}

export default Fallback

const styles = StyleSheet.create({})