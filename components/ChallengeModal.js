import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebaseConfig";
import ChallengeCardDeck from "./ChallengeCardDeck";

const ChallengeModal = ({
  challenge,
  onClose,
  onStartChallenge,
  userId,
  isChallengeDeckOpen,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [showChallengeDeck, setShowChallengeDeck] =
    useState(isChallengeDeckOpen);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (challenge.storagePath) {
        const imageRef = ref(storage, challenge.storagePath);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      }
    };
    fetchImageUrl();
  }, [challenge.storagePath]);

  const handleStartChallenge = () => {
    onStartChallenge();
    setShowChallengeDeck(true);
  };

  const currentChallengeClose = () => {
    setShowChallengeDeck(!showChallengeDeck);
    onClose();
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{challenge.title}</Text>
            <TouchableOpacity onPress={currentChallengeClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {showChallengeDeck ? (
            <ChallengeCardDeck challengeId={challenge.id} userId={userId} />
          ) : (
            <>
              <ScrollView style={styles.contentContainer}>
                <View style={styles.challengeOverview}>
                  {imageUrl && (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.challengeImage}
                    />
                  )}
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                      {challenge.description}
                    </Text>
                    <Text style={styles.duration}>
                      Duration: {challenge.duration} days
                    </Text>
                  </View>
                </View>
                <View style={styles.overviewBox}>
                  <Text style={styles.overviewText}>
                    {challenge.challengeOverview}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeAction}>
                  <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleStartChallenge}
                  style={styles.startAction}
                >
                  <Text style={styles.actionText}>Start Challenge</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: "#821426",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D3A43E",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: "#F5EAD0",
  },
  contentContainer: {
    marginTop: 10,
    flexGrow: 1,
  },
  challengeOverview: {
    flexDirection: "row",
    marginBottom: 16,
  },
  challengeImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    color: "#F5EAD0",
    fontSize: 16,
    marginBottom: 4,
  },
  duration: {
    color: "#BFBFBF",
    fontSize: 14,
  },
  overviewBox: {
    backgroundColor: "#F5EAD0",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  overviewText: {
    color: "#333",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  closeAction: {
    marginRight: 16,
  },
  startAction: {
    backgroundColor: "#D3A43E",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    color: "#1F1B24",
    fontWeight: "bold",
  },
});

export default ChallengeModal;
