import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Radial-Like Gradient Background */}
      {/* i like this one */}
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={["#D3A43E", "#821426", "#333333"]}
        start={[0, 1]} // Start from the bottom
        end={[0, 0]} // End at the top
      />

      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Welcome Message */}
      <Text style={styles.title}>Welcome to Valorize</Text>
      <Text style={styles.subtitle}>Your journey to growth starts here</Text>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/features")}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F5EAD0",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#F5EAD0",
    textAlign: "center",
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: "#DDDDDD",
  },
  loginLink: {
    fontSize: 14,
    color: "#D3A43E",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
