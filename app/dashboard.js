// app/(tabs)/dashboard.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const DashboardScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No user data found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D3A43E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome, {userData ? userData.name : "User"}!
      </Text>

      <Text style={styles.sectionTitle}>Your Areas of Focus:</Text>
      {userData && userData.top3 ? (
        userData.top3.map((area, index) => (
          <Text key={index} style={styles.focusArea}>
            - {area}
          </Text>
        ))
      ) : (
        <Text style={styles.focusArea}>No focus areas available</Text>
      )}

      <Text style={styles.sectionTitle}>Completed Challenges:</Text>
      {userData && userData.completedChallenges ? (
        userData.completedChallenges.map((challenge, index) => (
          <View key={index} style={styles.challenge}>
            <Text style={styles.challengeText}>Title: {challenge.title}</Text>
            <Text style={styles.challengeText}>
              Duration: {challenge.duration}
            </Text>
            <Text style={styles.challengeText}>
              Focus Area: {challenge.focusArea}
            </Text>
            <Text style={styles.challengeText}>Level: {challenge.level}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.focusArea}>No challenges completed yet</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: "#D3A43E",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginVertical: 10,
    fontWeight: "bold",
  },
  focusArea: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  challenge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
  },
  challengeText: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#D3A43E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
