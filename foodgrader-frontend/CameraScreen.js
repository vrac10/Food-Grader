import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator, Text } from 'react-native';
import { Camera } from 'expo-camera';
import Svg, { Rect, Defs, Mask, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import {FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Import Picker component from @react-native-picker/picker

const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width * 0.7, height * 0.7);

const CameraScreen = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false); // State variable for loading
  const [selectedValue, setSelectedValue] = useState("normal");

  const api = async (formData) => {
    try {
      setLoading(true); 
      const response = await fetch('https://97d0-2401-4900-4e53-1983-6940-8026-d41-8418.ngrok-free.app/getNutritionInfo', {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to fetch data');
      return null;
    } finally {
      setLoading(false); 
    }
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const { uri } = await cameraRef.current.takePictureAsync({ base64: false });
        const formData = new FormData();
        formData.append('image', {
          uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
        formData.append('selectedValue', selectedValue);

        const image = await api(formData);

        if (image) {
          navigation.navigate('GradeScreen', image );
        }
      } else {
        console.log('Camera is not available or ready');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  console.log(selectedValue);
  return (
  
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={cameraRef}
        type={Camera.Constants.Type.back}
        ratio="16:9" 
      />
      <View style={styles.overlay} pointerEvents="none">
        <Svg height="100%" width="100%">
          <Defs>
            <Mask id="mask" x="0" y="0" width="100%" height="100%">
              <Rect x="0" y="0" width="100%" height="100%" fill="white" />
              <Rect
                x={(width - squareSize) / 2} 
                y={(height - squareSize) / 2} 
                width={squareSize} 
                height={squareSize} 
                fill="black" 
              />
            </Mask>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#mask)" />
        </Svg>
      </View>
      <View style={styles.searchButton}>
        <Svg width="50" height="50" viewBox="0 0 24 24" fill="none" onPress={() => {navigation.navigate('SearchScreen')}}>
          <Path d="M10 4C6.68629 4 4 6.68629 4 10C4 11.7477 4.63214 13.3534 5.66742 14.5484L2.29289 18.7071C1.90237 19.0976 1.90237 19.7304 2.29289 20.1213C2.68342 20.5118 3.31658 20.5118 3.70711 20.1213L8.64645 15.182C9.84144 16.2173 11.4472 16.85 13.195 16.85C16.5087 16.85 19.195 14.1637 19.195 10.85C19.195 7.53629 16.5087 4.85 13.195 4.85C11.4472 4.85 9.84144 5.48271 8.64645 6.51802L3.70711 1.57869C3.31658 1.18816 2.68342 1.18816 2.29289 1.57869C1.90237 1.96921 1.90237 2.60237 2.29289 2.99289L5.66742 6.36742C6.8476 5.34938 8.39048 4.75 10 4ZM13.195 14.85C10.9491 14.85 9.04514 12.9461 9.04514 10.7C9.04514 8.45486 10.9491 6.5509 13.195 6.5509C15.4409 6.5509 17.3449 8.45486 17.3449 10.7C17.3449 12.9461 15.4409 14.85 13.195 14.85Z" fill="white" />
        </Svg>
      </View>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={loading}>
        <Text> 
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            ""
          )}
        </Text>
      </TouchableOpacity>
      <View style={styles.menuButton}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          style={{ height: 90, width: 150, color: 'white', margin: 0,padding: 0 }}
          
        >
          <Picker.Item label="Normal" value="normal" />
          <Picker.Item label="Diabetic" value="diabetes" />
          <Picker.Item label="LactoseInt" value="lactoseIntolerant" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    zIndex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderWidth : 2,
    borderColor: 'black',
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    bottom: 32,
    right: -8,
    paddingLeft:6,
    fontColor: 'white',
    lineHeight:1,
    zIndex: 1,
  }
});

export default CameraScreen;
