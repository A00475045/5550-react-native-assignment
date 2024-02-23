

// ...



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1


import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { Text } from 'react-native';
import CurrentLocation from './screens/CurrentLocation';
import SavedLocation from "./screens/SavedLocation";
import SearchRandomLocation from "./screens/SearchRandomLocation";

const Tab = createBottomTabNavigator();

export default function App() {

  const screenOptions =  ({ route }) => ({
    headerTintColor: "#282120",
    headerStyle: { backgroundColor: "#00BFFF" },
    headerTitleStyle: { color: "#282120" },
    gestureEnabled: true, // Enable the screen gesture
    gestureDirection: "horizontal", // Set the direction of the screen gesture
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      // console.log(route.name);
      if (route.name === 'Current Location') {
        iconName = focused ? 'location' : 'location-outline';
      } else if (route.name === 'Search') {
        iconName = focused ? 'search' : 'search-outline';
      } else if (route.name === 'Bookmarks') {
        iconName = focused ? 'bookmark' : 'bookmark-outline';
      }

      return <Ionicons name={iconName} size={size} color={"#282120"} />;
    },
    tabBarLabel: ({ focused, color }) => {
      let label = route.name;
      return <Text style={{ color: "#282120" }}>{label}</Text>;
    },
  });

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Current Location" component={CurrentLocation} />
          <Tab.Screen name="Search" component={SearchRandomLocation}/>
          <Tab.Screen name="Bookmarks" component={SavedLocation}/>
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}


////////////////////////////////////

// import { StatusBar } from 'expo-status-bar';
// import { NavigationContainer} from "@react-navigation/native";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import TabComponent from "./screens/TabComponent";
// import { StyleSheet} from 'react-native';
// import CurrentLocation from './screens/CurrentLocation';
// import SavedLocation from "./screens/SavedLocation";
// import SearchRandomLocation from "./screens/SearchRandomLocation";



// const Tab = createBottomTabNavigator();
 

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


// export default function App() {

//   const screenOptions = {
//     headerTintColor: "#282120",
//     headerStyle: { backgroundColor: "#FAD02C" },
//     headerTitleStyle: { color: "#282120" },
//     gestureEnabled: true, // Enable the screen gesture
//     gestureDirection: "horizontal", // Set the direction of the screen gesture
//   };

//   return (

//     <>
//     <StatusBar style="dark" />

    
//     <NavigationContainer>
//     <Tab.Navigator screenOptions={screenOptions}>

//       <Tab.Screen name="Current Location" component={CurrentLocation} options={} />
//       <Tab.Screen name="Search any locations" component={SearchRandomLocation} />
//       <Tab.Screen name="Saved " component={SavedLocation} />

    
//     </Tab.Navigator>
    

//     </NavigationContainer>
//     </>

//     // <View style={styles.container}>
//     //   <Text>Open up App.js to start working on your app!</Text>
//     //   <StatusBar style="auto" />
//     // </View>
//   );
// }

