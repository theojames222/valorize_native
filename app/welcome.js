import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Valorize</Text>
      <Button title="Continue" onPress={() => router.push("/features")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D3A43E",
  },
  title: {
    fontSize: 24,
    color: "#821426",
    marginBottom: 20,
  },
});

export default WelcomeScreen;
