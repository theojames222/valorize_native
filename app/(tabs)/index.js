// (tabs)/index.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

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
      <Button
        title="Go to Loading Screen"
        onPress={() => router.push("/loading")}
      />
      <Button
        title="Go to Welcome Screen"
        onPress={() => router.push("/welcome")}
      />
      <Button
        title="Go to Feature Screen"
        onPress={() => router.push("/features")}
      />
      {/* Add Login Button */}
      <Button
        title="Go to Login Screen"
        onPress={() => router.push("/login")}
      />
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

export default HomeScreen;
