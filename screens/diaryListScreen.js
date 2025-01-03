import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { View, Button, Text, Platform, TouchableOpacity } from "react-native";

import { TextTitle } from "../components/textTitle";
import { fetchDiaries } from "../services/collectionManager";
import { auth } from "../services/firebase";
import { buttonStyles } from "../styles/buttonStyles";
import { useNavigation } from "@react-navigation/native";

export const DiaryListScreen = () => {
  const [diary, setDiary] = useState();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function diaries() {
      let findDiary = false;
      const diaries = await fetchDiaries(auth.currentUser.uid);
      if (diaries.length) {
        diaries.forEach((diaryData) => {
          const dateOnly = date.toISOString().split("T")[0];

          if (diaryData.date === dateOnly) {
            setDiary(diaryData);
            findDiary = true;
          }
        });
        if (!findDiary) {
          setDiary();
        }
      } else {
        setDiary();
      }
    }
    diaries();
  }, [date]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // Keep it open for iOS
    setDate(currentDate);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "blue",
      }}
    >
      <TextTitle
        text="Please view your stories by selecting a date"
        fontSize={25}
        textColor="white"
        other={{ padding: 10 }}
      />
      <TextTitle
        text={`Date: ${date.toDateString()}`}
        fontSize={23}
        textColor="white"
      />

      <Button onPress={() => setShow(true)} title="Select Date" />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={onChange}
        />
      )}
      {diary ? (
        <TouchableOpacity
          onPress={() => {
            console.log(diary);
            navigation.navigate("DiaryView", { diary });
          }}
          style={[
            buttonStyles.diaryButton,
            {
              width: "90%",
              height: 80,
              borderRadius: 10,
              justifyContent: "center", // Center items vertically
              alignItems: "center", // Center items horizontally
              flexDirection: "column", // Ensure column layout (default)
            },
          ]}
        >
          <TextTitle
            text={`${diary.date}`}
            textColor="grey"
            other={{ alignSelf: "flex-start", marginLeft: 30 }}
          />
          <TextTitle
            text={diary.title}
            fontSize={16}
            other={{ marginTop: 10, alignSelf: "center" }}
          />
        </TouchableOpacity>
      ) : (
        <TextTitle
          text="No diaries saved on this date!"
          fontSize={16}
          textColor="white"
          other={{ padding: 10 }}
        />
      )}
    </View>
  );
};
