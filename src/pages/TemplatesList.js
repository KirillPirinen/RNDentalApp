import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { Container, TemplateCard } from '../components'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { useModal } from '../context/modal-context'
import { ScrollView } from 'react-native-gesture-handler'

const ObservableTemplate = withObservables(['template'], ({ template }) => ({
  template
}))(TemplateCard)

const TemplatesList = ({ templates, navigation }) => {
  const [actions, dispatch] = useModal()
  
  const onDelete = useCallback((template) => {

    const onDeleteTemplate = () => template.deleteInstance().then(() => {
      dispatch({ type: actions.CLEAR })
    })

    return () => dispatch({ 
      type: actions.CONFIRM_DELETE,
      payload: { template, onDelete: onDeleteTemplate, mode: 'template' }
    })

  }, [])

  const onEdit = useCallback((template) => () => navigation.navigate('AddTemplate', {
    edit: true,
    template
  }), [])

  return (
    <ScrollView style={styles.wrapper}>
        {templates?.map(template => <ObservableTemplate
          key={template.id} 
          onDelete={onDelete}
          onEdit={onEdit} 
          template={template} 
        /> )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrapper: { margin: 25 }
})

export default withDatabase(
  withObservables([], ({ database }) => ({
    templates: database.get('templates').query()
  }))(TemplatesList),
)
