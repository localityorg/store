import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

import { View } from "../Themed";
import { BoldText, Text } from "../Common/Text";

interface ResendOTPProps {
  date: string;
  onNew: any;
}

export default function ResendOTP(props: ResendOTPProps) {
  // timer
  const [confirmTimer, setConfirmTimer] = useState<number>(1);
  const [date, setDate] = useState<string>("");

  // track of time, delivery
  const [timer, setTimer] = useState({
    over: false,
    min: 0,
    sec: 0,
  });

  useEffect(() => {
    setDate(props.date);
  }, [props.date]);

  useEffect(() => {
    confirmTimer > 0 &&
      setTimeout(() => setConfirmTimer(confirmTimer + 1), 1000);

    let currentTime = new Date();
    let expireTime = new Date(date);

    setTimer({
      over: currentTime > expireTime ? true : false,
      min: Math.abs(differenceInMinutes(expireTime, currentTime) % 60),
      sec: Math.abs(differenceInSeconds(expireTime, currentTime) % 60),
    });
  }, [confirmTimer, date]);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "transparent",
        alignSelf: "flex-start",
      }}
    >
      {timer.over ? (
        <TouchableOpacity onPress={props.onNew}>
          <BoldText underline text70>
            Resend Code
          </BoldText>
        </TouchableOpacity>
      ) : (
        <Text
          style={{
            fontSize: 14,
          }}
        >
          Request New Code in{" "}
          <BoldText text70>
            {timer.min} <Text>m</Text> {timer.sec} <Text>s</Text>
          </BoldText>
        </Text>
      )}
    </View>
  );
}
