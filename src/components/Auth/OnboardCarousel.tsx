import React from "react";
import { View } from "react-native-ui-lib";
import { Image } from "react-native";

interface OnboardCarouselProps {}

const OnboardCarousel = (props: OnboardCarouselProps): JSX.Element => {
  return (
    <View flex padding-25 center>
      <Image
        source={require("../../assets/images/adaptive-icon.png")}
        style={{ height: 400, width: 400 }}
      />
    </View>
  );
};

export default OnboardCarousel;
