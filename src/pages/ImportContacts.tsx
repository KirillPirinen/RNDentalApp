import React, { FC, memo, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import { useContacts } from '../utils/custom-hooks/useContacts'
import { Container, Autocomplete, FAB, EmptyList } from '../components'
import { List, Divider} from 'react-native-paper'
import { defaultExtractor } from '../utils/defaultFn'
import { useGeneralControl } from '../context/general-context'
import { useForceUpdate } from '../utils/custom-hooks/useForceUpdate'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef'
import { useToggle } from '../utils/custom-hooks/useToggle'
import { importContacts } from '../db/actions'
import { NavigationProp } from '@react-navigation/native'
import * as Contacts from 'expo-contacts'
import { t } from '@lingui/core/macro'

const footer = <View style={{ height: 120 }}></View>
const eqCompare = (prev: ItemProps, next: ItemProps) => prev.checked === next.checked

const wrapper = { marginBottom: 30 } as const

const renderIconLeft = () => <List.Icon icon="card-account-details-outline" />

type ItemProps = {
  item: AppContact;
  checked: AppContact['checked'];
}

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

type RenderedListProps = {
  result: Array<AppContact>;
  onDrop: () => void;
  onDrag: () => void;
}

const RenderedList: FC<RenderedListProps> = memo(({ result, onDrop, onDrag, ...rest }): JSX.Element => {
  const [all, inverse] = useForceUpdate(false)

  const onSelectAll = () => new Promise((res => {
    for(const contact of result) contact.checked = !all
    res(true)
  })).then(inverse)

  return (
    <>
      {Boolean(result?.length) && <List.Item
        title={all ? t`Снять выделение` : t`Выбрать всех`}
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
        ListFooterComponent={footer}
        // @ts-ignore
        // FlatList is a pure so we need to pass any prop to pass difference comparasion
        forceRerenderer={all}
        {...rest}
      />
    </>
  )
})

const renderItem = ({ item }: { item: AppContact }) => <Item item={item} checked={item.checked} />
const renderSeparator = () => <Divider bold />

type ImportContactsProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
}

type AppContact = Contacts.Contact & { checked?: boolean }

const ImportContacts: FC<ImportContactsProps> = ({ navigation }) => {
  const [isUnique, setUnique] = useToggle(true)
  const [status, contacts] = useContacts(isUnique)
  const [actions, dispatch] = useGeneralControl()

  useEffect(() => {
    navigation.setOptions({
      menu: [
      { 
        type: 'TouchableCheckbox', 
        label: t`Скрыть добавленные`, 
        onPress: setUnique,
        value: isUnique
      }
    ]
    })
  }, [isUnique])

  const onChange = (query: string) => contacts.filter(contact => contact.name.toLowerCase().includes(query.toLowerCase()));
  
  const onSubmit = () => {
    const choosed = contacts.filter(contact => (contact as AppContact).checked)
    dispatch({ type: actions.PROGRESS, payload: { 
      runJob: () => importContacts(choosed),
      // @ts-ignore
      onDone: navigation.popToTop
    }})
  }
  
  const [ref, onDrop, onDrag] = useFabControlsRef()

  return (
    <Container>
      <Autocomplete
        onChange={onChange}
        renderList={RenderedList}
        initState={contacts}
        onDrop={onDrop}
        onDrag={onDrag}
      />
      <FAB
        ref={ref} 
        label={t`Добавить`}
        onPress={onSubmit}
      />
    </Container>
  )
}

export default ImportContacts
