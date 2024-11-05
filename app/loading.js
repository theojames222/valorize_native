import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/welcome");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#D3A43E" />
      <Text style={styles.text}>Loading Valorize...</Text>
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
  text: {
    marginTop: 20,
    fontSize: 20,
    color: "#D3A43E",
  },
});

export default LoadingScreen;
