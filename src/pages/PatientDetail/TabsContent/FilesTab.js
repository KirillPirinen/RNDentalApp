import { Button, Image, View, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePatientImages } from '../../../utils/custom-hooks/usePatientImages.js';
import { useCallback, useEffect, useState, memo } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SegmentedButtons } from 'react-native-paper';
import plural from 'plural-ru';

const width = Dimensions.get('window').width

const imagesImportOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.All,
  aspect: [4, 3],
  quality: 1,
  allowsMultipleSelection: true
}

const imageWidth = (width / 2) - 8

const defaultState = {
  isEdit: false,
  selectedImages: {},
  count: 0
}

const styles = StyleSheet.create({
  tabWrapper: {
    marginBottom: 50
  },
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imagePressableArea: {
    width: imageWidth,
    margin: 2.5,
    flexGrow: 1,
    height: 200,
  },
  image: {
    height: 200,
  },
  smoke: {
    display: 'none',
    backgroundColor: 'white',
    opacity: 0.5,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsPanel: {
    marginTop: 10, 
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'white',
    flexShrink: 1,
    borderRadius:0,
    minWidth: '12%'
  }
})

const addButtons = [
  {
    value: 'camera',
    label: 'Камера',
    icon: () => <MaterialCommunityIcons name='camera' size={20} color="green" />,
    style: styles.button
  },
  {
    value: 'library',
    label: 'Галлерея',
    icon: () => <MaterialCommunityIcons name='panorama-variant-outline' size={20} />,
    style: styles.button
  }
]

const selectButtons = (count) => [
  {
    value: 'delete',
    icon: () => <MaterialCommunityIcons name='delete-alert' size={20} />,
    label: `Удалить ${count} ${plural(count, 'файл', 'файла', 'файлов')}`,
    style: styles.button
  },
  {
    value: 'cancel',
    label: 'Отменить',
    icon: () => <MaterialCommunityIcons name='debug-step-over' size={20} />,
    style: styles.button
  }
]

const FilesTab = ({ patient }) => {
  const { images, addImages, dirPath } = usePatientImages(patient);
  const [{
    isEdit,
    selectedImages,
    count
  }, setSelected] = useState(defaultState)

  const pickImageLibrary = async () => {

    let result = await ImagePicker.launchImageLibraryAsync(imagesImportOptions);

    if (!result.canceled) {
      addImages(result.assets)
    }
  };

  const pickImageCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if(status === 'granted') {
      let result = await ImagePicker.launchCameraAsync(imagesImportOptions);
  
      if (!result.canceled) {
        addImages(result.assets)
      }
    }  
  };
  
  const toggleEdit = (name) => {
    if(isEdit) {
      return setSelected(defaultState)
    }
    setSelected({ isEdit: true, count: 1, selectedImages: {[name]: true }})
  }

  const toggleSelect = (name) => {
    if(isEdit) {
      setSelected(prev => {
        const prevNameState = prev.selectedImages[name]
        const count = prevNameState ? prev.count - 1 : prev.count + 1
        return { 
          isEdit: true, 
          selectedImages: {...prev.selectedImages, [name]: !prevNameState },
          count
        }
      }) 
    }
  }

  const [buttons, setButtons] = useState(addButtons)

  useEffect(() => {
    if(count) {
      return setButtons(selectButtons(count))
    } 
    setButtons(addButtons)
  }, [count])

  const onButtonPanelPress = useCallback((value) => {
      switch(value) {
        case 'cancel': return setSelected(defaultState)
        case 'library': return pickImageLibrary()
        case 'camera': return pickImageCamera()
      }
  }, [])

  return (
    <View style={styles.tabWrapper}>
      <SegmentedButtons
        onValueChange={onButtonPanelPress}
        buttons={buttons}
        style={styles.buttonsPanel}
      />
      <ScrollView>
        <View style={styles.imagesWrapper}>
          {images.map(fileName => (
              <Pressable
                onPress={() => toggleSelect(fileName)}
                onLongPress={() => toggleEdit(fileName)}
                style={styles.imagePressableArea}
                >
                <Image 
                  key={fileName} 
                  source={{ uri: `${dirPath}${fileName}` }}
                  style={styles.image}
                />
                <View style={[styles.smoke, selectedImages[fileName] && { display: 'flex' }]}>
                  <MaterialCommunityIcons name='check-circle' size={imageWidth / 2} />
                </View>
              </Pressable>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(FilesTab)
