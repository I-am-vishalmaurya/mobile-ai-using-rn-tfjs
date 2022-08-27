import {View, Image, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from './CustomButton';
import {manipulateAsync} from 'expo-image-manipulator';

export default function LoadImage(props) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let permissionsResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionsResult.granted === false) {
      Alert.alert(
        'Permission not granted',
        'Sorry, we need storage permissions to make this work!',
        [{text: 'Okay'}],
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // Resize the image to 300x300
      const resized = await manipulateAsync(result.uri, [
        {
          resize: {
            height: 320,
            width: 320,
          },
        },
      ]);
      console.log('Resized image: ', resized);
      setImage(resized.uri);
      props.setImage(resized.uri);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <CustomButton
        title="Pick an image from camera roll"
        onPress={pickImage}
        color="#357DED"
      />
      {image && (
        <View>
          <Image source={{uri: image}} style={styles.imageViewer} />
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Predict"
              onPress={() => {
                props.onPredict();
              }}
              color="#F9AB55"
            />
            <CustomButton
              title="Remove"
              onPress={() => {
                setImage(null);
              }}
              color="#ae2012"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewer: {
    marginTop: 30,
    width: 320,
    height: 320,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
});
