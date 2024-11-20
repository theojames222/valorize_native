import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { auth, db } from "../firebaseConfig"; // Update the path to your Firebase config
import { doc, getDoc, collection, getDocs, signOut } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // React Navigation
import TopSection from "../components/TopSection"; // Placeholder for your components
import PodcastCard from "../components/PodcastCard"; // Adjust imports for React Native
import CurrentActivities from "../components/CurrentActivities";
import ChallengeDataContainer from "../components/ChallengeDataContainer";
import KnowledgeCenter from "../components/KnowledgeCenter";

const ModernDashboard = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [topFocusAreas, setTopFocusAreas] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("dashboard");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.navigate("Login");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data.name || "User");
          setTopFocusAreas(data.top3 || []);
          setUserLevel(data.level || 1);
        } else {
          navigation.navigate("Settings");
        }

        const subscriptionsRef = collection(
          db,
          "users",
          user.uid,
          "subscriptions"
        );
        const subscriptionSnapshot = await getDocs(subscriptionsRef);

        if (subscriptionSnapshot.empty) {
          navigation.navigate("Subscription");
          return;
        }

        const statuses = subscriptionSnapshot.docs.map(
          (doc) => doc.data().status
        );
        if (!statuses.includes("active") && !statuses.includes("trialing")) {
          navigation.navigate("Settings");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigation.navigate("Settings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D3A43E" />
      </View>
    );
  }

  const formattedUserName =
    userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedSection === "dashboard" && (
        <>
          <TopSection
            userName={formattedUserName}
            userLevel={userLevel}
            quoteOfTheDay="'The only way to do great work is to love what you do.' – Steve Jobs"
            topFocusAreas={topFocusAreas}
          />
          <PodcastCard userId={auth.currentUser?.uid} />
          <CurrentActivities userId={auth.currentUser?.uid} />
          <ChallengeDataContainer
            focusAreas={topFocusAreas}
            userId={auth.currentUser?.uid}
            userLevel={userLevel}
          />
          <KnowledgeCenter
            topFocusAreas={topFocusAreas}
            userId={auth.currentUser?.uid}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1F1F1F",
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
  },
});

export default ModernDashboard;
