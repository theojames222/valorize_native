import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const ChallengesSection = ({
  title,
  challenges,
  onChallengePress,
  toggleViewLabel,
  onToggleView,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>{title}</Text>
    {challenges.length === 0 ? (
      <Text style={styles.noChallengesText}>No challenges available</Text>
    ) : (
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>{item.name}</Text>
            <Text style={styles.challengePillar}>Pillar: {item.pillar}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onChallengePress(item)}
            >
              <Text style={styles.actionButtonText}>Start Challenge</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    )}
    {toggleViewLabel && (
      <TouchableOpacity onPress={onToggleView} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{toggleViewLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  noChallengesText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  challengeCard: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 4,
  },
  challengePillar: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#1F1F1F",
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 8,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#D3A43E",
    fontSize: 14,
  },
});

export default ChallengesSection;
