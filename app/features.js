import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feature1 from "./featureScreens/Feature1";
import Feature2 from "./featureScreens/Feature2";
import Feature3 from "./featureScreens/Feature3";
import Feature4 from "./featureScreens/Feature4";

const FeatureScreen = () => {
  // Track the current feature index
  const [currentFeature, setCurrentFeature] = useState(0);

  // Array of feature components
  const features = [<Feature1 />, <Feature2 />, <Feature3 />, <Feature4 />];

  // Navigation functions
  const nextFeature = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1);
    }
  };

  const previousFeature = () => {
    if (currentFeature > 0) {
      setCurrentFeature(currentFeature - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the current feature component */}
      {features[currentFeature]}

      {/* Pagination Controls
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={previousFeature}
          disabled={currentFeature === 0}
        >
          <Text
            style={[
              styles.paginationText,
              currentFeature === 0 && styles.disabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextFeature}
          disabled={currentFeature === features.length - 1}
        >
          <Text
            style={[
              styles.paginationText,
              currentFeature === features.length - 1 && styles.disabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  paginationText: {
    fontSize: 18,
    color: "#D3A43E",
  },
  disabled: {
    color: "#ccc",
  },
});

export default FeatureScreen;
