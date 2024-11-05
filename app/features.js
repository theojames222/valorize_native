import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FeatureScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feature Showcase</Text>
      <Text style={styles.description}>
        Learn about the main features of Valorize here.
      </Text>
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
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export default FeatureScreen;
