import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ChallengeSection from "./ChallengeSection";

const ChallengeDataContainer = ({ focusAreas, userId, userLevel }) => {
  const [allChallenges, setAllChallenges] = useState([]);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [suggestedChallenges, setSuggestedChallenges] = useState([]);
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

        // Fetch user's current challenges
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

        setAllChallenges(challengeList); // Store all challenges
        setCurrentChallenges(userCurrentChallengeIds);

        // Filter suggested challenges initially based on focus areas and current challenges
        const filteredSuggested = challengeList.filter((challenge) => {
          const matchesFocusArea = focusAreas.includes(challenge.pillar);
          const notInCurrent = !userCurrentChallengeIds.includes(challenge.id);

          return matchesFocusArea && notInCurrent;
        });

        setSuggestedChallenges(filteredSuggested);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, [userId, focusAreas]);

  const updateChallengeStatus = (updatedChallenge) => {
    setAllChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === updatedChallenge.id
          ? { ...challenge, status: "current" }
          : challenge
      )
    );
    setSuggestedChallenges((prevSuggested) =>
      prevSuggested.filter((c) => c.id !== updatedChallenge.id)
    );
  };

  const handleRemoveChallenge = (id) => {
    setAllChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === id ? { ...challenge, status: "suggested" } : challenge
      )
    );
  };

  const handleToggleChallengesView = () => {
    setShowAllChallenges(!showAllChallenges);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D3A43E" />
      </View>
    );
  }

  return (
    <ChallengeSection
      currentChallenges={allChallenges.filter(
        (challenge) =>
          currentChallenges.includes(challenge.id) &&
          challenge.status === "current"
      )}
      suggestedChallenges={suggestedChallenges}
      completedChallenges={allChallenges.filter(
        (challenge) => challenge.status === "completed"
      )}
      allChallenges={allChallenges} // Pass all challenges to ChallengesSection
      userLevel={userLevel}
      handleAddChallenge={updateChallengeStatus}
      handleRemoveChallenge={handleRemoveChallenge}
      handleCompleteChallenge={(challenge) =>
        console.log("Complete", challenge)
      }
      showAllChallenges={showAllChallenges}
      handleToggleChallengesView={handleToggleChallengesView}
      userId={userId}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChallengeDataContainer;
