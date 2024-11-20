import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { storage, db } from "../../firebaseConfig";

const truncateText = (text, maxLength) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const ActivityRow = ({ imageUrl, title, progress, actionLabel, onPress }) => (
  <View style={styles.activityRow}>
    {/* Thumbnail */}
    <View style={styles.thumbnail}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
    </View>
    {/* Title */}
    <Text style={styles.title}>{truncateText(title, 20)}</Text>
    {/* Progress & Action */}
    <View style={styles.actions}>
      {progress && <Text style={styles.progressText}>{progress}</Text>}
      <TouchableOpacity onPress={onPress} style={styles.actionButton}>
        <Text style={styles.actionButtonText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CurrentActivities = ({ userId }) => {
  const [challengeImages, setChallengeImages] = useState({});
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [booksDetails, setBooksDetails] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesRef = collection(
        db,
        "users",
        userId,
        "currentChallenges"
      );
      const completedChallengesRef = collection(
        db,
        "users",
        userId,
        "completedChallenges"
      );

      onSnapshot(challengesRef, (snapshot) => {
        const challenges = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentChallenges(challenges);
      });

      onSnapshot(completedChallengesRef, (snapshot) => {
        const challenges = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedChallenges(challenges);
      });
    };

    fetchChallenges();
  }, [userId]);

  // Fetch book progress and finished books
  useEffect(() => {
    const fetchBooksDetails = async () => {
      const bookProgressRef = collection(db, "users", userId, "bookProgress");
      const progressSnapshot = await getDocs(bookProgressRef);

      const progress = progressSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const unfinishedBooks = progress.filter(
        (progressBook) => !progressBook.finished
      );
      const completedBooks = progress.filter(
        (progressBook) => progressBook.finished
      );

      const categories = [
        "Physical",
        "Mental",
        "Mindfulness",
        "Intellectual",
        "Purpose",
        "Emotional",
      ];
      const allBooks = [];
      for (const category of categories) {
        const booksCollectionRef = collection(
          db,
          "knowledgeCenter",
          category,
          "books"
        );
        const booksSnapshot = await getDocs(booksCollectionRef);
        const books = await Promise.all(
          booksSnapshot.docs.map(async (doc) => {
            const bookData = doc.data();
            let coverUrl = null;
            if (bookData.storagePath) {
              const coverRef = ref(storage, bookData.storagePath);
              try {
                coverUrl = await getDownloadURL(coverRef);
              } catch (error) {
                console.error(
                  `Error fetching book image for ${doc.id}:`,
                  error
                );
              }
            }
            return {
              id: doc.id,
              ...bookData,
              coverUrl,
              category,
            };
          })
        );
        allBooks.push(...books);
      }

      const matchedBooks = unfinishedBooks.map((progressBook) =>
        allBooks.find((book) => progressBook.id === book.title)
      );

      const matchedFinishedBooks = completedBooks.map((progressBook) =>
        allBooks.find((book) => progressBook.id === book.title)
      );

      setBooksDetails(matchedBooks);
      setFinishedBooks(matchedFinishedBooks);
    };

    fetchBooksDetails();
  }, [userId]);

  const fetchImages = async (challenges) => {
    const images = {};
    for (const challenge of challenges) {
      if (challenge.storagePath && !challengeImages[challenge.id]) {
        const imageRef = ref(storage, challenge.storagePath);
        try {
          images[challenge.id] = await getDownloadURL(imageRef);
        } catch (error) {
          console.error(
            `Error fetching challenge image for ${challenge.id}:`,
            error
          );
        }
      }
    }
    setChallengeImages((prevImages) => ({ ...prevImages, ...images }));
  };

  useEffect(() => {
    if (currentChallenges.length > 0 || completedChallenges.length > 0) {
      fetchImages([...currentChallenges, ...completedChallenges]);
    }
  }, [currentChallenges, completedChallenges]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Activities</Text>
      {/* In Progress Section */}
      <View>
        <Text style={styles.sectionHeader}>In Progress</Text>
        {currentChallenges.length === 0 && booksDetails.length === 0 ? (
          <Text style={styles.noDataText}>No ongoing activities</Text>
        ) : (
          <>
            {currentChallenges.map((challenge) => (
              <ActivityRow
                key={challenge.id}
                imageUrl={challengeImages[challenge.id]}
                title={challenge.name}
                progress=""
                actionLabel="Continue"
                onPress={() => setSelectedChallenge(challenge)}
              />
            ))}
            {booksDetails.map((book) => (
              <ActivityRow
                key={book.id}
                imageUrl={book.coverUrl}
                title={book.title}
                progress=""
                actionLabel="Continue"
                onPress={() => setSelectedBook(book)}
              />
            ))}
          </>
        )}
      </View>
      {/* Completed Section */}
      <View>
        <Text style={styles.sectionHeader}>Completed</Text>
        {completedChallenges.length === 0 && finishedBooks.length === 0 ? (
          <Text style={styles.noDataText}>No completed activities</Text>
        ) : (
          <>
            {completedChallenges.map((challenge) => (
              <ActivityRow
                key={challenge.id}
                imageUrl={challengeImages[challenge.id]}
                title={challenge.name}
                progress="100%"
                actionLabel="Review"
                onPress={() => setSelectedChallenge(challenge)}
              />
            ))}
            {finishedBooks.map((book) => (
              <ActivityRow
                key={book.id}
                imageUrl={book.coverUrl}
                title={book.title}
                progress=""
                actionLabel="Review"
                onPress={() => setSelectedBook(book)}
              />
            ))}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1F1F1F",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D3A43E",
    paddingVertical: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: "#888",
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: "#FFF",
    marginLeft: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    color: "#888",
  },
  actionButton: {
    marginLeft: 8,
    backgroundColor: "#D3A43E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#1F1F1F",
  },
  noDataText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
  },
});

export default CurrentActivities;
