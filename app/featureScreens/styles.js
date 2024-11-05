// featureScreens/styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    fontSize: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#DDDDDD",
    textAlign: "center",
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: "#D3A43E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 14,
    color: "#DDDDDD",
  },
  loginLink: {
    fontSize: 14,
    color: "#D3A43E",
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bubble: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DDDDDD",
    margin: 5,
  },
  activeBubble: {
    backgroundColor: "#D3A43E",
  },
});
