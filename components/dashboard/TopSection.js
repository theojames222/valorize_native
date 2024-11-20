import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";

// Map focus areas to colors and icons
const areaData = {
  physical: { color: "#0D3B66", icon: "person-running" },
  mental: { color: "#1B998B", icon: "brain" },
  mindfulness: { color: "#C07CFF", icon: "leaf" },
  intellectual: { color: "#219EBC", icon: "book" },
  purpose: { color: "#821426", icon: "lightbulb" },
  emotional: { color: "#D3A43E", icon: "heart-pulse" },
};

// Progress bar component
const ProgressBar = ({ progress, color }) => (
  <View style={styles.progressBarBackground}>
    <View
      style={[
        styles.progressBar,
        { width: `${progress}%`, backgroundColor: color },
      ]}
    />
  </View>
);

const TopSection = ({
  userName,
  quoteOfTheDay,
  topFocusAreas,
  selectedTheme,
  isMobile,
}) => {
  const themes = {
    dark: {
      text: "#F5EAD0",
      background: "#1F1F1F",
    },
    valorize: {
      text: "#F5EAD0",
      background: "#821426",
    },
    light: {
      text: "#1F1F1F",
      background: "#EDEDED",
    },
  };

  const currentTheme = themes[selectedTheme] || themes.dark;

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Greeting Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: currentTheme.text }]}>
            Welcome back, {userName}!
          </Text>
          {!isMobile && (
            <Text style={styles.subText}>
              Your personalized journey awaits.
            </Text>
          )}
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteLabel}>Quote of the Day</Text>
          <Text style={styles.quoteText}>
            {quoteOfTheDay || "Keep Valorizing your goals. Show up for you"}
          </Text>
        </View>
      </View>

      {/* Focus Areas Section */}
      {!isMobile && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.focusAreasContainer}
        >
          {topFocusAreas.map((area, index) => {
            const { color, icon } = areaData[area] || {
              color: "#D3D3D3",
              icon: null,
            };
            const progress = Math.floor(Math.random() * 100); // Placeholder for progress value

            return (
              <View
                key={index}
                style={[styles.focusAreaCard, { shadowColor: color }]}
              >
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <FontAwesome6
                    name={icon}
                    size={36}
                    color={color}
                    style={styles.icon}
                  />
                </View>

                {/* Area Name */}
                <Text style={styles.focusAreaText}>{area}</Text>

                {/* Progress Bar */}
                <ProgressBar progress={progress} color={color} />

                {/* Level */}
                <Text style={styles.levelText}>
                  Lvl:{" "}
                  <Text style={styles.levelValue}>
                    {Math.floor(progress / 10)}
                  </Text>
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 10,
    shadowColor: "#D3A43E",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#888",
  },
  quoteBox: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  quoteLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#F5EAD0",
    fontWeight: "bold",
  },
  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#F5EAD0",
  },
  focusAreasContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  focusAreaCard: {
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    padding: 16,
    width: Dimensions.get("window").width * 0.8,
    marginRight: 16,
    alignItems: "center",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    marginBottom: 8,
  },
  focusAreaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D3A43E",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#444",
    borderRadius: 3,
    marginVertical: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  levelText: {
    fontSize: 14,
    color: "#F5EAD0",
  },
  levelValue: {
    fontWeight: "bold",
  },
});

export default TopSection;
