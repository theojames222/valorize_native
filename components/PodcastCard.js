import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { db } from "../firebaseConfig"; // Update path to your Firebase config
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import PodcastPlayer from "./PodcastPlayer"; // Use a React Native Podcast Player component

function PodcastCard({ userId }) {
  const [podcasts, setPodcasts] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [nextUnlockDate, setNextUnlockDate] = useState(null);
  const [toDoData, setToDoData] = useState(""); // To store current podcast's to-do data
  const [completedToday, setCompletedToday] = useState(false);
  const [lockedSavedToDo, setLockedSaveToDo] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "podcasts"));
        const podcastList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.sequence - b.sequence);
        setPodcasts(podcastList);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    const fetchUserProgress = async () => {
      try {
        const userRef = doc(db, "users", userId);
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
          let hasCompletedToday = false;
          if (unlockDate && now < unlockDate) {
            hasCompletedToday = true;
          }
          setCompletedToday(hasCompletedToday);

          const lastCompletedSequence = Math.max(...completedSequences, 0);
          const currentSequence = hasCompletedToday
            ? lastCompletedSequence
            : lastCompletedSequence + 1;

          const toDoResponses = data.toDoData || {};
          setToDoData(toDoResponses[currentSequence] || "");
          if (toDoResponses[currentSequence]) {
            setLockedSaveToDo(true);
          }
        } else {
          setUserProgress([]);
          setCompletedToday(false);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    fetchPodcasts();
    fetchUserProgress();
  }, [userId]);

  const handleMarkAsComplete = async (podcastSequence) => {
    if (podcastSequence == null) return;

    try {
      const userRef = doc(db, "users", userId);
      const today = new Date();
      const tomorrow = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      await updateDoc(userRef, {
        completedSequences: arrayUnion(podcastSequence),
        nextUnlockDate: tomorrow,
      });

      setUserProgress((prev) => [...prev, podcastSequence]);
      setNextUnlockDate(tomorrow);
      setCompletedToday(true);
    } catch (error) {
      console.error("Error updating completed podcasts:", error);
    }
  };

  const handleSaveToDo = async (inputValue) => {
    setToDoData(inputValue);

    try {
      const userRef = doc(db, "users", userId);
      const lastCompletedSequence = Math.max(...userProgress, 0);
      const currentSequence = completedToday
        ? lastCompletedSequence
        : lastCompletedSequence + 1;

      await updateDoc(userRef, {
        [`toDoData.${currentSequence}`]: inputValue,
      });
      Alert.alert("Success", "To-Do saved successfully");
    } catch (error) {
      console.error("Error saving To-Do:", error);
    }
    setLockedSaveToDo(true);
  };

  const getCurrentPodcast = () => {
    const lastCompletedSequence = Math.max(...userProgress, 0);

    if (completedToday) {
      return podcasts.find(
        (podcast) => podcast.sequence === lastCompletedSequence
      );
    } else {
      const isUnlockDatePassed =
        !nextUnlockDate || new Date() >= nextUnlockDate;
      if (isUnlockDatePassed) {
        return podcasts.find(
          (podcast) => podcast.sequence === lastCompletedSequence + 1
        );
      } else {
        return null;
      }
    }
  };

  const currentPodcast = getCurrentPodcast();

  if (!currentPodcast) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          No podcast available at the moment. Check back tomorrow.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <PodcastPlayer
        trackUrl={currentPodcast.audioUrl}
        isLocked={false}
        onMarkAsComplete={handleMarkAsComplete}
        onSaveToDo={handleSaveToDo}
        podcastSequence={currentPodcast.sequence}
        toDoText={currentPodcast.toDoText}
        toDoType={currentPodcast.toDoType}
        isCompleted={userProgress.includes(currentPodcast.sequence)}
        completedToday={completedToday}
        title={currentPodcast.title}
        description={currentPodcast.description}
        savedToDo={toDoData}
        storagePath={currentPodcast.storagePath}
        lockedSavedToDo={lockedSavedToDo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
  },
  message: {
    fontSize: 16,
    color: "#D3A43E",
    textAlign: "center",
  },
  dark: {
    backgroundColor: "#333333",
  },
  valorize: {
    backgroundColor: "#821426",
  },
  light: {
    backgroundColor: "#FFFFFF",
  },
});

export default PodcastCard;
