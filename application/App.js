import React, { useState, useRef, useEffect } from 'react';
import { PermissionsAndroid, Platform, View, Alert, StyleSheet} from 'react-native';
import Toolbar from './components/Toolbar.js';
import MapView, { Marker } from 'react-native-maps';
import {LoginScreen, RegisterScreen} from './components/Accounts.js';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App () {
  const mapRef = useRef(null);

  // States
  const [carLocSaved, setCarLocSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Request location permission
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location Permission Granted')
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();
  }, []);

  // Re-orient map to north (compass button)
  const realignMap = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({heading: 0});
    }
  }

  const getCurrLocation = () => {

  }

  // Save user's parked car location (aka create persistent marker of current location)
  const saveLocation = () => {
    if (!carLocSaved) {
        Alert.alert(
          "Save car location?", "", [
            { 
              text: "Yes",
              onPress: () => { // IMPLEMENT CAR SAVE FUNCTION AND CALL HERE
                setCarLocSaved(true); 
              }
            },
            { 
              text: "Cancel" 
            }
          ]
        );
    } 
    else {
      Alert.alert(
        "Already saved!", "", [
          { 
            text: "Locate",
            onPress: () => Alert.alert("TODO: Move camera to saved location"),
          },
          {
            text: "Update" // TODO: Update saved car location
          },
          {
            text: "Forget", // TODO: Forget saved car location 
            onPress: () => setCarLocSaved(false)
          },
        ]
      );
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name = "Main" options={{headerShown: false}}>
          {props => (
            <View style={ styles.container }>

              <MapView 
                ref={mapRef}
                style={styles.map}
                setCamera={{
                    heading: 50,
                }}
                minZoomLevel={15}
                initialRegion={{
                    latitude: 36.81369124340123,
                    longitude: -119.7455163161234,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
              >
                {carLocSaved && (
                    <Marker
                        title = {'Your Car'}
                        coordinate = {{
                            latitude: 36.81369124340123,
                            longitude: -119.7455163161234,
                        }}
                    />
                )}
            </MapView>

              <Toolbar {...props} realignMap={realignMap} saveLocation={saveLocation}/>
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});