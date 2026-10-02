import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Divider from "../components/divider.component"; 

const LeaderboardAtrraction = ({ id, name, score, seeDetails }) => (
  <View style={styles.container}>
    <Pressable onPress={() => seeDetails()}>
    <View style={styles.row}>
        <View>
            <Text style={styles.name}>{id}. {name}</Text>
            <Pressable onPress={() => seeDetails()}><Text style={styles.details}>See details</Text></Pressable>
        </View>
        <Text style={styles.score}>{score}%</Text>
    </View>
    <Divider thickness={2} />
    </Pressable>
  </View>
);
const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginLeft: 21,
        marginRight: 21,
        marginTop: 30,
    },

    row:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name:{
        fontSize: 18,
        fontWeight: '700'
    },

    score:{
        marginLeft: 30,
        fontSize: 18,
        marginTop: 10,
        fontWeight: '700',
        color: "#688A6F",
    },
    details:{
        color: "#688A6F",
        textDecorationLine: 'underline',
        marginBottom: 10,
        marginTop: 5
    }
  });
  

export default LeaderboardAtrraction;