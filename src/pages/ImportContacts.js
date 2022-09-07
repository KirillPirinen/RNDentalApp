import React, { memo, useState, useRef } from 'react'
import { FlatList } from 'react-native'
import { useContacts } from '../utils/custom-hooks/useContacts'
import { Container, Autocomplete, FAB } from '../components'
import { List, Divider } from 'react-native-paper'
import { defaultExtractor } from '../utils/defaultExtracror'
import { createPatient } from '../db/actions'
import { useModal } from '../context/modal-context'

const renderIconLeft = () => <List.Icon icon="card-account-details-outline" />
const Item = memo(({ item }) => {
  const [checked, setChecked] = useState(item.checked)
  return (<List.Item
    title={item.name}
    left={renderIconLeft}
    right={() => <List.Icon icon={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}/>}
    onPress={() => {
      item.checked = !item.checked
      setChecked((prev) => !prev)
    }} 
  />)
})

const renderItem = ({ item }) => <Item item={item} />
const renderSeparator = () => <Divider bold />
const renderList = ({ result, ...rest }) => {
  return (
      <FlatList
        data={result}
        keyExtractor={defaultExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        style={{ marginVertical: 12 }}
        {...rest}
      />
  )
}

const ImportContacts = () => {

  const [status, contacts] = useContacts()
  const [actions, dispatch] = useModal()

  const onChange = (query) => 
    contacts?.data.filter(contact => contact.name.toLowerCase().includes(query))
  
  const onSubmit = () => {
    const choosed = contacts?.data //contacts.data.filter(contact => contact.checked)
    
    dispatch({ type: actions.IMPORT_PROGRESS, payload: { choosed } })

  }
    
  const buttonControls = useRef()

  const onDrug = () => buttonControls.current?.setVisible(false)
  const onDrop = () => buttonControls.current?.setVisible(true)

  return (
    <Container>
      <Autocomplete
        onChange={onChange}
        renderList={renderList}
        initState={contacts?.data}
        onScrollBeginDrag={onDrug}
        onScrollEndDrag={onDrop}
      />
      <FAB
        ref={buttonControls} 
        label={'Добавить пациентов'}
        onPress={onSubmit}
      />
    </Container>
  )
}

export default ImportContacts
