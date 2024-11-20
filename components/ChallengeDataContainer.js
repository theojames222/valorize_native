import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ChallengesSection from "./ChallengeSection";

const ChallengeDataContainer = ({ focusAreas, userId, userLevel }) => {
  const [challenges, setChallenges] = useState([]);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challengesCollection = collection(db, "challenges");
        const challengeSnapshot = await getDocs(challengesCollection);
        const challengeList = challengeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userCurrentChallengesCollection = collection(
          db,
          "users",
          userId,
          "currentChallenges"
        );
        const currentChallengeSnapshot = await getDocs(
          userCurrentChallengesCollection
        );
        const userCurrentChallengeIds = currentChallengeSnapshot.docs.map(
          (doc) => doc.id
        );

        setChallenges(challengeList);
        setCurrentChallenges(userCurrentChallengeIds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, [userId]);

  const updateChallengeStatus = (updatedChallenge) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === updatedChallenge.id
          ? { ...challenge, status: "current" }
          : challenge
      )
    );
  };

  const handleToggleChallengesView = () =>
    setShowAllChallenges(!showAllChallenges);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D3A43E" />
        <Text style={styles.loadingText}>Loading Challenges...</Text>
      </View>
    );
  }

  const currentChallengesList = challenges.filter((challenge) =>
    currentChallenges.includes(challenge.id)
  );
  const suggestedChallengesList = challenges.filter(
    (challenge) =>
      !currentChallenges.includes(challenge.id) &&
      focusAreas.includes(challenge.pillar)
  );
  const completedChallengesList = challenges.filter(
    (challenge) => challenge.status === "completed"
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Challenges</Text>
      <ChallengesSection
        title="Current Challenges"
        challenges={currentChallengesList}
        onChallengePress={updateChallengeStatus}
      />
      <ChallengesSection
        title={showAllChallenges ? "All Challenges" : "Suggested Challenges"}
        challenges={showAllChallenges ? challenges : suggestedChallengesList}
        onChallengePress={updateChallengeStatus}
        toggleViewLabel={
          showAllChallenges
            ? "Show Suggested Challenges"
            : "Show All Challenges"
        }
        onToggleView={handleToggleChallengesView}
      />
      <ChallengesSection
        title="Completed Challenges"
        challenges={completedChallengesList}
        onChallengePress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1F1F1F",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#D3A43E",
    fontSize: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 16,
  },
});

export default ChallengeDataContainer;
