import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("screen");

export default {
  screen: {
    height: height,
    width: width,
  },
  icon: {
    header: 24,
    normal: 20,
    small: 18,
  },
  font: {
    header: 30,
    title: 18,
    text: 16,
    small: 12,
  },
  opacity: {
    active: 0.6,
    thumbnail: 0.5,
  },
};
