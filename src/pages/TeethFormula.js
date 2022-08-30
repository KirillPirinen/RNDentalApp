import React, { useCallback ,useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { Container } from '../components';
import { Teeth } from '../components/Teeth/Teeth'

const originalWidth = 289;
const originalHeight = 370;

const styles = StyleSheet.create({
  container: { flex: 1 },
  svgWrapper: { 
    width: Dimensions.get("window").width, 
    aspectRatio: originalWidth / originalHeight, 
    backgroundColor:'white',
    borderBottomWidth: 1
  }
})

const TeethFormula = ({ appointments, navigation }) => {
  const [selected, setSelected] = useState(null)

  const pressHandler = useCallback((toothNo) => () => {
    setSelected(toothNo)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
          <Teeth 
            withBabyTeeth 
            selectedTooth={selected} 
            pressHandler={pressHandler}
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${originalWidth} ${originalHeight}`}
          />
      </View>
      <Container>
        <Text>{selected}</Text>
      </Container>
    </View>
  )
}

export default TeethFormula
