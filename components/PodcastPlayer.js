import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function PodcastPlayer({
  storagePath,
  isLocked,
  onMarkAsComplete,
  onSaveToDo,
  podcastSequence,
  toDoText,
  toDoType,
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
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      setIsLoading(true);
      try {
        const storage = getStorage();
        const audioRef = ref(storage, storagePath);
        const url = await getDownloadURL(audioRef);
        setAudioUrl(url);
      } catch (error) {
        console.error("Error fetching audio file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (storagePath) fetchAudioUrl();
  }, [storagePath]);

  const handlePlayPause = async () => {
    if (!isLocked && soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      const newPosition = Math.max(0, status.positionMillis - 10000);
      await soundRef.current.setPositionAsync(newPosition);
    }
  };

  const handleSaveToDo = () => {
    onSaveToDo(toDoInput);
    Alert.alert("Success", "To-Do saved successfully.");
  };

  useEffect(() => {
    const loadAudio = async () => {
      if (audioUrl) {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false }
        );
        soundRef.current = sound;
        setDuration(status.durationMillis / 1000); // Convert milliseconds to seconds

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setProgress(status.positionMillis / 1000); // Convert milliseconds to seconds
            if (status.didJustFinish) {
              onMarkAsComplete(podcastSequence);
              setIsPlaying(false);
            }
          }
        });
      }
    };

    loadAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [audioUrl]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Podcast Section */}
      <View style={styles.section}>
        <Text style={styles.title}>The Morning Forge Podcast</Text>
        <Text style={styles.subtitle}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {isLoading && <ActivityIndicator size="small" color="#D3A43E" />}

        <View style={styles.audioControls}>
          <TouchableOpacity
            onPress={handleRewind}
            disabled={isLocked || !audioUrl}
          >
            <MaterialIcons
              name="replay-10"
              size={30}
              color={isLocked ? "#888" : "#D3A43E"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePlayPause}
            disabled={isLocked || !audioUrl}
          >
            <FontAwesome
              name={isPlaying ? "pause" : "play"}
              size={40}
              color={isLocked ? "#888" : "#D3A43E"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress / duration) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(progress)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>

      {/* To-Do Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Daily To-Do</Text>
        <Text style={styles.description}>{toDoText}</Text>

        {toDoType === "general" ? (
          <TextInput
            style={styles.input}
            value={toDoInput}
            onChangeText={setToDoInput}
            placeholder="Enter your response..."
            editable={!lockedSavedToDo}
          />
        ) : (
          <TouchableOpacity
            style={styles.checkbox}
            disabled={lockedSavedToDo}
            onPress={() => setToDoInput((prev) => !prev)}
          >
            <Text style={styles.checkboxLabel}>
              {toDoInput ? "Unmark as Complete" : "Mark as Complete"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.saveButton, lockedSavedToDo && styles.disabledButton]}
          disabled={lockedSavedToDo}
          onPress={handleSaveToDo}
        >
          <Text style={styles.saveButtonText}>
            {lockedSavedToDo ? "Saved" : "Save To-Do"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#1F1F1F",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D3A43E",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#FFF",
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    color: "#BBB",
  },
  audioControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D3A43E",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    color: "#FFF",
  },
  saveButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#1F1F1F",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#FFF",
  },
});

export default PodcastPlayer;
