import { FC, ReactNode } from 'react'
import { View, ScrollView, ScrollViewProps } from 'react-native'

const defaultStyle = {
  padding: 25,
  flex: 1
}

type ContainerProps = ScrollViewProps & {
  children: ReactNode
  scroll?: boolean;
}

const Container: FC<ContainerProps> = ({ children, scroll, ...rest }) => {
  const Component = scroll ? ScrollView : View
  return <Component style={defaultStyle} {...rest}>{children}</Component>
}


export default Container
