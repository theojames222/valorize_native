import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PodcastCard = ({ userId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Morning Forge Podcast</Text>
      {userId ? <Text>User ID: {userId}</Text> : <Text>No User ID Found</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: "#D3A43E",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default PodcastCard;
