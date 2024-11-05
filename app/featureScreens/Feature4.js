// featureScreens/Feature4.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";

const Feature4 = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#333333", "#D3A43E", "#821426"]}
      start={[1, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      <Text style={styles.icon}>❤️</Text>
      <Text style={styles.title}>Community & Positive Masculinity Pillars</Text>
      <Text style={styles.description}>
        Build a balanced, empowered life through our core pillars: Physical,
        Mental, Spiritual, Intellectual, Purpose, and Emotional. Join a
        supportive community of like-minded individuals.
      </Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/login")}
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
        <View style={styles.bubble} />
        <View style={[styles.bubble, styles.activeBubble]} />
      </View>
    </LinearGradient>
  );
};

export default Feature4;
