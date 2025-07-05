import { FC, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { TextInput, Button, Menu, Divider, TextInputProps } from 'react-native-paper'
import { Container } from '../components'
import { useGeneralControl } from '../context/general-context'
import { createTemplate } from '../db/actions'
import { useToggle } from '../utils/custom-hooks/useToggle'
import { replaceStringByIndex } from '../utils/insertString'
import { NavigationProp } from '@react-navigation/native'
import { t } from '@lingui/core/macro'

export type AddTemplateProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  route: { params?: ReactNavigation.RootParamList['AddTemplate'] }
}

type ViewWithAnchor<V extends View = View> = V & { anchor?: {x: number, y: number }}

const AddTemplate: FC<AddTemplateProps> = ({ navigation, route: { params } }) => {

  const template = params?.template 
  const isEdit = params?.edit

  const [name, setName] = useState<string>(template?.name || '')
  const [text, setText] = useState<string>(template?.text || '')
  const [visible, toggleVisible] = useToggle()
  const [error, setError] = useState<{ name?: boolean }>({})
  const [actions, dispatch] = useGeneralControl()

  const selection = useRef<{ start: number; end: number; }>()
  const ref = useRef<ViewWithAnchor | null>(null)

  const onSelection: TextInputProps['onSelectionChange'] = (event) => {
    selection.current = event.nativeEvent.selection
  }

  const onLayout = () => {
    ref.current?.measureInWindow?.((x, y, width, height) => {
      ref.current!.anchor = {x: width - 20, y: y + 50}
    })
  }

  const onInsertTag = (tag: string) => () => {
    const carret = selection.current

    toggleVisible()

    if(carret) {
      return setText(prev => replaceStringByIndex(prev, tag, carret.start, carret.end))
    }

    setText(tag)
    
  }

  const onSubmit = () => {
    if(!name) {
      return setError({ name: true })
    }

    if(isEdit) {
      return template?.updateInstance({ text, name }).then(navigation.goBack)
    }

    createTemplate({ text, name }).then(() => {
      setTimeout(() => {
        dispatch({ 
          type: actions.INFO,
          payload: { 
            text: t`Вы успешно добавили новый шаблон`
          }
        })
      }, 500)
      // @ts-ignore
      navigation.popToTop()
    })
  }

  const onChangeTextName = (text: string) => {
    if(error.name) setError({})
    setName(text)
  }

  return (
      <ScrollView keyboardShouldPersistTaps='handled'>
        <Container>
          <TextInput
            label={t`Название шаблона`}
            mode="outlined"
            value={name}
            onChangeText={onChangeTextName}
            error={error.name}
          />
          <View ref={ref} onLayout={onLayout}>
            <TextInput
              label={t`Текст`}
              mode="outlined"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={10}
              style={styles.multiline}
              onSelectionChange={onSelection}
              right={<TextInput.Icon icon="variable" onPress={toggleVisible}/>}
            />
            <Menu
              visible={visible}
              onDismiss={toggleVisible}
              anchor={ref.current?.anchor}
              contentStyle={{ backgroundColor: 'white' }}
            >
              <Menu.Item
                style={styles.item}
                titleStyle={styles.itemTitle} 
                onPress={onInsertTag('[-date-]')} 
                title={t`Дата приема`}
              />
              <Divider bold/>
              <Menu.Item
                style={styles.item}
                titleStyle={styles.itemTitle} 
                onPress={onInsertTag('[-time-]')} 
                title={t`Время приема`}
              />
              <Divider bold/>
              <Menu.Item
                style={styles.item}
                titleStyle={styles.itemTitle} 
                onPress={onInsertTag('[-name-]')} 
                title={t`Имя пациента`}
              />
            </Menu>
          </View>
          <Button 
            style={{ marginTop: 30 }} 
            icon="plus-thick" 
            mode="contained" 
            buttonColor={'green'}
            onPress={onSubmit}
          >
            {isEdit ? t`Сохранить изменения` : t`Добавить шаблон`}
          </Button>
        </Container>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  multiline: { marginTop: 20 },
  itemTitle: { fontSize:14 },
  item: { height: 40 }
})

export default AddTemplate

