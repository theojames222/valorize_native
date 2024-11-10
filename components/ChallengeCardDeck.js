import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  CheckBox,
} from "react-native";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const ChallengeCardDeck = ({ challengeId, userId, onClose }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [currentBook, setCurrentBook] = useState("");
  const [maxDayReached, setMaxDayReached] = useState(1);

  useEffect(() => {
    const fetchCurrentDay = async () => {
      const challengeRef = doc(
        db,
        "users",
        userId,
        "currentChallenges",
        challengeId
      );
      const challengeDoc = await getDoc(challengeRef);
      if (challengeDoc.exists()) {
        const challengeData = challengeDoc.data();
        const initialDay = challengeData.currentDay || 1;
        setCurrentDay(initialDay);
        setMaxDayReached(initialDay);

        // Determine the week and day structure
        const weekIndex = Math.floor((initialDay - 1) / 7);
        const dayIndex = (initialDay - 1) % 7;
        const dayData = challengeData.weeks[weekIndex].days[dayIndex];

        // Set book title and tasks
        setCurrentBook(challengeData.weeks[weekIndex].book || "");
        setTasks(dayData.challenges || []);
        setCheckedTasks(
          challengeData.checkedTasks ||
            new Array(dayData.challenges.length).fill(false)
        );
      }
    };
    fetchCurrentDay();
  }, [challengeId, userId]);

  const handleTaskToggle = (index) => {
    const newCheckedTasks = [...checkedTasks];
    newCheckedTasks[index] = !newCheckedTasks[index];
    setCheckedTasks(newCheckedTasks);
  };

  const completeDay = async () => {
    if (!checkedTasks.every((task) => task)) {
      alert("Complete all tasks before moving to the next day!");
      return;
    }

    const nextDay = currentDay + 1;
    const challengeRef = doc(
      db,
      "users",
      userId,
      "currentChallenges",
      challengeId
    );

    await updateDoc(challengeRef, {
      currentDay: nextDay,
      checkedTasks: new Array(tasks.length).fill(false),
    });

    setCurrentDay(nextDay);
    setMaxDayReached(Math.max(maxDayReached, nextDay));
    setCheckedTasks(new Array(tasks.length).fill(false));

    const weekIndex = Math.floor((nextDay - 1) / 7);
    const dayIndex = (nextDay - 1) % 7;
    const dayData = await getDoc(challengeRef).then(
      (docSnap) => docSnap.data().weeks[weekIndex].days[dayIndex]
    );
    setTasks(dayData.challenges || []);
  };

  const goToPreviousDay = async () => {
    if (currentDay > 1) {
      const prevDay = currentDay - 1;
      setCurrentDay(prevDay);

      const challengeRef = doc(
        db,
        "users",
        userId,
        "currentChallenges",
        challengeId
      );
      const weekIndex = Math.floor((prevDay - 1) / 7);
      const dayIndex = (prevDay - 1) % 7;
      const dayData = await getDoc(challengeRef).then(
        (docSnap) => docSnap.data().weeks[weekIndex].days[dayIndex]
      );

      setTasks(dayData.challenges || []);
      setCheckedTasks(new Array(dayData.challenges.length).fill(true));
    }
  };

  const goToNextDay = async () => {
    if (currentDay < maxDayReached) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);

      const challengeRef = doc(
        db,
        "users",
        userId,
        "currentChallenges",
        challengeId
      );
      const weekIndex = Math.floor((nextDay - 1) / 7);
      const dayIndex = (nextDay - 1) % 7;
      const dayData = await getDoc(challengeRef).then(
        (docSnap) => docSnap.data().weeks[weekIndex].days[dayIndex]
      );

      setTasks(dayData.challenges || []);
      setCheckedTasks(new Array(dayData.challenges.length).fill(false));
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>

          <Text style={styles.title}>Book of the Week: {currentBook}</Text>
          <Text style={styles.subtitle}>Challenge Day {currentDay}</Text>

          <ScrollView style={styles.tasksContainer}>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <CheckBox
                  value={checkedTasks[index]}
                  onValueChange={() => handleTaskToggle(index)}
                />
                <View style={styles.taskTextContainer}>
                  <Text style={styles.taskTitle}>Task {index + 1}</Text>
                  <Text style={styles.taskDescription}>{task}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.navigationContainer}>
            {currentDay > 1 && (
              <TouchableOpacity onPress={goToPreviousDay}>
                <Ionicons name="arrow-back" size={24} color="gray" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={completeDay}
              style={styles.completeButton}
            >
              <Text style={styles.completeButtonText}>Complete Day</Text>
            </TouchableOpacity>
            {currentDay < maxDayReached && (
              <TouchableOpacity onPress={goToNextDay}>
                <Ionicons name="arrow-forward" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#F5EAD0",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#821426",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#821426",
    textAlign: "center",
    marginBottom: 16,
  },
  tasksContainer: {
    flex: 1,
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#EEE",
    marginBottom: 8,
  },
  taskTextContainer: {
    marginLeft: 8,
  },
  taskTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  taskDescription: {
    color: "#555",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#D3A43E",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  completeButtonText: {
    color: "#1F1B24",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChallengeCardDeck;
