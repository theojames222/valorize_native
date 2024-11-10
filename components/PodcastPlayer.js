import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome
import { LinearGradient } from "expo-linear-gradient";

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

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <LinearGradient
      colors={["#333333", "#821426", "#333333"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {audioUrl && (
        <View style={styles.audioContainer}>
          <TouchableOpacity
            onPress={handlePlayPause}
            disabled={isLocked}
            style={[styles.playPauseButton, isLocked && styles.buttonLocked]}
          >
            <FontAwesome
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#1F1B24"
            />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>
              {formatTime(progress)} / {formatTime(duration)}
            </Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {isCompleted && (
        <View style={styles.taskContainer}>
          <Text style={styles.taskTitle}>Day {podcastSequence} Task</Text>
          <Text style={styles.taskText}>{toDoText}</Text>

          {savedToDo ? (
            <Text style={styles.savedToDoText}>{savedToDo}</Text> // Display saved To-Do if it exists
          ) : toDoType === "general" ? (
            <TextInput
              value={toDoInput}
              onChangeText={(text) => setToDoInput(text)}
              placeholder="Enter your response here..."
              style={[styles.input, lockedSavedToDo && styles.inputLocked]}
              editable={!lockedSavedToDo} // Disable input if To-Do is locked
            />
          ) : (
            <TouchableOpacity
              onPress={() => setToDoInput((prev) => !prev)}
              disabled={lockedSavedToDo}
            >
              <Text style={styles.checkboxLabel}>
                {toDoInput ? "Unmark as Complete" : "Mark as Complete"}
              </Text>
            </TouchableOpacity>
          )}

          {!lockedSavedToDo && !savedToDo && (
            <TouchableOpacity
              onPress={handleSaveToDo}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save To-Do</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F1B24",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F5EAD0",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#F5EAD0",
    marginBottom: 20,
    textAlign: "center",
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  playPauseButton: {
    backgroundColor: "#D3A43E",
    padding: 10,
    borderRadius: 30,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonLocked: {
    backgroundColor: "#AAA",
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "#555",
    borderRadius: 2,
    overflow: "hidden",
    marginVertical: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4a90e2",
  },
  timeText: {
    fontSize: 12,
    color: "#BBB",
  },
  taskContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 5,
  },
  taskText: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 10,
  },
  savedToDoText: {
    fontSize: 14,
    color: "#BBB",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#BBB",
    padding: 10,
    borderRadius: 5,
    color: "#FFF",
    marginBottom: 10,
  },
  inputLocked: {
    backgroundColor: "#333",
  },
  saveButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#1F1B24",
    fontWeight: "bold",
  },
  checkboxLabel: {
    color: "#FFF",
    fontSize: 14,
  },
});

export default PodcastPlayer2;
