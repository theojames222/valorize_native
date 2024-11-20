import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const TABS = [
  { name: "Summary", key: "summary" },
  { name: "Key Lessons", key: "lessons" },
  { name: "Application", key: "application" },
  { name: "Activities", key: "activities" },
];

const BookDetailsModal = ({ book, onClose }) => {
  const [coverUrl, setCoverUrl] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isTopBarExpanded, setIsTopBarExpanded] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const fetchCoverUrl = async () => {
      if (book.storagePath) {
        const coverRef = ref(storage, book.storagePath);
        const url = await getDownloadURL(coverRef);
        setCoverUrl(url);
      }
    };
    fetchCoverUrl();
  }, [book.storagePath]);

  const currentTab = TABS[activeTabIndex];

  const handleTabChange = (direction) => {
    if (direction === "next" && activeTabIndex < TABS.length - 1) {
      setActiveTabIndex((prevIndex) => prevIndex + 1);
    } else if (direction === "prev" && activeTabIndex > 0) {
      setActiveTabIndex((prevIndex) => prevIndex - 1);
    }
  };

  const renderContent = () => {
    const content = book[`${currentTab.key}Content`];
    if (!content) {
      return <Text style={styles.noContentText}>Content not available.</Text>;
    }
    return <Text style={styles.contentText}>{content}</Text>;
  };

  return (
    <Modal visible={!!book} transparent animationType="slide">
      <View style={styles.modalContainer}>
        {/* Top Bar */}
        <View
          style={[styles.topBar, isTopBarExpanded && styles.expandedTopBar]}
        >
          <View style={styles.topBarContent}>
            <Image
              source={{ uri: coverUrl || "default-book-cover.png" }}
              style={styles.bookImage}
            />
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              {isTopBarExpanded && (
                <View>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.amazonLink}>Buy on Amazon</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={styles.topBarActions}>
            <TouchableOpacity
              onPress={() => setIsTopBarExpanded(!isTopBarExpanded)}
            >
              <MaterialIcons
                name={isTopBarExpanded ? "expand-less" : "expand-more"}
                size={24}
                color="#D3A43E"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#D3A43E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            onPress={() => handleTabChange("prev")}
            disabled={activeTabIndex === 0}
          >
            <AntDesign
              name="left"
              size={24}
              color={activeTabIndex === 0 ? "#888" : "#D3A43E"}
            />
          </TouchableOpacity>
          <Text style={styles.tabName}>{currentTab.name}</Text>
          <TouchableOpacity
            onPress={() => handleTabChange("next")}
            disabled={activeTabIndex === TABS.length - 1}
          >
            <AntDesign
              name="right"
              size={24}
              color={activeTabIndex === TABS.length - 1 ? "#888" : "#D3A43E"}
            />
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.tabContent}>{renderContent()}</ScrollView>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressLabel}>Reading Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${readingProgress}%` }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#821426",
  },
  expandedTopBar: {
    paddingVertical: 24,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: 50,
    height: 70,
    borderRadius: 8,
  },
  bookDetails: {
    marginLeft: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#CCC",
  },
  amazonLink: {
    fontSize: 14,
    color: "#D3A43E",
    textDecorationLine: "underline",
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#D3A43E",
  },
  tabName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tabContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  contentText: {
    fontSize: 14,
    color: "#333",
  },
  noContentText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  progressBarContainer: {
    padding: 16,
    backgroundColor: "#EEE",
  },
  progressLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#CCC",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D3A43E",
  },
});

export default BookDetailsModal;
