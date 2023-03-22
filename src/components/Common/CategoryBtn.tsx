import { TouchableOpacity } from "react-native";
import { Colors } from "react-native-ui-lib";

import { Text } from "./Text";

import Sizes from "../../constants/Sizes";

interface CategoryBtnProps {
  onPress: any;
  active: boolean;
  text: string;
  disabled?: boolean;
}

export default function CategoryBtn(props: CategoryBtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={Sizes.opacity.active}
      style={{
        opacity: props.disabled ? 0.5 : 1,
        borderColor: Colors.tint,
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: props.active ? Colors.tint : "transparent",
      }}
      onPress={props.onPress}
      disabled={props.disabled || false}
    >
      <Text
        style={{
          color: props.active ? Colors.$backgroundDefault : Colors.tint,
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
