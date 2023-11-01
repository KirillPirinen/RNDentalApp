import React, { FC, useCallback, useEffect, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import Group from '../db/models/Group'
import { useNavigation } from '@react-navigation/native'
import { plural } from '@lingui/macro'

export type PatientGroupListProps = {
  groups: Group[];
  style: StyleProp<ViewStyle>
}

const MAX_HEIGHT = 30

export const PatientGroupList: FC<PatientGroupListProps> = ({ groups, style }) => {
  const navigation = useNavigation()
  const [initialHeight, setInitialHeight] = useState(0)
  const [collapsed, setCollapsed] = useState(true)

  useEffect(() => {
    return () => setInitialHeight(0)
  }, [groups])

  const onLayout = useCallback((e: any) => {
    if (initialHeight !== 0) return;

    if (e.nativeEvent.layout.height > MAX_HEIGHT && collapsed) {
      setCollapsed(false)
    }

    setInitialHeight(e.nativeEvent.layout.height)
  }, [initialHeight])

  const wrapperStyle = {
    flex: 1,
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 5,  
    overflow: 'hidden',
    ...(!collapsed && { maxHeight: MAX_HEIGHT })
  } as const

  return (
    <View onLayout={onLayout} style={[{ flexDirection: 'row' }, style]}>
      <View style={wrapperStyle}>
        <Text style={{ paddingLeft: 4, paddingTop: 6 }}>{plural(groups.length, {
          one: 'Группа',
          other: 'Группы'
        })}:</Text>
        {groups.map((group, i) => (
            <Text 
              key={group.id}
              onPress={() => navigation.navigate('AddGroup', { group, edit: true })}
              style={{
                borderWidth: 1,
                borderColor: group.color ?? 'black',
                paddingHorizontal: 5,
                paddingVertical: 1,
                marginHorizontal: 3,
                marginTop: 4
              }}
            >
              {group.name}
          </Text>
        ))}
      </View>
      {initialHeight > MAX_HEIGHT && (
        <IconButton 
          icon={collapsed ? "chevron-up" : "chevron-down"}
          style={styles.collapseBtn}
          onPress={() => setCollapsed(!collapsed)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  collapseBtn: { height: 18 }
})
