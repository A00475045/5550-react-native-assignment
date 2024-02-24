

import { useEffect, useState } from "react";
import { Text, KeyboardAvoidingView, View, StyleSheet, FlatList, Modal, TextInput, Button, Alert, Platform, TouchableOpacity, Image } from "react-native";
import * as SQLite from "expo-sqlite";




function SearchRandomLocation() {

  const [searchQuery, setSearchQuery] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [cityName, setCityName] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [weatherData, setWeatherData] = useState({
    temperature: "-",
    locationName: "",
    weatherCondition: "",
    conditionIcon: "",
  });
  const [cityList, setCityList] = useState([])
  const [isModalopen, setIsModalOpen] = useState(false);

  function getDatabase() {
    // Error handling, in case the platform is web (expo-sqlite does not support web)
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => { },
          };
        },
      };
    }

    const db = SQLite.openDatabase("weatherData.db");
    return db;
  }

  const db = getDatabase();


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


  const handleSearch = (text) => {
    setSearchQuery(text);
  }
  const handlePress = () => {
    setIsLoading(true);

    fetch(`https://geocode.maps.co/search?q=${searchQuery}&api_key=65d829134b032557730195xtpd27bb2`)
      .then(resp => resp.json())
      .then(res => {
        setCityList(res)
        // console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

  }

  useEffect(() => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=ba54be19d96707cf43191d3e9adbd4f9&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        setWeatherData({
          temperature: json.main.temp,
          locationName: json.name,
          weatherCondition: json.weather[0].main,
          conditionIcon: json.weather[0].icon,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });

  }, [longitude])
  const handleItemClick = async (osmId) => {
    setIsLoading(true)
    setIsModalOpen(true)
    cityList.map(((item) => {
      if (item.osm_id === osmId) {
        setLatitude(item.lat)
        setLongitude(item.lon)
        setCityName(item.display_name)
      }


    })
    )
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS city (name TEXT , lon TEXT, lat TEXT);",
        (txObj, resultSet) => {
          console.log("Rows affected: ", resultSet.rowsAffected);
        },
        (txObj, error) => {
          console.log("Error executing SQL: ->", error);
        }// callback
      );
    });

    // Select all data from table `todos`
    db.transaction((tx) => {
      // tx.executeSql(`DELETE FROM cities;`, [], (_, { rows: { _array } }) =>
      tx.executeSql(`SELECT * FROM city;`, [], (_, { rows: { _array } }) => { }
      );
    });
  }, []);



  const Weather = ({ weatherData }) => {
    return (
      <View style={styles.weatherContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri: `http://openweathermap.org/img/wn/${weatherData.conditionIcon}@2x.png`,
            }}
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.tempText}>{weatherData.locationName}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>{weatherData.temperature}{weatherData.temperature != "-" ? "˚" : ""}</Text>
          <Text style={styles.subtitle}>{weatherData.weatherCondition}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item.osm_id)}>
      <View style={{
        padding: 10, borderBottomWidth: 1,
        borderBottomColor: 'gray', marginTop: 10
      }}>
        <Text>{item.display_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const exist = (arr) => {
    arr.map((item) => {
      if (item.name === cityName) return true;
    })
    return false;
  }

  const saveLocation = () => {

    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM city;`, [], (_, { rows: { _array } }) => {
        if (_array.length > 3) {
          Alert.alert(
            'Bookmark Limit Reached',
            'You can only bookmark 4 locations at a time!',
            [
              {
                text: 'OK',
                // onPress: () => {return},
              },
            ],
            { cancelable: false }
          );
          return
        } else if (exist(_array)) {
          return
        }
        else {
          db.transaction((tx) => {
            tx.executeSql("INSERT INTO city (name , lon , lat) VALUES (?, ?, ?)", [cityName, longitude.toString(), latitude.toString()],
              (txObj, resultSet) => {
                console.log("Rows affected: ", resultSet.rowsAffected);
              },
              (txObj, error) => {
                console.log("Error executing SQL: ", error);
              }
            );
          });
          setIsModalOpen(false)
        }
      }
      );
    });




  }

  const popUp = () => {

    return <View style={{
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* <Button title="Open Modal" onPress={() => setModalVisible(true)} /> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalopen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
      >

        <View style={styles.centeredView}>
          {isLoading && <Image
            source={{
              uri: `https://i.gifer.com/ZZ5H.gif`,
            }}
            style={{ width: 120, height: 120 }}
          />}
          {!isLoading && <View style={styles.modalView}>
            <Weather weatherData={weatherData} />
            <Button title="Close" onPress={() => { setIsModalOpen(false) }} />
            <Button title="Save" onPress={saveLocation} />
          </View>}
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
          placeholder="Search Location..."
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
