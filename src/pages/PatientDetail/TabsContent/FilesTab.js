import { View, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePatientFiles } from '../../../utils/custom-hooks/usePatientFiles';
import { useFilesPicker } from '../../../utils/custom-hooks/useFilesPicker';
import { useCallback, useEffect, useState, memo } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SegmentedButtons, Text } from 'react-native-paper';
import { types } from 'react-native-document-picker'
import plural from 'plural-ru';
import { ImagePreviewCard } from '../../../components'
import FileViewer from 'react-native-file-viewer';
import { useGeneralControl } from '../../../context/general-context/index';
import * as FileSystem from 'expo-file-system';
import { getSummaryExportText } from '../../../utils/getSummaryExportText';

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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'white',
    flexShrink: 1,
    borderRadius: 0,
    minWidth: '8%',
    borderWidth: 0.5
  },
  selectActionButtonPanel: { justifyContent: 'flex-start', alignItems: 'center' },
  selectedText: { paddingVertical: 5 }
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

const selectButtons = [
  {
    value: 'selectAll',
    label: 'Выделить все',
    icon: () => <MaterialCommunityIcons name='check-all' size={20} />,
    style: styles.button
  },
  {
    value: 'cancel',
    label: 'Отменить',
    icon: () => <MaterialCommunityIcons name='cancel' size={20} />,
    style: styles.button
  },
]

const actionsButtons = [
  {
    value: 'delete',
    icon: () => <MaterialCommunityIcons name='delete-alert' size={20} />,
    label: 'Удалить',
    style: styles.button
  },
  {
    value: 'export',
    label: 'Экспорт',
    icon: () => <MaterialCommunityIcons name='export' size={20} color="blue" />,
    style: styles.button
  },
]

const FilesTab = ({ patient, setCollapsed }) => {
  const [actions, dispatch] = useGeneralControl()
  const { files, addFiles, dirPath, removeFiles } = usePatientFiles(patient);
  const [{ isEdit, selectedImages, count }, setSelected] = useState(defaultState)
  const pickFiles = useFilesPicker([types.xls, types.xlsx, types.doc, types.docx, types.images, types.pdf])

  const pickFromLibrary = async () => {
    const res = await pickFiles()
    res?.length > 0 && addFiles(res)
  }

  const pickImageCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if(status === 'granted') {
      const res = await ImagePicker.launchCameraAsync(imagesImportOptions);
  
      if (!res.canceled && res.assets?.length > 0) {
        addFiles(res.assets)
      }
    }  
  };
  
  const toggleEdit = (id) => {
    if(isEdit) {
      setSelected(defaultState)
      setCollapsed(true)
      return
    }
    setSelected({ isEdit: true, count: 1, selectedImages: { [id]: true }})
    setCollapsed(false)
  }

  const toggleSelect = (id) => {
    if(isEdit) {
      setSelected(prev => {
        const prevIdState = prev.selectedImages[id]
        const count = prevIdState ? prev.count - 1 : prev.count + 1
        return { 
          isEdit: true,
          selectedImages: {...prev.selectedImages, [id]: !prevIdState },
          count
        }
      }) 
    }
  }

  const onOpen = (uri, type) => FileViewer.open(uri, { showOpenWithDialog: true }).catch(error => {
    dispatch({ 
      type: actions.INFO,
      payload: { 
        text: `На устройстве не найдено приложение для открытия типа ${type}`,
        color: 'errorContainer'
      }
    })
  })

  const [buttons, setButtons] = useState(null)

  useEffect(() => {
    if(count) {
      return setButtons(selectButtons)
    }
    setSelected(defaultState)
    setButtons(null)
    setCollapsed(true)
  }, [count])

  const onButtonPanelPress = useCallback((value) => {
      switch(value) {
        case 'library': return pickFromLibrary()
        case 'camera': return pickImageCamera()
        case 'selectAll': return setSelected(prev => ({
          ...prev, 
          count: files.length, 
          selectedImages: files.reduce((acc, file) => ((acc[file.id] = true), acc), {})
        }))
        case 'export': {
          return FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync().then(({ granted, directoryUri }) => {
            if(!granted) return

            const selectedFiles = files.filter((instance) => selectedImages[instance.id])

            patient.exportFiles(directoryUri, selectedFiles)
              .then((summary) => {
                const text = getSummaryExportText(summary.fulfilled, summary.rejected)
                text && dispatch({ 
                  type: actions.INFO,
                  payload: { text }
                })
              })
              .catch((e) => {
                dispatch({ 
                  type: actions.INFO,
                  payload: { 
                    text: `Произошла неизвестная ошибка. Попробуйте выбрать другую директорию`,
                    color: 'errorContainer'
                  }
                })
              })
              .finally(() => setSelected(defaultState))
            
          });
        }
        case 'delete': removeFiles(files.filter((instance) => selectedImages[instance.id]))
        case 'cancel': return setSelected(defaultState)
      }
  }, [selectedImages, patient])

  return (
    <View style={styles.tabWrapper}>
      {buttons && (
        <>
          <View style={styles.selectActionButtonPanel}>
            <Text variant='titleSmall' style={styles.selectedText}>{`${plural(count, 'Выделен', 'Выделено')}: ${count} ${plural(count, 'файл', 'файла', 'файлов')}`}</Text>
            <SegmentedButtons onValueChange={onButtonPanelPress} buttons={selectButtons} style={styles.buttonsPanel} />
          </View>
          <SegmentedButtons onValueChange={onButtonPanelPress} buttons={actionsButtons} style={styles.buttonsPanel} />
        </>
      )}
      <ScrollView>
        {!buttons && <SegmentedButtons onValueChange={onButtonPanelPress} buttons={addButtons} style={styles.buttonsPanel} />}
        <View style={styles.imagesWrapper}>
          {files.map(({ name, id, type, uri }) => {
            return (
              <Pressable
                key={id}
                onPress={() => isEdit ? toggleSelect(id) : onOpen(uri, type)}
                onLongPress={() => toggleEdit(id)}
                style={styles.imagePressableArea}
                >
                <ImagePreviewCard 
                  name={name}
                  type={type} 
                  uri={uri} 
                  style={styles.image}
                  size={imageWidth / 2.5}
                />
                <View style={[styles.smoke, selectedImages[id] && { display: 'flex' }]}>
                  <MaterialCommunityIcons name='check-circle' size={imageWidth / 2} color="white" />
                </View>
              </Pressable>
            )
          }
          )}
          {files?.length === 0 && <Text style={{ marginTop: 12 }}>Файлов нет</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(FilesTab)
