import { Video, ResizeMode } from "expo-av";
import { Dimensions } from "react-native";

import { styles } from "../styles/commonstyles";

export const VideoBackground = () => {
  const { height } = Dimensions.get("window");
  return (
    <Video
      source={require("../resources/videos/travel-background-video.mp4")}
      isMuted
      repeat
      rate={0.8}
      useNativeControls={false}
      resizeMode={ResizeMode.COVER}
      isLooping
      shouldPlay
      style={[styles.backgroundVideo, { height }]}
      onLoad={() => console.log("Video loaded")}
    />
  );
};
