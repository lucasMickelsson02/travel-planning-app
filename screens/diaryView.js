import { Text, View, Image, StyleSheet } from "react-native";
import { deviceHeight, deviceWidth } from "../utils/dimensions";
import { TextTitle } from "../components/textTitle";

export const DiaryViewScreen = ({ route }) => {
  const { diary } = route.params;

  return (
    <View style={styles.rootContainer}>
      <View style={styles.diaryContainer}>
        <TextTitle
          text={diary.title}
          fontSize={20}
          other={{ alignSelf: "center", marginBottom: 35 }} // Center the title and add space below
        />

        <View style={styles.borderStyle}>
          <TextTitle
            text={diary.date}
            other={{ alignSelf: "flex-start" }} // Align date text to the left
          />
        </View>

        <TextTitle
          text={diary.description}
          other={styles.roundedBorder} // Align description text to the left and add space above it
        />
        {
          /*diary.cloudfile[diary.cloudfile.length - 1].url*/ diary.cloudfile ? (
            <Image
              style={styles.diaryImage}
              source={{
                uri: diary.cloudfile[diary.cloudfile.length - 1].url,
              }}
            />
          ) : (
            <Image
              style={styles.diaryImage}
              source={require("../resources/images/sunset.jpg")}
            />
          )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "blue",
  },
  diaryContainer: {
    width: deviceWidth - 40,
    backgroundColor: "white",
    height: deviceHeight - 170,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start", // Align items to the left
    padding: 20, // Add some padding for better presentation
    borderRadius: 10,
  },
  borderStyle: {
    width: "100%", // Full width of the container
    borderBottomWidth: 1, // Thickness of the border
    borderBottomColor: "lightgrey", // Color of the border
    marginBottom: 15, // Space below the date
    paddingBottom: 10, // Space between the text and the border
  },
  roundedBorder: {
    alignSelf: "flex-start",
    marginTop: 20,
    width: "100%", // Full width of the container
    borderWidth: 1, // Thickness of the border
    borderColor: "lightgrey", // Color of the border
    borderRadius: 10, // Round the corners
    marginBottom: 5, // Space below the border container
    padding: 10, // Space inside the border
    backgroundColor: "white", // Background color inside the border
  },
  diaryImage: {
    width: 300,
    height: 300,
    marginTop: 55,
    alignSelf: "center",
  },
});
