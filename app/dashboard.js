import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth, db, getDownloadUrl } from "./firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const DashboardScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [podcasts, setPodcasts] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [nextUnlockDate, setNextUnlockDate] = useState(null);
  const [toDoData, setToDoData] = useState("");
  const [completedToday, setCompletedToday] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio Mode Config for Android Emulator
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPodcasts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "podcasts"));
        const podcastList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.sequence - b.sequence);
        setPodcasts(podcastList);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    const fetchUserProgress = async () => {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        const completedSequences = data.completedSequences || [];
        setUserProgress(completedSequences);

        const unlockDate = data.nextUnlockDate
          ? data.nextUnlockDate.toDate()
          : null;
        setNextUnlockDate(unlockDate);

        const now = new Date();
        if (unlockDate && now < unlockDate) {
          setCompletedToday(true);
        }

        const lastCompletedSequence = Math.max(...completedSequences, 0);
        const currentSequence = completedToday
          ? lastCompletedSequence
          : lastCompletedSequence + 1;

        const toDoResponses = data.toDoData || {};
        setToDoData(toDoResponses[currentSequence] || "");
      }
    };

    fetchUserData();
    fetchPodcasts();
    fetchUserProgress();
  }, []);

  useEffect(() => {
    if (podcasts.length) {
      const lastCompletedSequence = Math.max(...userProgress, 0);
      const currentSequence = completedToday
        ? lastCompletedSequence
        : lastCompletedSequence + 1;
      const isUnlockDatePassed =
        !nextUnlockDate || new Date() >= nextUnlockDate;
      const podcastToShow = completedToday
        ? podcasts.find((podcast) => podcast.sequence === lastCompletedSequence)
        : isUnlockDatePassed
        ? podcasts.find(
            (podcast) => podcast.sequence === lastCompletedSequence + 1
          )
        : null;

      setCurrentPodcast(podcastToShow);

      // Fetch the audio URL if a valid podcast is found
      if (podcastToShow && podcastToShow.storagePath) {
        getDownloadUrl(podcastToShow.storagePath).then((url) => {
          setAudioUrl(url);
        });
      }
    }
  }, [podcasts, userProgress, completedToday, nextUnlockDate]);

  // Function to play or pause audio
  const togglePlayback = async () => {
    if (!audioUrl) {
      Alert.alert("No Audio", "Audio file is not loaded.");
      return;
    }

    if (!sound) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true, volume: 1.0 }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          console.log("Playback Status:", status);
          if (status.isLoaded && status.isPlaying) {
            console.log("Audio is playing, volume:", status.volume);
          } else if (status.didJustFinish) {
            console.log("Playback finished");
            setIsPlaying(false);
          }
        });

        await newSound.playAsync();
      } catch (error) {
        console.error("Error with audio playback:", error);
        Alert.alert("Playback Error", "There was an error playing the audio.");
      }
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D3A43E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>
        Hello, {userData ? userData.name : "User"}!
      </Text>
      <Text style={styles.sectionTitle}>Your Top Focus Areas:</Text>
      <View style={styles.focusContainer}>
        {userData?.top3?.length ? (
          userData.top3.map((area, index) => (
            <View key={index} style={styles.focusTag}>
              <Text style={styles.focusTagText}>{area}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No focus areas available</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>The Morning Forge Podcast</Text>
      {currentPodcast ? (
        <View style={styles.podcastContainer}>
          <Text style={styles.podcastTitle}>{currentPodcast.title}</Text>
          <Text style={styles.podcastDescription}>
            {currentPodcast.description}
          </Text>
          <Text style={styles.audioUrlText}>Audio URL: {audioUrl}</Text>

          <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
            <Text style={styles.playButtonText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleMarkAsComplete(currentPodcast.sequence)}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>To-Do:</Text>
          <TextInput
            style={styles.input}
            value={toDoData}
            onChangeText={(text) => setToDoData(text)}
            placeholder="Enter your response here..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => handleSaveToDo(toDoData)}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save To-Do</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noDataText}>
          No podcast available. Check back tomorrow.
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#333333",
    flexGrow: 1,
  },
  welcomeText: {
    fontSize: 24,
    color: "#D3A43E",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginVertical: 10,
    fontWeight: "bold",
  },
  focusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  focusTag: {
    backgroundColor: "#821426",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  focusTagText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  podcastContainer: {
    padding: 15,
    backgroundColor: "#444",
    borderRadius: 8,
    marginVertical: 10,
  },
  podcastTitle: {
    color: "#D3A43E",
    fontSize: 16,
    fontWeight: "bold",
  },
  podcastDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 5,
  },
  audioUrlText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginVertical: 5,
  },
  completeButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    color: "#AAAAAA",
    fontStyle: "italic",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#D3A43E",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
