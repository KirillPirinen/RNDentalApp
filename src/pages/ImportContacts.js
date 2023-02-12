import React, { memo, useCallback, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import { useContacts } from '../utils/custom-hooks/useContacts'
import { Container, Autocomplete, FAB, EmptyList } from '../components'
import { List, Divider} from 'react-native-paper'
import { defaultExtractor } from '../utils/defaultFn'
import { useModal } from '../context/modal-context'
import { useForceUpdate } from '../utils/custom-hooks/useForceUpdate'
import { useSafeRefCB } from '../utils/custom-hooks/useSafeRef'
import { useToggle } from '../utils/custom-hooks/useToggle'

const eqCompare = (prev, next) => prev.checked === next.checked

const wrapper = { marginBottom: 30 }
const renderIconLeft = () => <List.Icon icon="card-account-details-outline" />

const Item = memo(({ item, checked }) => {
  const update = useForceUpdate(checked)[1]
  return (<List.Item
    title={item.name}
    left={renderIconLeft}
    right={() => <List.Icon icon={item.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}/>}
    onPress={() => {
      item.checked = !item.checked
      update()
    }} 
  />)
}, eqCompare)

const RenderedList = memo(({result, buttonControls, ...rest }) => {
  const [all, inverse] = useForceUpdate(false)

  const onSelectAll = () => new Promise((res => {
    for(let contact of result) contact.checked = !all
    res()
  })).then(inverse)


  const onDrag = useCallback(() => buttonControls.current(false), [])
  const onDrop = useCallback(() => buttonControls.current(true), [])

  return (
    <>
      {Boolean(result?.length) && <List.Item
        title={all ? 'Снять выделение' : 'Выбрать всех'}
        right={() => <List.Icon icon={all ? 'checkbox-marked' : 'checkbox-blank-outline'} />}
        onPress={onSelectAll}
      />}
      <FlatList
        data={result}
        keyExtractor={defaultExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        style={wrapper}
        ListEmptyComponent={EmptyList}
        onScrollBeginDrag={onDrag}
        onScrollEndDrag={onDrop}
        forceRerenderer={all}
        ListFooterComponent={<View style={{ height: 120 }}></View>}
        {...rest}
      />
    </>
  )
})

const renderItem = ({ item }) => <Item item={item} checked={item.checked} />
const renderSeparator = () => <Divider bold />

const ImportContacts = ({ navigation }) => {
    const [isUnique, setUnique] = useToggle(true)
    const [status, contacts] = useContacts(isUnique)
    const [actions, dispatch] = useModal()

    useEffect(() => {
      navigation.setOptions({
        menu: [
        { 
          type: 'TouchableCheckbox', 
          title: 'Скрыть добавленные', 
          onPress: setUnique,
          value: isUnique
        }
      ]
      })
    }, [])

    const onChange = (query) => 
      contacts.filter(contact => contact.name.toLowerCase().includes(query))
    
    const onSubmit = () => {
      const choosed = contacts.filter(contact => contact.checked)
      const onDone = () => navigation.popToTop()

      dispatch({ type: actions.IMPORT_PROGRESS, payload: { 
        choosed,
        onDone
      }})

    }
  
  const buttonControls = useSafeRefCB()

  return (
    <Container>
      <Autocomplete
        onChange={onChange}
        renderList={RenderedList}
        initState={contacts}
        buttonControls={buttonControls}
      />
      <FAB
        ref={buttonControls} 
        label="Добавить"
        onPress={onSubmit}
      />
    </Container>
  )
}

export default ImportContacts
