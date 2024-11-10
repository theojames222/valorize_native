// (tabs)/index.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import "../../global.css";

const HomeScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto-navigate after a delay
    // Uncomment the lines below if you want to navigate to a loading screen first
    // setTimeout(() => {
    //   router.replace('/loading');
    // }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Valorize</Text>
      <Button title="Start" onPress={() => router.push("/login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#821426",
  },
  title: {
    fontSize: 24,
    color: "#F5EAD0",
    marginBottom: 20,
  },
});

export default HomeScreen;
