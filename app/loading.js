import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const LoadingScreen = () => {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20, // move up by 20 units
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0, // move back down
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to the next screen after a delay
    setTimeout(() => {
      router.replace("/welcome");
    }, 3000); // Adjust the time as needed
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={["#D3A43E", "#821426", "#333333"]}
        start={[0, 1]} // Start from the bottom
        end={[0, 0]} // End at the top
      />
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </Animated.View>
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
  logo: {
    width: 150, // Adjust size as needed
    height: 150,
    resizeMode: "contain",
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    color: "#D3A43E",
  },
});

export default LoadingScreen;
