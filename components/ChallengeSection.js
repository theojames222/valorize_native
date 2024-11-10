import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { storage, db } from "../firebaseConfig";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
import ChallengeModal from "./ChallengeModal";
import ChallengeCardDeck from "./ChallengeCardDeck";

const ChallengesSection = ({
  suggestedChallenges,
  completedChallenges,
  userLevel,
  showAllChallenges,
  handleToggleChallengesView,
  userId,
  handleAddChallenge,
  allChallenges,
}) => {
  const [challengeImages, setChallengeImages] = useState({});
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChallengeDeckOpen, setIsChallengeDeckOpen] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchCurrentChallenges = async () => {
      const challengesRef = collection(
        db,
        "users",
        userId,
        "currentChallenges"
      );
      onSnapshot(challengesRef, (snapshot) => {
        const challenges = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentChallenges(challenges);
      });
    };
    fetchCurrentChallenges();
  }, [userId]);

  const fetchImages = async (challenges) => {
    const images = {};
    for (const challenge of challenges) {
      if (challenge.storagePath && !challengeImages[challenge.id]) {
        const imageRef = ref(storage, challenge.storagePath);
        images[challenge.id] = await getDownloadURL(imageRef);
      }
    }
    setChallengeImages((prevImages) => ({ ...prevImages, ...images }));
    setLoadingImages(false);
  };

  useEffect(() => {
    fetchImages([
      ...allChallenges,
      ...currentChallenges,
      ...completedChallenges,
    ]);
  }, [allChallenges, currentChallenges, completedChallenges]);

  const startChallenge = async (challenge) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    if (currentChallenges.length >= userLevel) {
      alert("Challenge limit reached, focus on your current challenges first.");
      setIsModalOpen(false);
      setIsChallengeDeckOpen(false);
      return;
    }

    const challengeRef = doc(
      db,
      "users",
      userId,
      "currentChallenges",
      challenge.id
    );
    try {
      await setDoc(challengeRef, {
        ...challenge,
        status: "current",
        startDate: new Date().toISOString(),
        currentDay: 1,
        weeks: challenge.weeks,
        checkedTasks: [],
      });
      handleAddChallenge(challenge);
    } catch (error) {
      console.error("Error starting challenge:", error);
    }
  };

  const ChallengeCard = ({ challenge, onPress, status, actionLabel }) => {
    const imageUrl = challengeImages[challenge.id];
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{challenge.title}</Text>
          {status && <Text style={styles.cardStatus}>Status: {status}</Text>}
          <Button title={actionLabel} onPress={onPress} color="#D3A43E" />
        </View>
      </TouchableOpacity>
    );
  };

  // Display either all challenges or suggested challenges based on `showAllChallenges`
  const challengesToDisplay = showAllChallenges
    ? allChallenges
    : suggestedChallenges;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Challenges</Text>

      {/* Current Challenges Section */}
      <Text style={styles.subTitle}>Current Challenges</Text>
      <View style={styles.cardGrid}>
        {currentChallenges.length > 0 ? (
          currentChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onPress={() => {
                setSelectedChallenge(challenge);
                setIsModalOpen(true);
                setIsChallengeDeckOpen(true);
              }}
              status="In Progress"
              actionLabel="Continue"
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No current challenges</Text>
        )}
      </View>

      {/* Suggested/All Challenges Section with Horizontal Scrolling */}
      <Text style={styles.subTitle}>
        {showAllChallenges ? "All Challenges" : "Suggested Challenges"}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContainer}
      >
        {challengesToDisplay.length > 0 ? (
          challengesToDisplay.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onPress={() => {
                setSelectedChallenge(challenge);
                setIsModalOpen(true);
                setIsChallengeDeckOpen(false);
              }}
              status={showAllChallenges ? challenge.status : "Suggested"}
              actionLabel="View"
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No challenges available</Text>
        )}
      </ScrollView>

      <Button
        title={
          showAllChallenges
            ? "Show Suggested Challenges"
            : "Show All Challenges"
        }
        onPress={handleToggleChallengesView}
        color="#D3A43E"
      />

      {/* Completed Challenges Section */}
      <Text style={styles.subTitle}>Completed Challenges</Text>
      <View style={styles.cardGrid}>
        {completedChallenges.length > 0 ? (
          completedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              status="Completed"
              actionLabel="View"
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No completed challenges</Text>
        )}
      </View>

      {/* Modals for Challenge Details */}
      {isModalOpen && selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => {
            setIsModalOpen(false);
            setIsChallengeDeckOpen(false);
          }}
          onStartChallenge={() => startChallenge(selectedChallenge)}
          userId={userId}
          isChallengeDeckOpen={isChallengeDeckOpen}
        />
      )}
      {isChallengeDeckOpen && selectedChallenge && (
        <ChallengeCardDeck
          challengeId={selectedChallenge.id}
          userId={userId}
          onClose={() => setIsChallengeDeckOpen(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5EAD0",
    textAlign: "center",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F5EAD0",
    marginBottom: 8,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  card: {
    width: 120,
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#333333",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  horizontalScrollContainer: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  cardImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 4,
    textAlign: "center",
  },
  cardStatus: {
    fontSize: 12,
    color: "#CCC",
    marginBottom: 8,
  },
  noDataText: {
    color: "#888",
    fontSize: 14,
    paddingVertical: 10,
  },
});

export default ChallengesSection;
