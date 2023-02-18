import { Button, Image, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePatientImages } from '../../../utils/custom-hooks/usePatientImages.js';

const width = Dimensions.get('window').width

const FilesTab = ({ patient }) => {
  const { images, addImages, dirPath } = usePatientImages(patient);
  
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      addImages(result.assets)
    }
  };
  
  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <ScrollView>
        <View style={styles.imagesWrapper}>
          {images.map(fileName => <Image key={fileName} source={{ uri: `${dirPath}${fileName}` }} style={styles.image} />)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40
  },
  image: {
    width: (width / 2) - 8, 
    height: 200,
    margin: 2.5,
    flexGrow: 1
  }
})

export default FilesTab
