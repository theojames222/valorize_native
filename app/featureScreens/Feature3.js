// featureScreens/Feature3.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";

const Feature3 = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#D3A43E", "#333333", "#821426"]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.container}
    >
      <Text style={styles.icon}>🏆</Text>
      <Text style={styles.title}>Progress Tracking & Achievements</Text>
      <Text style={styles.description}>
        Stay motivated by tracking your progress. Complete daily habits, earn
        milestones, and celebrate achievements as you push your limits.
      </Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/featureScreens/Feature4")}
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
        <View style={styles.bubble} />
        <View style={styles.bubble} />
        <View style={[styles.bubble, styles.activeBubble]} />
        <View style={styles.bubble} />
      </View>
    </LinearGradient>
  );
};

export default Feature3;
