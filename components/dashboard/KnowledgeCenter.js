import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import BookDetailsModal from "./BookDetailsModal";

const KnowledgeCenter = ({ topFocusAreas, userId }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchKnowledgeCenter = async () => {
      setLoading(true);
      const allPillars = [
        "Physical",
        "Mental",
        "Mindfulness",
        "Intellectual",
        "Purpose",
        "Emotional",
      ];
      const categoriesData = [];

      try {
        for (const pillar of allPillars) {
          const booksCollectionRef = collection(
            db,
            "knowledgeCenter",
            pillar,
            "books"
          );
          const booksSnapshot = await getDocs(booksCollectionRef);
          const books = await Promise.all(
            booksSnapshot.docs.map(async (bookDoc) => {
              const bookData = bookDoc.data();
              let coverUrl = null;
              if (bookData.storagePath) {
                const coverRef = ref(storage, bookData.storagePath);
                coverUrl = await getDownloadURL(coverRef);
              }
              return {
                id: bookDoc.id,
                ...bookData,
                coverUrl,
              };
            })
          );
          categoriesData.push({ pillar, books });
        }
        setAllCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching knowledge center data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeCenter();
  }, []);

  useEffect(() => {
    if (!topFocusAreas || topFocusAreas.length === 0) return;

    const formattedFocusAreas = topFocusAreas.map(
      (area) => area.charAt(0).toUpperCase() + area.slice(1)
    );

    const filteredCategories = showAll
      ? allCategories
      : allCategories.filter((category) =>
          formattedFocusAreas.includes(category.pillar)
        );
    setCategories(filteredCategories);
  }, [showAll, allCategories, topFocusAreas]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D3A43E" />
        <Text style={styles.loadingText}>Loading Knowledge Center...</Text>
      </View>
    );
  }

  const renderBook = ({ item, pillar }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => setSelectedBook(item)}
    >
      <Image
        source={{ uri: item.coverUrl || "default-cover.png" }}
        style={styles.bookImage}
        resizeMode="contain"
      />
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.pillar}</Text>
      <FlatList
        data={item.books}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(book) => book.id}
        renderItem={(props) => renderBook({ ...props, pillar: item.pillar })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Knowledge Center</Text>
      <Text style={styles.description}>
        Discover concise summaries of impactful books to enrich your knowledge.
      </Text>

      {categories.length === 0 ? (
        <Text style={styles.noBooksText}>No books available in this view.</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.pillar}
          renderItem={renderCategory}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowAll(!showAll)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {showAll ? "Show Top Focus Areas" : "+ See All Categories"}
        </Text>
      </TouchableOpacity>

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
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
    color: "#D3A43E",
    marginTop: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#AAA",
    marginBottom: 16,
  },
  noBooksText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D3A43E",
    marginBottom: 8,
  },
  bookCard: {
    width: 160,
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  bookImage: {
    width: "100%",
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D3A43E",
  },
  bookAuthor: {
    fontSize: 12,
    color: "#AAA",
  },
  toggleButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#D3A43E",
    borderRadius: 8,
  },
  toggleButtonText: {
    color: "#1F1F1F",
    fontWeight: "bold",
  },
});

export default KnowledgeCenter;
