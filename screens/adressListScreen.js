import { useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { deleteAddress, fetchAddresses } from "../services/collectionManager";
import { auth } from "../services/firebase";
import { Loader } from "../components/loadingIndicator";
import { styles } from "../styles/commonstyles";

export const AdressListScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddressesData() {
      try {
        const response = await fetchAddresses(auth.currentUser.uid);
        setAddresses(response); // Set the addresses directly without stringifying
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchAddressesData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View
      style={[styles.loadingStartScreen, { backgroundColor: "blue", flex: 1 }]}
    >
      {addresses.length ? (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id} // Assuming each address has a unique 'id' field
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemContainer,
                {
                  flex: 1,
                  alignItems: "center",
                },
              ]}
            >
              <StyledButton
                useIcon
                iconName="home-outline"
                iconSize={20}
                iconColor="white"
                buttonStyles={{ marginBottom: 15 }}
              />
              <TextTitle
                text={item.place}
                other={{ color: "white", fontSize: 14, marginBottom: 10 }}
              />
              <StyledButton
                useIcon
                iconName="ellipsis-horizontal-outline"
                iconSize={30}
                iconColor="white"
                buttonStyles={{}}
                action={() => {
                  Alert.alert(
                    "Delete Adress",
                    "Are you sure you want to delete this adress?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: async () => {
                          const updatedList = await deleteAddress(
                            auth.currentUser.uid,
                            item.place
                          );
                          setAddresses(updatedList);
                        },
                      },
                    ]
                  );
                }}
              />
            </View>
          )}
        />
      ) : (
        <TextTitle
          text="No saved adresses yet!"
          fontSize={20}
          textColor="white"
          other={{ marginTop: -120 }}
        />
      )}
    </View>
  );
};
