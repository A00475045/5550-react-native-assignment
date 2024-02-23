import {Text, View, FlatList, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';


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
  
  const styles = StyleSheet.create({
    weatherContainer: {
      flex: 1,
      backgroundColor: "inherit",
      width: "100%",
      marginTop: 90,
      marginBottom: 55,
    },
    headerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    tempText: {
      fontSize: 48,
      color: "black",
      marginTop: 5,
    },
    bodyContainer: {
      flex: 2,
      alignItems: "flex-start",
      justifyContent: "flex-end",
      paddingLeft: 25,
      marginBottom: 40,
    },
    title: {
      fontSize: 48,
      color: "black",
    },
    subtitle: {
      fontSize: 24,
      color: "black",
    },
    container: {
        display: 'flex',
        backgroundColor: '#d4d4d4',
        alignItems:'center',
        justifyContent:'center',
        height:'100%'
    }
  });

function CurrentLocation({ route, navigation }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [weatherData, setWeatherData] = useState({
    temperature: "-",
    locationName: "",
    weatherCondition: "",
    conditionIcon: "",
  });

    useEffect(() => {
  (async () => {
      setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${location ? location.coords.latitude: "25"}&lon=${location ? location.coords.longitude: "25"}&APPID=ba54be19d96707cf43191d3e9adbd4f9&units=metric`
      )
        .then((res) => res.json())
        .then((json) => {
            
          // console.log(json);
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


  })();
}, []);



    return (
        <View style={styles.container}>
        {isLoading && <Image
            source={{
              uri: `https://i.gifer.com/ZZ5H.gif`,
            }}
            style={{ width: 120, height: 120 }}
          />}
        {!isLoading && <Weather weatherData={weatherData}/>}
        {errorMsg ? <Text>{errorMsg}</Text> : null}
        {/* {error ? <Text>{error}</Text> : null} */}
      </View>
  );
}

export default CurrentLocation;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: "95%",
//   },
// });