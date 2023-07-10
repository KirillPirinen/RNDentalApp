import React, { FC, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { TemplateCard } from '../components'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { useGeneralControl } from '../context/general-context'
import { ScrollView } from 'react-native-gesture-handler'
import Template from '../db/models/Template'
import { NavigationProp } from '@react-navigation/native'
import { Database } from '@nozbe/watermelondb'

const ObservableTemplate = withObservables(['template'], ({ template }) => ({
  template
}))(TemplateCard)

export type TemplatesListProps = {
  templates: Template[];
  navigation: NavigationProp<ReactNavigation.RootParamList>
}

const TemplatesList: FC<TemplatesListProps> = ({ templates, navigation }) => {
  const [actions, dispatch] = useGeneralControl()
  
  const onDelete = useCallback((template: Template) => {

    const onDeleteTemplate = () => template.deleteInstance().then(() => {
      dispatch({ type: actions.CLEAR })
    })

    return () => dispatch({ 
      type: actions.CONFIRM_DELETE,
      payload: { template, onDelete: onDeleteTemplate, mode: 'template' }
    })

  }, [])

  const onEdit = useCallback((template: Template) => navigation.navigate('AddTemplate', {
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
  withObservables([], ({ database }: { database: Database }) => ({
    templates: database.get<Template>('templates').query()
  }))(TemplatesList),
)
