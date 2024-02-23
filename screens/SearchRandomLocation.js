

import { useState } from "react";
import {Text,KeyboardAvoidingView, View, StyleSheet, FlatList, Modal, TextInput, Button,Platform, TouchableOpacity  } from "react-native";




function SearchRandomLocation({ route, navigation }) {

  const [searchQuery, setSearchQuery] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [isLoading, setIsLoading] = useState("");
  const [cityList, setCityList] = useState([])
  const [isModalopen, setIsModalOpen] = useState(false);
  const handleSearch= (text) =>  {
    setSearchQuery(text);
}
  const handlePress = () => {
    setIsLoading(true);

    fetch(`https://geocode.maps.co/search?q=${searchQuery}&api_key=65d829134b032557730195xtpd27bb2`)
    .then(resp => resp.json())
    .then(res => {
      console.log(res)
      setCityList(res)
    })
    .catch((err) => {
      console.log(err)
    } )

    console.log("Press Event fired!!")
  }

  const handleItemClick = (osmId) => {
    // console.log("Item clicked:", osmId);
    cityList.map(( (item) => {
      if(item.osm_id === osmId) {
        setLatitude(item.lat)
        setLongitude(item.lon)
        setIsModalOpen(true)
      }
    }))
    // Handle click event, e.g., navigate to a new screen
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item.osm_id)}>
      <View style={{ padding: 10, borderBottomWidth: 1,
    borderBottomColor: 'gray', marginTop:10 }}>
        <Text>{item.display_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const popUp = () => {

   return <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Button title="Open Modal" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalopen}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>This is a modal</Text>
            <Button title="Close" onPress={() => setIsModalOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  }

    return (
      <View style={{ flex: 1 }}>
      {isModalopen && popUp()}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingTop: 70,
        }}
      >
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 10,
            width: "98%",
            borderRadius: 8,
          }}
          placeholder="Search..."
          onChangeText={handleSearch}
          value={searchQuery}
        />

        <View style={{ marginTop: 20 }}>
          <Button title="Press Me" onPress={handlePress} />
        </View>

        {cityList.length != 0 && <FlatList
          data={cityList}
          renderItem={renderItem}
          keyExtractor={(item) => item.osm_id.toString()}
          style={{ backgroundColor: "#d4d4d4", height: 100, marginTop: 20, width: '80%' }}
        />}
      </KeyboardAvoidingView>
    </View>
  );
}

export default SearchRandomLocation;
