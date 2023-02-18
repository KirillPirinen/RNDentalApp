import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet, RNFS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const saveImage = async (assset) => {

    const fileName = assset.uri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}${fileName}`;
    try {

      // const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      // console.log(files, 'files')
      const res = await FileSystem.moveAsync({
        from: assset.uri,
        to: newPath,
      });

      console.log(res, 'res')
    } catch (err) {
      console.log(err);
    }
  
};

export default function ImagePickerExample() {
  const [image, setImage] = useState([]);

  useEffect(() => {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(setImage)
  }, [])

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      saveImage(result.assets[0])
    }
  };
  
  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <View style={styles.imagesWrapper}>
        {image.map(fileName => <Image key={fileName} source={{ uri: `${FileSystem.documentDirectory}${fileName}` }} style={styles.image} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  image: {
    width: 100, 
    height: 100
  }
})
