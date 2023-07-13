import React, { FC, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { useGeneralControl } from '../context/general-context'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationProp } from '@react-navigation/native'
import { List } from 'react-native-paper'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import Group from '../db/models/Group'
import { Database } from '@nozbe/watermelondb'
import GroupCard from '../components/GroupCard'

const ObservableGroup = withObservables(['group'], ({ group }) => ({
  group
}))(GroupCard)

export type GroupListProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  groups: Array<Group>
}

const GroupList: FC<GroupListProps> = ({ navigation, groups }) => {
  const [actions, dispatch] = useGeneralControl()

  const onAddPatients = useCallback((group: Group) => dispatch({ 
    type: actions.CONFIRM_DELETE,
    payload: { group, onDelete: () => group.deleteInstance().then(() => {
      dispatch({ type: actions.CLEAR })
    }), mode: 'group' }
  }), [])

  const onDelete = useCallback((group: Group) => dispatch({ 
    type: actions.CONFIRM_DELETE,
    payload: { group, onDelete: () => group.deleteInstance().then(() => {
      dispatch({ type: actions.CLEAR })
    }), mode: 'group' }
  }), [])

  const onEdit = useCallback((group: Group) => {
    navigation.navigate('AddGroup', {
      edit: true,
      group
    })
  }, [])

  return (
    <>
      <List.Item 
        title="Создать группу" 
        onPress={() => navigation.navigate('AddGroup')} 
        left={props => <List.Icon {...props} icon="account-multiple-plus" />}
        style={styles.addBtn}
      />
      <ScrollView style={styles.wrapper}>
          {groups?.map(group => <ObservableGroup
            key={group.id} 
            group={group}
            onDelete={onDelete}
            onEdit={onEdit}
            onAddPatient={onAddPatients}
          /> )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  addBtn: { marginTop: 15 },
  wrapper: { margin: 25 },
  button: {
    paddingLeft: 24,
    paddingRight: 16
  },
})

export default withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    groups: database.get<Group>('groups').query()
  }))(GroupList),
)
