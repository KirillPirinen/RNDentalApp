import { memo } from 'react'
import { Text } from 'react-native-paper'

import { StyleSheet, View } from 'react-native'

export const HighlightedText = memo(({ text, query, caseSensitive, style, highlightedStyle }) => {
  const chunks = []

  const regex = new RegExp(query, caseSensitive ? 'g' : 'gi')

  let match
  
  while (query && (match = regex.exec(text))) {
    let start = match.index
    let end = regex.lastIndex

    if (end > start) {
      chunks.push({ highlight: false, start, end })
    }

    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }
  }

  if(!chunks.length) {
    return <Text style={style}>{text}</Text>
  }

  const append = (acc, start, end, highlight) => {
    if (end - start > 0) {
      acc.push({
        start,
        end,
        highlight,
        content: text.slice(start, end)
      })
    }
  }

  let lastIndex = 0
  const allChunks = chunks.reduce((acc, chunk) => {
    append(acc, lastIndex, chunk.start, false)
    append(acc, chunk.start, chunk.end, true)
    lastIndex = chunk.end

    return acc
  }, [])

  append(allChunks, lastIndex, text.length, false)

  return (
    <View style={styles.container}>
      <Text style={style}>
      {allChunks?.map(chunk => chunk.highlight ? <Text key={`${chunk.start}-${chunk.end}`} style={highlightedStyle ?? styles.hightlight}>{chunk.content}</Text>: chunk.content)}
      </Text>
    </View>
  )
  
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  hightlight: {
    backgroundColor: 'yellow',
    flexWrap: 'wrap'
  }
})
