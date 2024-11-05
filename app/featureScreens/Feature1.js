// featureScreens/Feature1.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";

const Feature1 = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#D3A43E", "#821426", "#333333"]}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      <Text style={styles.icon}>🏋️‍♂️</Text>
      <Text style={styles.title}>Daily Guidance & Challenges</Text>
      <Text style={styles.description}>
        Start each day with clear goals and actionable tasks. Our structured
        daily challenges build consistency and discipline across physical,
        mental, and emotional domains.
      </Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/featureScreens/Feature2")}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.paginationContainer}>
        <View style={[styles.bubble, styles.activeBubble]} />
        <View style={styles.bubble} />
        <View style={styles.bubble} />
        <View style={styles.bubble} />
      </View>
    </LinearGradient>
  );
};

export default Feature1;
