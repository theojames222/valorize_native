// Dashboard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PodcastCard from "../../components/PodcastCard";
import FocusArea from "../../components/FocusAreaSection";

const Dashboard = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [topFocusAreas, setTopFocusAreas] = useState([]);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data.name);
          setTopFocusAreas(data.top3 || []);
          setCurrentChallenges(data.currentChallenges || []);
          setCompletedChallenges(data.completedChallenges || []);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#D3A43E" />;

  const formattedUserName = userName
    ? userName.charAt(0).toUpperCase() + userName.slice(1)
    : "User";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {formattedUserName}!</Text>
        <Button title="Logout" onPress={handleLogout} color="#821426" />
      </View>

      {/* Pass the userId to PodcastCard */}
      <PodcastCard userId={userId} />

      {/* Other Dashboard sections can go here */}

      <FocusArea topFocusAreas={topFocusAreas} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1F1F1F",
  },
  header: {
    marginTop: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5EAD0",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F5EAD0",
    marginBottom: 10,
  },
  focusArea: {
    fontSize: 16,
    color: "#F5EAD0",
  },
  noDataText: {
    fontSize: 16,
    color: "#F5EAD0",
  },
});

export default Dashboard;
