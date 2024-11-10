// PodcastPlayer2.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Audio } from "expo-av";
// import { FaLock } from "react-icons/fa6"; // This will be a placeholder as React Native doesn't support web icons directly

function PodcastPlayer2({
  storagePath,
  isLocked,
  onMarkAsComplete,
  onSaveToDo,
  podcastSequence,
  toDoText,
  toDoType,
  challenge,
  isCompleted,
  completedToday,
  title,
  description,
  savedToDo,
  lockedSavedToDo,
}) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [toDoInput, setToDoInput] = useState(savedToDo || "");
  const [sound, setSound] = useState(null);

  // Fetch audio URL from Firebase Storage
  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const storage = getStorage();
        const audioRef = ref(storage, storagePath);
        const url = await getDownloadURL(audioRef);
        setAudioUrl(url);
      } catch (error) {
        console.error("Error fetching audio file:", error);
      }
    };

    if (storagePath) fetchAudioUrl();
  }, [storagePath]);

  // Load and unload audio when audio URL is ready
  useEffect(() => {
    const loadAudio = async () => {
      if (audioUrl) {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: isPlaying }
        );
        setSound(sound);
        setDuration(status.durationMillis || 0);
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }
    };

    if (audioUrl) loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setProgress(status.positionMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        handleMarkAsComplete();
        setIsPlaying(false);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!isLocked && sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMarkAsComplete = () => {
    onMarkAsComplete(podcastSequence);
    Alert.alert("Podcast Completed", "You have completed today's podcast!");
  };

  const handleSaveToDo = () => {
    onSaveToDo(toDoInput);
    Alert.alert("Success", "To-Do saved successfully");
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {audioUrl && (
        <View style={styles.audioContainer}>
          <Button
            title={isPlaying ? "Pause" : "Play"}
            onPress={handlePlayPause}
            disabled={isLocked}
            color="#D3A43E"
          />
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(progress)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      )}

      {isCompleted && (
        <View style={styles.taskContainer}>
          <Text style={styles.taskTitle}>Day {podcastSequence} Task</Text>
          <Text style={styles.taskText}>{toDoText}</Text>
          {toDoType === "general" ? (
            <TextInput
              value={toDoInput}
              onChangeText={(text) => setToDoInput(text)}
              placeholder="Enter your response here..."
              style={[styles.input, lockedSavedToDo && styles.inputLocked]}
              editable={!lockedSavedToDo}
            />
          ) : (
            <Button
              title={toDoInput ? "Unmark as Complete" : "Mark as Complete"}
              onPress={() => setToDoInput((prev) => !prev)}
              disabled={lockedSavedToDo}
            />
          )}
          {!lockedSavedToDo && (
            <Button
              title="Save To-Do"
              onPress={handleSaveToDo}
              color="#D3A43E"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D3A43E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 16,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#FFF",
  },
  taskContainer: {
    marginTop: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  taskText: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFF",
    padding: 8,
    borderRadius: 4,
    color: "#FFF",
  },
  inputLocked: {
    backgroundColor: "#ccc",
    color: "#666",
  },
});

export default PodcastPlayer2;
