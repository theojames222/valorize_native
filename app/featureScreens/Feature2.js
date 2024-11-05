// featureScreens/Feature2.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";

const Feature2 = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#821426", "#D3A43E", "#333333"]}
      start={[0.5, 0.5]}
      end={[1, 1]}
      style={styles.container}
    >
      <Text style={styles.icon}>📚</Text>
      <Text style={styles.title}>AI-Powered Coaching & Knowledge Hub</Text>
      <Text style={styles.description}>
        Access personalized guidance anytime. Valorize’s AI Coach and Learning
        Center offer insights, motivation, and resources from transformative
        books to deepen self-understanding.
      </Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/featureScreens/Feature3")}
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
        <View style={[styles.bubble, styles.activeBubble]} />
        <View style={styles.bubble} />
        <View style={styles.bubble} />
      </View>
    </LinearGradient>
  );
};

export default Feature2;
