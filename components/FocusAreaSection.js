import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

// Define the mapping for focus areas, colors, and icons
const areaData = {
  physical: { color: "#0D3B66", icon: "person-running" },
  mental: { color: "#1B998B", icon: "brain" },
  mindfulness: { color: "#C07CFF", icon: "leaf" },
  intellectual: { color: "#219EBC", icon: "book" },
  purpose: { color: "#821426", icon: "lightbulb" },
  emotional: { color: "#D3A43E", icon: "heart-pulse" },
};

// Define labels for each focus level
const areaLabels = ["Primary", "Secondary", "Tertiary"];

const FocusArea = ({ topFocusAreas }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Priorities</Text>
      <Text style={styles.subtitle}>
        Key areas of development based on your personal goals
      </Text>

      {/* Render each focus area with icon and label */}
      <View style={styles.areasContainer}>
        {topFocusAreas.map((area, index) => {
          const { color, icon } = areaData[area] || { color: "#CCC" };

          return (
            <View key={index} style={styles.areaItem}>
              <FontAwesome6
                name={icon}
                size={36}
                color={color}
                style={styles.icon}
              />
              <Text style={styles.areaLabel}>{areaLabels[index]}</Text>
              <Text style={[styles.areaName, { color }]}>
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 5,
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F5EAD0",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#D3A43E",
    textAlign: "center",
    marginBottom: 20,
  },
  areasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  areaItem: {
    alignItems: "center",
    width: "30%", // Adjust width for spacing
  },
  icon: {
    marginBottom: 8,
  },
  areaLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F5EAD0",
  },
  areaName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FocusArea;
