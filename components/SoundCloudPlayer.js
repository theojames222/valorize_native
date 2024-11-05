// app/components/SoundCloudPlayer.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const SoundCloudPlayer = ({
  trackUrl,
  isLocked,
  onMarkAsComplete,
  title,
  description,
}) => {
  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    trackUrl
  )}&auto_play=false`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        allowsInlineMediaPlayback
      />

      <TouchableOpacity
        onPress={onMarkAsComplete}
        style={[styles.completeButton, isLocked && styles.disabledButton]}
        disabled={isLocked}
      >
        <Text style={styles.completeButtonText}>Mark as Complete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D3A43E",
  },
  description: {
    fontSize: 14,
    color: "#EEE",
    marginBottom: 10,
  },
  webview: {
    height: 80,
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#AAA",
  },
  completeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SoundCloudPlayer;
