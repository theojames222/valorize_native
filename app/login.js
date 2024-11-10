// app/login.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to access your dashboard</Text>
      <Button title="Login" onPress={() => router.push("/welcome")} />
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#821426",
  },
});

export default Login;
