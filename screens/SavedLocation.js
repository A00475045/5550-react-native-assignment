import { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, Platform, Modal, Image, TouchableOpacity, Button, KeyboardAvoidingView } from "react-native";
import * as SQLite from "expo-sqlite";
import { Ionicons } from '@expo/vector-icons';
// import BookItem from "../components/BookItem";

// import { CATEGORIES, BOOKS } from "../data";

function SavedLocation({ route, navigation }) {

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
    const [cityList, setCityList] = useState([])
    const [isModalopen, setIsModalOpen] = useState(false);

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
                        {/* <Button title="Save" onPress={saveLocation} /> */}
                    </View>}
                </View>
            </Modal>
        </View>
    }

    const handleItemClick = (name) => {
        setIsLoading(true)
        setIsModalOpen(true)
        cityList.map(((item) => {
            if (item.name === name) {
                setLatitude(item.lat)
                setLongitude(item.lon)
                setCityName(item.name)
            }


        })
        )
    }
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

    const deleteFromList = (name) => {
        db.transaction((tx) => {
            // console.log("in delete   -", name, "-")
            tx.executeSql(
                `DELETE FROM city WHERE name = '${name}'`,
                (txObj, resultSet) => {
                    console.log("Rows affected: ", resultSet.rowsAffected);
                },
                (txObj, error) => {
                    console.log("Error executing SQL: ", error);
                } // callback
            );
        });
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM city;`, [], (_, { rows: { _array } }) =>
                setCityList(_array)
            );
        });
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
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemClick(item.name)} style={{ marginBottom: 10 }}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1, fontSize: 16 }}>{item.name}</Text>
                <TouchableOpacity onPress={() => { deleteFromList(item.name) }} style={{ padding: 5 }}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>

    );

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

        const db = SQLite.openDatabase("weatherData2.db");
        // console.log(db);
        return db;
    }

    const db = getDatabase();


    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM city;`, [], (_, { rows: { _array } }) =>
                setCityList(_array)
            );
        });
    }, [], [cityList])
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        // Perform your hard refresh logic here

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM city;`, [], (_, { rows: { _array } }) =>
                setCityList(_array)
            );
        });
        setRefreshing(false);

        // setTimeout(() => {
        //     // Reset the refreshing state after some delay

        // }, 1000); // Simulating a delay of 1 second before resetting the refreshing state
    };

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
                <Button title="Reload List " onPress={handleRefresh} />
                {refreshing ? (
                    <Text>Reloading the list...</Text>
                ) : (
                        <FlatList
                            data={cityList}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.name}
                            style={{ backgroundColor: "#d4d4d4", height: 100, marginTop: 20, width: '80%' }}
                        />
                    )}
            </KeyboardAvoidingView>
        </View>
        //=========================
        // <View style={{ flex: 1 }}>
        //     {isModalopen && popUp()}
        //     <KeyboardAvoidingView
        //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        //         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        //         style={{
        //             flex: 1,
        //             justifyContent: "center",
        //             alignItems: "center",
        //             paddingHorizontal: 8,
        //             paddingTop: 70,
        //         }}
        //     >
        //         {cityList.length != 0 && <FlatList
        //             data={cityList}
        //             renderItem={renderItem}
        //             keyExtractor={(item) => item.name}
        //             style={{ backgroundColor: "#d4d4d4", height: 100, marginTop: 20, width: '80%' }}
        //         />}
        //         {
        //             //    cityList.length === 0 && <Text>There are now locations bookmarked</Text>
        //         }
        //     </KeyboardAvoidingView>
        // </View>
        //=============================



        // <View style= {{flex: 1,display:"flex", justifyContent:"center", alignItems:"center"}}>

        // </View>
    );
}

export default SavedLocation;
